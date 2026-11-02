"""여행 계획 Agent. 사용: python main.py [trip.toml]"""
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tomllib
from datetime import date, datetime, time, timedelta
from typing import Optional, TypedDict, TypeVar
from zoneinfo import ZoneInfo

from langchain_ollama import ChatOllama
from langgraph.graph import END, StateGraph
from pydantic import BaseModel

KST = ZoneInfo("Asia/Seoul")

DAY_START = time(9, 0)
DAY_END = time(22, 0)
AIRPORT_TRANSFER = timedelta(minutes=45)
AIRPORT_BUFFER = timedelta(hours=2)
CHECKOUT = time(12, 0)
EARLY_ARRIVAL_START = time(13, 0)  # ponytail: 새벽 도착일 일정 시작. 고정값, 필요하면 config로

REQUIRED_TRIP_FIELDS = ["destination", "tz", "start", "end", "travelers"]


def load_input(path: str) -> dict:
    with open(path, "rb") as f:
        data = tomllib.load(f)

    trip = data.get("trip")
    if trip is None:
        raise ValueError("trip.toml: [trip] 섹션 없음")

    for field in REQUIRED_TRIP_FIELDS:
        if trip.get(field) is None:
            raise ValueError(f"trip.toml: trip.{field} 필드 없음")

    try:
        ZoneInfo(trip["tz"])
    except Exception as e:
        raise ValueError(f"trip.toml: trip.tz 잘못됨 ({trip['tz']})") from e

    if not isinstance(trip["start"], date) or not isinstance(trip["end"], date):
        raise ValueError("trip.toml: trip.start/end는 날짜여야 함")
    if trip["start"] > trip["end"]:
        raise ValueError("trip.toml: trip.start가 trip.end보다 늦음")
    if not isinstance(trip["travelers"], int) or trip["travelers"] < 1:
        raise ValueError("trip.toml: trip.travelers는 1 이상 정수여야 함")

    trip.setdefault("request", "")

    flights = data.get("flights", [])
    for fl in flights:
        if not isinstance(fl.get("depart"), datetime) or not isinstance(fl.get("arrive"), datetime):
            raise ValueError("trip.toml: flights[].depart/arrive는 datetime이어야 함")
        if fl["depart"] >= fl["arrive"]:
            raise ValueError("trip.toml: flights[].depart가 arrive보다 늦음")
    trip["flights"] = flights

    stays = data.get("stays", [])
    for s in stays:
        if not s.get("name") or not isinstance(s.get("check_in"), date) or not isinstance(s.get("check_out"), date):
            raise ValueError("trip.toml: stays[].name/check_in/check_out 필요")
    trip["stays"] = stays

    return trip


def _to_local(dt_kst_naive: datetime, local_tz: ZoneInfo) -> datetime:
    return dt_kst_naive.replace(tzinfo=KST).astimezone(local_tz)


def timeline(trip: dict) -> tuple[list[dict], list[str]]:
    local_tz = ZoneInfo(trip["tz"])
    flights = trip.get("flights") or []

    arrival_local = _to_local(flights[0]["arrive"], local_tz) if flights else None
    departure_local = _to_local(flights[-1]["depart"], local_tz) if flights else None
    cutoff = (departure_local - AIRPORT_BUFFER - AIRPORT_TRANSFER) if departure_local else None

    windows = []
    d = trip["start"]
    while d <= trip["end"]:
        start = DAY_START
        end = DAY_END
        note = ""
        no_window = False

        if arrival_local is not None and d < arrival_local.date():
            no_window = True
            note = "도착 전"
        elif cutoff is not None and d > cutoff.date():
            no_window = True
            note = "출발 cutoff 이후"
        else:
            if arrival_local is not None and d == arrival_local.date():
                arrived_ready = (arrival_local + AIRPORT_TRANSFER).time()
                start = max(DAY_START, arrived_ready)
                if time(0, 0) <= arrival_local.time() < time(6, 0):
                    start = max(start, EARLY_ARRIVAL_START)  # 새벽 도착: 수면 후 낮부터
            if cutoff is not None and d == cutoff.date():
                end = min(DAY_END, cutoff.time())
            if start >= end:
                no_window = True
                note = "가용 시간 없음"

        windows.append({
            "date": d,
            "start": None if no_window else start,
            "end": None if no_window else end,
            "note": note,
        })
        d += timedelta(days=1)

    warnings = []
    stays = sorted(trip.get("stays") or [], key=lambda s: s["check_in"])
    if stays:
        first_stay, last_stay = stays[0], stays[-1]
        if arrival_local is not None and time(0, 0) <= arrival_local.time() < time(6, 0):
            if first_stay["check_in"] == arrival_local.date():
                warnings.append(
                    "전날 체크인으로 예약해야 도착 당일 새벽에 방 있음"
                )
        if cutoff is not None:
            checkout_dt = datetime.combine(last_stay["check_out"], CHECKOUT, tzinfo=local_tz)
            if checkout_dt < cutoff:
                warnings.append(
                    "체크아웃 후 출발까지 숙소 없음: 짐 보관·레이트 체크아웃 필요"
                )

    return windows, warnings


def validate(itinerary: dict, windows: list[dict]) -> list[str]:
    windows_by_date = {w["date"]: w for w in windows}
    errors = []

    for day in itinerary.get("days", []):
        d = day["date"]
        items = day.get("items", [])
        window = windows_by_date.get(d)

        for item in items:
            if item["start"] >= item["end"]:
                errors.append(f"{d} '{item['title']}': start가 end보다 늦거나 같음")

        sorted_items = sorted(items, key=lambda i: i["start"])
        for a, b in zip(sorted_items, sorted_items[1:]):
            if a["end"] > b["start"]:
                errors.append(f"{d} '{a['title']}'와 '{b['title']}' 시간 겹침")

        for item in items:
            if window is None or window["start"] is None:
                errors.append(f"{d} '{item['title']}': 그날 가용 시간 없음")
            elif item["start"] < window["start"] or item["end"] > window["end"]:
                errors.append(f"{d} '{item['title']}': 가용 시간({window['start']}~{window['end']}) 벗어남")

    return errors


class _TripStateRequired(TypedDict):
    trip: dict


class TripState(_TripStateRequired, total=False):
    windows: list[dict]
    warnings: list[str]
    stay: list[dict]
    activities: list[dict]
    food: list[dict]
    transport: dict
    prep: dict
    itinerary: dict
    errors: list[str]
    retries: int


class StayCandidate(BaseModel):
    name: str
    region: str
    price_krw_per_night: int
    reason: str


class StaySegment(BaseModel):
    check_in: date
    check_out: date
    recommended_region: str
    candidates: list[StayCandidate]


class StayOut(BaseModel):
    segments: list[StaySegment]


class ActivityItem(BaseModel):
    name: str
    region: str
    duration_min: int
    cost_krw: int
    indoor: bool
    recommended_time: str


class ActivitiesOut(BaseModel):
    activities: list[ActivityItem]


class FoodItem(BaseModel):
    name: str
    region: str
    meal_type: str
    cost_krw: int
    note: str = ""


class FoodOut(BaseModel):
    food: list[FoodItem]


class TransportLeg(BaseModel):
    description: str
    method: str
    cost_krw: int


class TransportOut(BaseModel):
    airport_to_stay: TransportLeg
    stay_to_airport: TransportLeg
    in_city: TransportLeg


class PrepOut(BaseModel):
    checklist: list[str]
    weather_note: str


class ItineraryItem(BaseModel):
    start: time
    end: time
    title: str
    kind: str
    place: str
    cost_krw: int


class ItineraryDay(BaseModel):
    date: date
    items: list[ItineraryItem]


class ItineraryOut(BaseModel):
    days: list[ItineraryDay]
    rain_alternatives: list[str]
    budget_total_krw: int


def _load_config() -> dict:
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.json")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


CONFIG = _load_config()
CLAUDE_MODEL = CONFIG.get("model")  # 비우면 claude CLI 기본 모델 사용
OLLAMA_CONFIG = CONFIG.get("ollama", {})
NODE_PROVIDERS = CONFIG.get("nodes", {})  # 노드명 -> "claude" | "ollama". 없으면 claude
PROVIDERS = ("claude", "ollama")


def _provider(node: str) -> str:
    provider = NODE_PROVIDERS.get(node, "claude")
    if provider not in PROVIDERS:
        raise ValueError(f"config.json nodes.{node}: '{provider}' 은 {PROVIDERS} 중 하나여야 함")
    return provider


def _llm_label(node: str) -> str:
    """캐시 키용. provider/모델이 바뀌면 캐시 미스 나게 함."""
    if _provider(node) == "ollama":
        return f"ollama:{OLLAMA_CONFIG.get('model', 'qwen3')}"
    return f"claude:{CLAUDE_MODEL or 'default'}"


def call_claude(prompt: str, allowed_tools: Optional[list[str]] = None) -> str:
    """claude CLI 비대화 모드 호출. API 키 아닌 Claude Code 구독으로 돈다."""
    if shutil.which("claude") is None:
        print("claude CLI 없음: https://claude.com/claude-code 로 설치 필요", file=sys.stderr)
        sys.exit(1)
    cmd = ["claude", "-p", prompt]
    if CLAUDE_MODEL:
        cmd += ["--model", CLAUDE_MODEL]
    if allowed_tools:
        # 비대화 모드는 기본적으로 WebSearch 등 도구 권한을 거부함 — 명시적으로 허용해야 함
        cmd += ["--allowedTools", *allowed_tools]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    if result.returncode != 0:
        raise RuntimeError(f"claude CLI 실패: {result.stderr.strip()}")
    return result.stdout.strip()


def call_ollama(prompt: str, json_mode: bool = False) -> str:
    """langchain ChatOllama 호출. 로컬 ollama 서버 필요 (기본 http://localhost:11434)."""
    llm = ChatOllama(
        model=OLLAMA_CONFIG.get("model", "qwen3"),
        base_url=OLLAMA_CONFIG.get("base_url", "http://localhost:11434"),
        format="json" if json_mode else None,
    )
    return llm.invoke(prompt).content.strip()


def call_llm(node: str, prompt: str, allowed_tools: Optional[list[str]] = None, json_mode: bool = False) -> str:
    """노드 설정(config.json nodes)에 따라 claude CLI 또는 ollama로 라우팅."""
    if _provider(node) == "ollama":
        if allowed_tools:
            # ollama 쪽엔 WebSearch 없음 → 검색 없이 모델 지식만으로 진행
            print(f"[{node}] ollama 사용 중: WebSearch 생략", file=sys.stderr)
        return call_ollama(prompt, json_mode=json_mode)
    return call_claude(prompt, allowed_tools)


def _extract_json(text: str) -> str:
    m = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    return m.group(1).strip() if m else text.strip()


T = TypeVar("T", bound=BaseModel)


def call_llm_structured(node: str, prompt: str, schema: type[T]) -> T:
    full_prompt = (
        f"{prompt}\n\n"
        "반드시 아래 JSON 스키마에 맞는 JSON 객체만 출력해. 설명 문장이나 마크다운 펜스 없이 순수 JSON만.\n"
        f"스키마: {json.dumps(schema.model_json_schema(), ensure_ascii=False)}"
    )
    text = call_llm(node, full_prompt, json_mode=True)
    return schema.model_validate_json(_extract_json(text))


ARTIFACTS_DIR = os.path.join("private", "artifacts")
CACHE_DIR = os.path.join(ARTIFACTS_DIR, "cache")


def _save_artifact(name: str, data) -> None:
    """노드별 중간산출물을 artifacts/<name>.json으로 남김 (디버깅·추적용)."""
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    path = os.path.join(ARTIFACTS_DIR, f"{name}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)


def _input_hash(payload: dict) -> str:
    canon = json.dumps(payload, sort_keys=True, ensure_ascii=False, default=str)
    return hashlib.sha256(canon.encode()).hexdigest()


def _cache_path(name: str) -> str:
    return os.path.join(CACHE_DIR, f"{name}.json")


def _run_cached(name: str, node: str, inputs: dict, compute) -> dict:
    """inputs 해시를 키로 한 캐시(artifacts/cache/<name>.json, {hash: output})에서 같은 입력이면
    compute() 생략. 입력 해시 여러 개 보관 — planner 재시도처럼 같은 노드가 입력을 바꿔 여러 번
    돌아도 각각 저장돼서, 다음 실행의 첫 호출이 마지막 재시도 결과에 덮이지 않음.
    node의 LLM 설정(provider/모델)도 해시에 포함 — 모델 바꾸면 캐시 무효화."""
    inputs = {**inputs, "llm": _llm_label(node)}
    h = _input_hash(inputs)
    path = _cache_path(name)
    store = {}
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            store = json.load(f)
    if h in store:
        result = store[h]
        _save_artifact(name, {**result, "_cache": "hit"})
        return result
    result = compute()
    store[h] = result
    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2, default=str)
    _save_artifact(name, {**result, "_cache": "miss"})
    return result


def _read_requirements_section(heading: str) -> str:
    """docs/client-requirements.md에서 '## <heading>' 섹션 본문만 읽음. 노드별로 진짜 관련있는
    제약사항만 입력에 넣기 위함 — 섹션을 안 섞어야 캐시 스킵이 제대로 동작함."""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "docs", "client-requirements.md")
    if not os.path.exists(path):
        return ""
    with open(path, encoding="utf-8") as f:
        text = f.read()
    parts = re.split(r"^## (.+)$", text, flags=re.MULTILINE)
    for i in range(1, len(parts), 2):
        if parts[i].strip() == heading:
            return parts[i + 1].strip()
    return ""


def _windows_text(windows: list[dict]) -> str:
    lines = []
    for w in windows:
        if w["start"] is None:
            lines.append(f"- {w['date']}: 가용 시간 없음 ({w['note']})")
        else:
            lines.append(f"- {w['date']}: {w['start']}~{w['end']}")
    return "\n".join(lines)


def node_timeline(state: TripState) -> dict:
    windows, warnings = timeline(state["trip"])
    result = {"windows": windows, "warnings": warnings}
    _save_artifact("01_timeline", result)
    return result


def route_after_timeline(state: TripState) -> list[str] | str:
    if not state["trip"].get("stays"):
        return "stay_agent"
    return ["activity_agent", "food_agent", "transport_agent", "prep_agent"]


def node_stay_agent(state: TripState) -> dict:
    trip = state["trip"]
    requirements = _read_requirements_section("숙소 전략")
    inputs = {
        "destination": trip["destination"],
        "start": trip["start"],
        "end": trip["end"],
        "request": trip["request"],
        "windows": state.get("windows", []),
        "requirements": requirements,
    }

    def compute() -> dict:
        req_line = f"제약사항: {requirements}\n" if requirements else ""
        prompt = (
            f"여행지: {trip['destination']}\n"
            f"기간: {trip['start']} ~ {trip['end']}\n"
            f"가용 시간:\n{_windows_text(state.get('windows', []))}\n"
            f"요청사항: {trip['request']}\n"
            f"{req_line}\n"
            "이 여행 기간을 숙소 구간(segment)으로 나누고, 구간마다 check_in/check_out 날짜, "
            "추천 지역, 후보 2~3곳(1박 기준 KRW)을 제시해줘. 숙소를 하루 단위로 바꿔야 할 "
            "이유(가격·위치·조식 등)가 있으면 구간을 나눠도 좋아. 제약사항이 있으면 반드시 지켜줘."
        )
        out = call_llm_structured("stay_agent", prompt, StayOut)
        return {"stay": [s.model_dump() for s in out.segments]}

    return _run_cached("02_stay_agent", "stay_agent", inputs, compute)


def node_activity_agent(state: TripState) -> dict:
    trip = state["trip"]
    requirements = _read_requirements_section("활동 제약")
    inputs = {
        "destination": trip["destination"],
        "request": trip["request"],
        "windows": state.get("windows", []),
        "stay": state.get("stay"),
        "requirements": requirements,
    }

    def compute() -> dict:
        research = call_llm(
            "activity_agent",
            f"{trip['destination']}의 관광·액티비티를 최신 정보(영업 여부, 가격)로 찾아줘. "
            f"요청사항: {trip['request']}",
            allowed_tools=["WebSearch"],
        )
        req_line = f"제약사항: {requirements}\n" if requirements else ""
        prompt = (
            f"여행지: {trip['destination']}\n"
            f"가용 시간:\n{_windows_text(state.get('windows', []))}\n"
            f"숙소: {state.get('stay')}\n"
            f"요청사항: {trip['request']}\n"
            f"{req_line}\n"
            f"검색 결과:\n{research}\n\n"
            "위 검색 결과를 바탕으로 관광·액티비티 후보 목록을 구조화해줘. "
            "우천 시 대안이 될 실내(indoor) 항목도 섞어줘. 제약사항이 있으면 반드시 지켜줘."
        )
        out = call_llm_structured("activity_agent", prompt, ActivitiesOut)
        return {"activities": [a.model_dump() for a in out.activities]}

    return _run_cached("03_activity_agent", "activity_agent", inputs, compute)


def node_food_agent(state: TripState) -> dict:
    trip = state["trip"]
    inputs = {
        "destination": trip["destination"],
        "request": trip["request"],
        "stay": state.get("stay"),
    }

    def compute() -> dict:
        research = call_llm(
            "food_agent",
            f"{trip['destination']}의 식당을 최신 정보(폐업 여부, 가격)로 찾아줘. "
            f"요청사항: {trip['request']}",
            allowed_tools=["WebSearch"],
        )
        prompt = (
            f"여행지: {trip['destination']}\n"
            f"숙소: {state.get('stay')}\n"
            f"요청사항: {trip['request']}\n\n"
            f"검색 결과:\n{research}\n\n"
            "위 검색 결과를 바탕으로 식당 후보 목록을 구조화해줘."
        )
        out = call_llm_structured("food_agent", prompt, FoodOut)
        return {"food": [f.model_dump() for f in out.food]}

    return _run_cached("03_food_agent", "food_agent", inputs, compute)


def node_transport_agent(state: TripState) -> dict:
    trip = state["trip"]
    inputs = {
        "destination": trip["destination"],
        "windows": state.get("windows", []),
        "stay": state.get("stay"),
        "flights": trip["flights"],
    }

    def compute() -> dict:
        prompt = (
            f"여행지: {trip['destination']}\n"
            f"가용 시간:\n{_windows_text(state.get('windows', []))}\n"
            f"숙소: {state.get('stay')}\n"
            f"항공편: {trip['flights']}\n\n"
            "공항→숙소(새벽 도착 포함), 숙소→공항, 시내 이동 수단과 비용(KRW)을 제시해줘."
        )
        out = call_llm_structured("transport_agent", prompt, TransportOut)
        return {"transport": out.model_dump()}

    return _run_cached("03_transport_agent", "transport_agent", inputs, compute)


def node_prep_agent(state: TripState) -> dict:
    trip = state["trip"]
    inputs = {"destination": trip["destination"], "start": trip["start"], "end": trip["end"]}

    def compute() -> dict:
        prompt = (
            f"여행지: {trip['destination']}\n"
            f"기간: {trip['start']} ~ {trip['end']}\n\n"
            "비자·환전·eSIM·입국 서류 체크리스트와 날씨 메모를 만들어줘."
        )
        out = call_llm_structured("prep_agent", prompt, PrepOut)
        return {"prep": out.model_dump()}

    return _run_cached("03_prep_agent", "prep_agent", inputs, compute)


def node_planner(state: TripState) -> dict:
    trip = state["trip"]
    errors = state.get("errors", [])
    inputs = {
        "destination": trip["destination"],
        "request": trip["request"],
        "windows": state.get("windows", []),
        "stay": state.get("stay"),
        "activities": state.get("activities"),
        "food": state.get("food"),
        "transport": state.get("transport"),
        "prep": state.get("prep"),
        "retries": state.get("retries", 0),  # errors 문구는 LLM 출력에 따라 실행마다 달라져 키로 부적합. 재시도 횟수로 대체
    }

    def compute() -> dict:
        retry_note = ""
        if errors:
            retry_note = (
                "\n이전 시도의 규칙 위반 (수정 필요):\n"
                + "\n".join(f"- {e}" for e in errors)
            )
        prompt = (
            f"여행지: {trip['destination']}\n"
            f"가용 시간:\n{_windows_text(state.get('windows', []))}\n"
            f"숙소: {state.get('stay')}\n"
            f"액티비티: {state.get('activities')}\n"
            f"식당: {state.get('food')}\n"
            f"이동: {state.get('transport')}\n"
            f"준비물: {state.get('prep')}\n"
            f"요청사항: {trip['request']}\n"
            f"비행·숙박 제약(반드시 지킬 것): {_read_requirements_section('비행 일정')}\n"
            f"{retry_note}\n\n"
            "일자별 일정표를 만들어줘. 각 항목 시각은 현지시각(HH:MM), 가용 시간 안에서 "
            "서로 겹치지 않게 배치하고, 우천 대안과 예산 합계(인원 기준 KRW)도 포함해줘."
        )
        out = call_llm_structured("planner", prompt, ItineraryOut)
        return {"itinerary": out.model_dump()}

    cached = _run_cached("04_planner", "planner", inputs, compute)
    itinerary = ItineraryOut.model_validate(cached["itinerary"]).model_dump()
    return {"itinerary": itinerary, "errors": []}


def node_validate(state: TripState) -> dict:
    errors = validate(state.get("itinerary", {}), state.get("windows", []))
    retries = state.get("retries", 0)
    if errors:
        retries += 1
    result = {"errors": errors, "retries": retries}
    _save_artifact(f"05_validate_{retries}", result)
    return result


def route_after_validate(state: TripState) -> str:
    if state.get("errors") and state.get("retries", 0) <= 2:
        return "planner"
    return "render"


WEB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")
WEB_DATA_PATH = os.path.join(WEB_DIR, "src", "data", "itinerary.json")


def node_render(state: TripState) -> dict:
    trip = state["trip"]
    payload = {
        "trip": {
            "destination": trip["destination"],
            "start": trip["start"],
            "end": trip["end"],
            "tz": trip["tz"],
            "travelers": trip["travelers"],
            "request": trip["request"],
            "flights": trip["flights"],
        },
        "warnings": state.get("warnings", []),
        "errors": state.get("errors", []),
        "itinerary": state.get("itinerary"),
        "stay": state.get("stay"),
        "activities": state.get("activities"),
        "food": state.get("food"),
        "transport": state.get("transport"),
        "prep": state.get("prep"),
    }
    os.makedirs(os.path.dirname(WEB_DATA_PATH), exist_ok=True)
    with open(WEB_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2, default=str)
    if shutil.which("npm"):
        subprocess.run(["npm", "run", "build"], cwd=WEB_DIR, check=True)
    else:
        print("npm 없음: web/에서 `npm run build` 실행해야 web/dist 생성됨", file=sys.stderr)
    return {}


def build_graph():
    g = StateGraph(TripState)
    g.add_node("timeline", node_timeline)
    g.add_node("stay_agent", node_stay_agent)
    g.add_node("activity_agent", node_activity_agent)
    g.add_node("food_agent", node_food_agent)
    g.add_node("transport_agent", node_transport_agent)
    g.add_node("prep_agent", node_prep_agent)
    g.add_node("planner", node_planner)
    g.add_node("validate", node_validate)
    g.add_node("render", node_render)

    g.set_entry_point("timeline")
    g.add_conditional_edges(
        "timeline",
        route_after_timeline,
        ["stay_agent", "activity_agent", "food_agent", "transport_agent", "prep_agent"],
    )
    for node in ["activity_agent", "food_agent", "transport_agent", "prep_agent"]:
        g.add_edge("stay_agent", node)
        g.add_edge(node, "planner")
    g.add_edge("planner", "validate")
    g.add_conditional_edges("validate", route_after_validate, ["planner", "render"])
    g.add_edge("render", END)

    return g.compile()


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else os.path.join("private", "trip.toml")
    trip = load_input(path)

    graph = build_graph()
    graph.invoke({"trip": trip, "retries": 0, "stay": trip.get("stays") or []})
    print("web/ 데이터 및 빌드 완료 (보기: cd web && npm run dev)")


if __name__ == "__main__":
    main()
