import { useState } from "react";
import { Badge, Callout, Text } from "@seed-design/react";
import { STAY_MOVES } from "./data/stayMoves";
import { BUDGET, VND_PER_KRW, cashToWithdraw, walletToCharge, type BudgetLine } from "./data/budget";
import { WESTIN_EAT, WESTIN_PLAY, WESTIN_TAX_NOTE, type Facility } from "./data/westin";
import { JJONG, JJONG_CATS, JJONG_SOURCE, type JjongPlace } from "./data/jjongsong";
import { RouteGraph } from "./RouteGraph";
import type { Activity, Day, Food, Item, TripData, WeatherDay } from "./types";
import itinerary from "./data/itinerary.json";
import "./App.css";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
// 자정 넘긴 항목은 24:xx로 저장(정렬용) → "00:xx+1"로 표시
const hhmm = (t: string) => {
  const h = parseInt(t, 10);
  return h >= 24 ? `${String(h - 24).padStart(2, "0")}${t.slice(2, 5)}+1` : t.slice(0, 5);
};

// WMO weather code → 아이콘·라벨 (Open-Meteo)
function wx(code: number): string {
  if (code === 0) return "☀️ 맑음";
  if (code <= 2) return "🌤 구름 조금";
  if (code === 3) return "☁️ 흐림";
  if (code <= 48) return "🌫 안개";
  if (code <= 57) return "🌦 이슬비";
  if (code <= 67) return "🌧 비";
  if (code <= 77) return "🌨 눈";
  if (code <= 82) return "🌦 소나기";
  return "⛈ 뇌우";
}

function WeatherCard({ w, fetchedAt, place }: { w: WeatherDay; fetchedAt: string; place: string }) {
  return (
    <div className="weather">
      <Text textStyle="t5Bold" color="fg.neutral">
        {wx(w.code)} · {Math.round(w.t_min)}~{Math.round(w.t_max)}°C
      </Text>
      <Text textStyle="t4Regular" color={w.rain_prob >= 60 ? "fg.critical" : "fg.neutral-subtle"}>
        강수 {w.rain_prob}% · {w.rain_mm}mm · 바람 {Math.round(w.wind_kmh)}km/h · UV {w.uv}
      </Text>
      <Text textStyle="t3Regular" color="fg.neutral-muted">
        {place} 예보 · Open-Meteo · {fetchedAt} 기준
      </Text>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <Text as="h2" textStyle="t6Bold" color="fg.neutral">
        {title}
      </Text>
      <div className="section-body">{children}</div>
    </section>
  );
}

function FlightCards({ data }: { data: TripData }) {
  return (
    <div className="flights">
      {data.trip.flights.map((f) => (
        <div className="flight-card" key={`${f.airline}-${f.depart}`}>
          <Text textStyle="t5Bold" color="fg.neutral">
            {f.airline} {f.no}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            {f.from} → {f.to}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            KST {f.depart.replace("T", " ").slice(0, 16)} → {f.arrive.replace("T", " ").slice(0, 16)}
          </Text>
        </div>
      ))}
    </div>
  );
}

function Notices({ data }: { data: TripData }) {
  const messages = [...data.warnings, ...data.errors.map((e) => `(미해결) ${e}`)];
  if (messages.length === 0) return null;
  return (
    <Callout.Root tone="warning">
      <Callout.Content>
        <Callout.Title>확인이 필요해요</Callout.Title>
        {messages.map((m) => (
          <Callout.Description key={m}>{m}</Callout.Description>
        ))}
      </Callout.Content>
    </Callout.Root>
  );
}

function DayTabs({ days, value, onChange }: { days: { date: string }[]; value: number; onChange: (i: number) => void }) {
  return (
    <div className="day-tabs" role="tablist">
      {days.map((d, i) => (
        <button
          key={d.date}
          role="tab"
          aria-selected={i === value}
          className={i === value ? "chip active" : "chip"}
          onClick={() => onChange(i)}
        >
          {d.date.startsWith("Day") ? `Day ${i + 1}` : `Day ${i + 1} · ${d.date.slice(5)}`}
        </button>
      ))}
    </div>
  );
}

// 여행 전체 날짜(start~end). 플래너는 가용 시간 있는 날만 내보내므로 빈 날은 items: [] 로 채움.
function allDays(data: TripData): Day[] {
  const byDate = new Map((data.itinerary?.days ?? []).map((d) => [d.date, d]));
  const { start, end } = data.trip;
  const dates: string[] = [];
  const ms = start.match(/^Day(\d+)$/), me = end.match(/^Day(\d+)$/); // deploy.sh 마스킹: 날짜 → DayN
  if (ms && me) for (let n = +ms[1]; n <= +me[1]; n++) dates.push(`Day${n}`);
  else for (let t = Date.parse(start); t <= Date.parse(end); t += 86_400_000) dates.push(new Date(t).toISOString().slice(0, 10));
  return dates.map((date) => byDate.get(date) ?? { date, items: [] });
}

const dt = (s: string) => s.replace("T", " ").replace(/:\d\d$/, "");

// 일출·일몰 (Westin 좌표, Open-Meteo 예보 + 천문식 교차 확인) — Day N 기준
const SUN: Record<number, { rise: string; set: string }> = { 2: { rise: "05:43", set: "17:15" }, 3: { rise: "05:44", set: "17:15" } };

function TimelineItem({ item, w }: { item: Item; w: WeatherDay | undefined }) {
  const h = item.title.startsWith("[KST]") ? undefined : w?.hourly[parseInt(item.start, 10)]; // 예보는 깜라인 현지 시각 기준 — 인천(KST) 항목엔 안 붙임
  return (
    <li>
            <div className="time">
              {hhmm(item.start)}
              <br />
              {hhmm(item.end)}
            </div>
            <div className="item-body">
              <Text textStyle="t5Bold" color="fg.neutral">
                {item.title}
              </Text>
              <div className="meta">
                <Badge.Root size="medium" variant="weak" tone="neutral">
                  <Badge.Label>{item.kind}</Badge.Label>
                </Badge.Root>
                {h && (
                  <Badge.Root size="medium" variant="weak" tone={h.rain_prob >= 60 ? "warning" : "neutral"}>
                    <Badge.Label>
                      {wx(h.code).split(" ")[0]} {Math.round(h.temp)}° · 비 {h.rain_prob}%
                    </Badge.Label>
                  </Badge.Root>
                )}
                <Text textStyle="t4Regular" color="fg.neutral-subtle">
                  {item.place} · {won(item.cost_krw)}
                </Text>
              </div>
            </div>
    </li>
  );
}

// 연속된 who 항목(M·W 병렬)은 한 덩어리로 묶어 2열로 그림
type Group = { item: Item } | { M: Item[]; W: Item[] };
function groupByWho(items: Item[]): Group[] {
  const out: Group[] = [];
  for (const item of items) {
    if (!item.who) {
      out.push({ item });
      continue;
    }
    let last = out[out.length - 1];
    if (!last || "item" in last) out.push((last = { M: [], W: [] }));
    last[item.who].push(item);
  }
  return out;
}

function Timeline({ data, day, dayNo }: { data: TripData; day: Day | undefined; dayNo: number }) {
  if (!day) return null;
  const items = [...day.items, ...STAY_MOVES.filter((m) => m.day === dayNo)].sort((a, b) => a.start.localeCompare(b.start));
  const total = items.reduce((sum, i) => sum + i.cost_krw, 0);
  // ponytail: 항공 시각은 KST 기준 날짜로 매칭
  const flights = data.trip.flights.filter((f) => f.depart.startsWith(day.date) || f.arrive.startsWith(day.date));
  const w = data.weather?.days.find((d) => d.date === day.date);
  return (
    <div className="day">
      {w && data.weather && <WeatherCard w={w} fetchedAt={data.weather.fetched_at} place={data.weather.place} />}
      {SUN[dayNo] && (
        <Text textStyle="t4Regular" color="fg.neutral-subtle">
          🌅 일출 {SUN[dayNo].rise} · 🌇 일몰 {SUN[dayNo].set} (현지 시각)
        </Text>
      )}
      {flights.map((f) => (
        <Text key={f.depart} textStyle="t5Regular" color="fg.neutral">
          ✈️ {f.airline} {f.no} {f.from} → {f.to} · KST {dt(f.depart)} 출발 → {dt(f.arrive)} 도착
        </Text>
      ))}
      <Text textStyle="t4Regular" color="fg.neutral-subtle">
        일정 {items.length}개 · 예상 {won(total)}
      </Text>
      {items.length === 0 && (
        <Text textStyle="t5Regular" color="fg.neutral-subtle">
          이날은 잡힌 일정이 없어요 (이동·휴식)
        </Text>
      )}
      <ol className="timeline">
        {groupByWho(items).map((g, i) =>
          "item" in g ? (
            <TimelineItem key={`${g.item.start}-${g.item.title}`} item={g.item} w={w} />
          ) : (
            <li key={`split-${i}`} className="split">
              {(["M", "W"] as const).map((who) => (
                <div key={who} className="split-col">
                  <span className="split-who">{who}</span>
                  {g[who].length === 0 && <span className="split-empty">—</span>}
                  <ol className="timeline">
                    {g[who].map((item) => (
                      <TimelineItem key={`${item.start}-${item.title}`} item={item} w={w} />
                    ))}
                  </ol>
                </div>
              ))}
            </li>
          ),
        )}
      </ol>
    </div>
  );
}

// 확정 숙소 공식 페이지 (Navy는 공식 사이트 없음)
const STAY_LINKS: Record<string, string> = {
  "The Westin Resort & Spa Cam Ranh": "https://www.marriott.com/en-us/hotels/cxrwi-the-westin-resort-and-spa-cam-ranh/overview/",
};

function StayRecommendations({ data }: { data: TripData }) {
  return (
    <div className="stay-segments">
      {(data.stay ?? []).map((seg) => (
        <div className="segment" key={`${seg.check_in}-${seg.check_out}`}>
          <Text as="h3" textStyle="t5Bold" color="fg.neutral">
            {seg.check_in} ~ {seg.check_out}
          </Text>
          {seg.name && (
            <Text textStyle="t5Bold" color="fg.neutral">
              확정: {seg.name}
            </Text>
          )}
          {seg.name && STAY_LINKS[seg.name] && (
            <div className="links">
              <a href={STAY_LINKS[seg.name]} target="_blank" rel="noreferrer">
                공식 페이지
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 일정표에 잡힌 항목 중 kind가 맞는 것만 Day별로 (먹기·놀기 탭)
function Scheduled({ days, kinds }: { days: Day[]; kinds: string[] }) {
  const rows = days.flatMap((d, i) => d.items.filter((it) => kinds.includes(it.kind)).map((it) => ({ dayNo: i + 1, it })));
  if (rows.length === 0) return <Text textStyle="t4Regular" color="fg.neutral-subtle">일정에 잡힌 항목 없음</Text>;
  return (
    <ul className="card-list">
      {rows.map(({ dayNo, it }: { dayNo: number; it: Item }) => (
        <li className="card" key={`${dayNo}-${it.start}-${it.title}`}>
          <Text textStyle="t5Bold" color="fg.neutral">
            Day {dayNo} {hhmm(it.start)} · {it.title}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            {it.place}
            {it.cost_krw > 0 && ` · ${won(it.cost_krw)}`}
          </Text>
        </li>
      ))}
    </ul>
  );
}

const vnd = (n: number) => `${(n / 10000).toLocaleString("ko-KR")}만동`;
const krw = (n: number) => won(Math.round(n / VND_PER_KRW / 1000) * 1000);
const sum = (ls: BudgetLine[], pay?: BudgetLine["pay"]) => ls.filter((l) => !pay || l.pay === pay).reduce((a, l) => a + l.vnd, 0);

function BudgetTab({ days, travelers }: { days: Day[]; travelers: number }) {
  const cash = sum(BUDGET, "현금"), wallet = sum(BUDGET, "트래블월렛"), total = sum(BUDGET);
  const withdraw = cashToWithdraw(cash), charge = walletToCharge(wallet);
  return (
    <>
      <Section title="환전·ATM">
        <Text textStyle="t6Bold" color="fg.neutral">
          💵 현금 {vnd(withdraw)} 출금 (≈{krw(withdraw)}) + 👛 트래블월렛 {vnd(charge)} 충전 (≈{krw(charge)}) = 환전 {vnd(withdraw + charge)} (≈{krw(withdraw + charge)})
        </Text>
        <Text textStyle="t4Regular" color="fg.neutral-subtle">
          💵 현금성 {vnd(cash)} + 여유 20% · 👛 트래블월렛(Grab) {vnd(wallet)} + 여유 20% · 💳 카드 {vnd(total - cash - wallet)} → 환전 불필요 (Westin 룸차지. 숙박·항공도 카드, 이 예산엔 미포함) · VPBank ATM 외국 카드 수수료 없음, 1회 한도 500만~1,000만동 (2026 블로그 기준) — Westin 근처는 모벤픽 리조트 안
        </Text>
        <Text textStyle="t4Regular" color="fg.neutral-subtle">
          {travelers}명 합계 {vnd(total)} ≈ {krw(total)} · 1인 ≈ {krw(total / travelers)} (숙박·항공 제외) · 1만동 ≈ 550원
        </Text>
      </Section>
      {days.map((d, i) => {
        const ls = BUDGET.filter((l) => l.day === i + 1);
        if (ls.length === 0) return null;
        return (
          <Section key={d.date} title={`Day ${i + 1} · ${vnd(sum(ls))} (💵 ${vnd(sum(ls, "현금"))} · 👛 ${vnd(sum(ls, "트래블월렛"))} · 💳 ${vnd(sum(ls, "카드"))})`}>
            <div className="sheet-wrap">
              <table className="sheet budget">
                <thead>
                  <tr>
                    <th>항목</th>
                    <th>금액</th>
                    <th>결제</th>
                  </tr>
                </thead>
                <tbody>
                  {(["현금", "트래블월렛", "카드"] as const).flatMap((pay) => {
                    const g = ls.filter((l) => l.pay === pay);
                    if (g.length === 0) return [];
                    return [
                      <tr key={`h-${pay}`}>
                        <th colSpan={3}>
                          {pay === "현금" ? "💵 현금 · 출금 필요" : pay === "트래블월렛" ? "👛 트래블월렛 · 충전(환전) 필요" : "💳 카드 · 환전 불필요"} · {vnd(sum(g))}
                        </th>
                      </tr>,
                      ...g.map((l) => (
                        <tr key={l.title}>
                          <td>
                            {l.title}
                            {l.note && <div className="src">{l.note}</div>}
                          </td>
                          <td className="num">
                            {vnd(l.vnd)}
                            <div className="src">≈{krw(l.vnd)}</div>
                          </td>
                          <td>{l.pay}</td>
                        </tr>
                      )),
                    ];
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        );
      })}
    </>
  );
}

function FacilityList({ items }: { items: Facility[] }) {
  return (
    <>
      <Text textStyle="t4Regular" color="fg.neutral-subtle">
        {WESTIN_TAX_NOTE}
      </Text>
      <ul className="card-list">
        {items.map((f) => (
          <li className="card" key={f.name}>
            <Text textStyle="t5Bold" color="fg.neutral">
              {f.name}
            </Text>
            {f.price && (
              <Text textStyle="t4Regular" color="fg.neutral">
                {f.price}
              </Text>
            )}
            <Text textStyle="t4Regular" color="fg.neutral-subtle">
              {f.detail}
              {f.src && (
                <>
                  {" · "}
                  <a href={f.src} target="_blank" rel="noreferrer">
                    출처
                  </a>
                </>
              )}
            </Text>
          </li>
        ))}
      </ul>
    </>
  );
}

function ActivityList({ items }: { items: Activity[] }) {
  return (
    <ul className="card-list">
      {items.map((a) => (
        <li className="card" key={a.name}>
          <Text textStyle="t5Bold" color="fg.neutral">
            {a.name}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            {a.region} · {a.duration_min}분 · {won(a.cost_krw)} · {a.indoor ? "실내" : "야외"} · {a.recommended_time}
          </Text>
          {a.note && (
            <Text textStyle="t4Regular" color="fg.neutral" style={{ whiteSpace: "pre-line" }}>
              {a.note}
            </Text>
          )}
        </li>
      ))}
    </ul>
  );
}

function FoodList({ items }: { items: Food[] }) {
  return (
    <ul className="card-list">
      {items.map((f) => (
        <li className="card" key={f.name}>
          <Text textStyle="t5Bold" color="fg.neutral">
            {f.name}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            {f.region} · {f.meal_type}
          </Text>
          {!f.guide && (
            <dl className="facts">
              <Fact k="가격" v={f.price_text ?? (f.cost_krw > 0 ? `1인 ≈ ${won(f.cost_krw)}` : "미확인")} />
              <Fact k="평점" v={f.rating && `⭐ ${f.rating}${f.reviews ? ` (${f.reviews.toLocaleString("ko-KR")})` : ""}`} />
              <Fact k="영업" v={f.hours} />
              <Fact k="거리" v={f.dist ?? (f.dist_km && `Westin ${f.dist_km}km`)} />
              <Fact k="연락" v={f.kakao ? `카톡 ${f.kakao}` : f.phone} />
            </dl>
          )}
          {f.note && (
            <details className="food-note">
              <summary>{f.guide ? "안내" : "메모"}</summary>
              <Text textStyle="t4Regular" color="fg.neutral">
                {f.note}
              </Text>
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}

// 값 없으면 줄 자체를 안 그림
function Fact({ k, v }: { k: string; v?: string | number | false }) {
  if (!v) return null;
  return (
    <div>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function JjongTags({ tags }: { tags: string[] }) {
  return tags.length > 0 ? (
    <span className="tags">
      {tags.map((t) => (
        <Badge.Root key={t} size="medium" variant="weak" tone="neutral">
          <Badge.Label>{t}</Badge.Label>
        </Badge.Root>
      ))}
    </span>
  ) : null;
}

// 오픈카톡 맛집 리스트: 깜란(숙소 근처)은 카드, 나머지는 종류별 접힘 목록
function JjongSection() {
  const near = JJONG.filter((p) => p.area === "깜란");
  const rest = JJONG.filter((p) => p.area !== "깜란");
  const cats = JJONG_CATS.filter((c) => rest.some((p) => p.cat === c));
  const row = (p: JjongPlace) => (
    <li key={p.name} className="jj-row">
      <b>{p.name}</b>
      <JjongTags tags={p.tags} />
      {p.note && <span className="jj-note">{p.note}</span>}
    </li>
  );
  return (
    <Section title="🍄 죄송이 버섯 맛집 (오픈카톡)">
      <Text textStyle="t3Regular" color="fg.neutral-subtle">
        출처: {JJONG_SOURCE} 리스트 · 개인 취향, 가격·영업 미검증. 깜란 말고는 대부분 시내(차로 30분 넘게)
      </Text>
      <Text as="h3" textStyle="t5Bold" color="fg.neutral">
        깜란 (숙소 근처)
      </Text>
      <ul className="card-list">
        {near.map((p) => (
          <li className="card" key={p.name}>
            <Text textStyle="t5Bold" color="fg.neutral">
              {p.name}
            </Text>
            <JjongTags tags={p.tags} />
            {p.menu && (
              <dl className="facts">
                {p.menu.map((m) => (
                  <Fact key={m.name} k={m.name} v={m.price} />
                ))}
              </dl>
            )}
            {p.note && (
              <Text textStyle="t4Regular" color="fg.neutral">
                {p.note}
              </Text>
            )}
          </li>
        ))}
      </ul>
      {cats.map((c) => (
        <details className="fold jj-cat" key={c}>
          <summary>
            {c} ({rest.filter((p) => p.cat === c).length})
          </summary>
          <ul className="jj-list">{rest.filter((p) => p.cat === c).map(row)}</ul>
        </details>
      ))}
    </Section>
  );
}

const TABS = [
  { id: "plan", label: "일정", icon: "🗓" },
  { id: "eat", label: "먹기", icon: "🍤" },
  { id: "play", label: "놀기", icon: "💆" },
  { id: "move", label: "이동", icon: "🚕" },
  { id: "budget", label: "예산", icon: "💵" },
  { id: "prep", label: "준비", icon: "🎒" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function App() {
  const data = itinerary as TripData;
  const [tab, setTab] = useState<TabId>("plan");
  const [dayIndex, setDayIndex] = useState(0);
  const days = allDays(data);
  const rain = data.itinerary?.rain_alternatives ?? [];
  const transport = data.transport ? Object.values(data.transport) : [];
  const select = (id: TabId) => {
    setTab(id);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <header className="topbar">
        <Text as="h1" textStyle="t5Bold" color="fg.neutral">
          {data.trip.destination} 여행
        </Text>
        <Text textStyle="t4Regular" color="fg.neutral-subtle">
          {data.trip.start} ~ {data.trip.end} · {data.trip.travelers}명
        </Text>
      </header>

      <main className="page">
        {tab === "plan" && (
          <>
            <Notices data={data} />
            <DayTabs days={days} value={dayIndex} onChange={setDayIndex} />
            <section className="section">
              <Timeline data={data} day={days[dayIndex]} dayNo={dayIndex + 1} />
            </section>
            <details className="section fold" open>
              <summary>🗺 이동 그래프</summary>
              <RouteGraph dayNo={dayIndex + 1} />
            </details>
            {rain.length > 0 && (
              <details className="section fold">
                <summary>☔ 비 오면 이렇게</summary>
                <ul className="bullets">
                  {rain.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                {data.activities?.some((a) => a.name.includes("후보 - 시내")) && (
                  <ActivityList items={data.activities.filter((a) => a.name.includes("후보 - 시내"))} />
                )}
              </details>
            )}
            <details className="section fold">
              <summary>✈ 항공편</summary>
              <FlightCards data={data} />
            </details>
          </>
        )}

        {tab === "eat" && (
          <>
            {data.food?.some((f) => f.delivery) && (
              <Section title="🛵 배달·주문 안내 (Westin 숙박 중 · Day2~3)">
                <Text textStyle="t4Regular" color="fg.neutral">
                  ① 배달은 배달K 앱 — 현금·동 계좌이체만 되니(원화 불가) 현금 준비
                </Text>
                <Text textStyle="t4Regular" color="fg.neutral">
                  ② 객실까지 배달 안 됨 — 정문까지 직접 나가서 받아야 함(Westin 확인). 정문까지 버기가 되는지는 프런트에 확인
                </Text>
                <Text textStyle="t4Regular" color="fg.neutral">
                  ③ 안 되면 Westin 인룸다이닝 (룸서비스 24/7 여부는 Marriott 페이지에 상충, 확인 필요)
                </Text>
                <Text textStyle="t3Regular" color="fg.neutral-subtle">
                  평점·리뷰 수는 못 찾음.
                </Text>
                <FoodList items={data.food.filter((f) => f.guide)} />
                {data.food.some((f) => f.delivery_mention) && (
                  <>
                    <Text as="h3" textStyle="t5Bold" color="fg.neutral">
                      배달 언급 있음 (블로그·공지 기준, 확인 필요)
                    </Text>
                    <FoodList items={data.food.filter((f) => f.delivery_mention)} />
                  </>
                )}
                {data.food.some((f) => f.delivery && !f.guide && !f.delivery_mention) && (
                  <>
                    <Text as="h3" textStyle="t5Bold" color="fg.neutral">
                      배달 여부 미확인 — 카톡·전화 주문·앱에서 직접 확인
                    </Text>
                    <Text textStyle="t3Regular" color="fg.neutral-subtle">
                      순서는 우선순위 아님.
                    </Text>
                    <FoodList items={data.food.filter((f) => f.delivery && !f.guide && !f.delivery_mention)} />
                  </>
                )}
              </Section>
            )}
            <Section title="일정에 잡힌 식사">
              <Scheduled days={days} kinds={["meal"]} />
            </Section>
            <Section title="Westin 식당·바">
              <FacilityList items={WESTIN_EAT} />
            </Section>
            {data.food && data.food.some((f) => !f.delivery) && (
              <Section title="식당 후보">
                <FoodList items={data.food.filter((f) => !f.delivery)} />
              </Section>
            )}
            <JjongSection />
          </>
        )}

        {tab === "play" && (
          <>
            <Section title="일정에 잡힌 것">
              <Scheduled days={days} kinds={["spa", "activity", "rest"]} />
            </Section>
            <Section title="Westin 부대시설">
              <FacilityList items={WESTIN_PLAY} />
            </Section>
            {data.activities && data.activities.some((a) => !a.name.includes("후보 - 시내")) && (
              <Section title="추천·대안">
                <ActivityList items={data.activities.filter((a) => !a.name.includes("후보 - 시내"))} />
              </Section>
            )}
          </>
        )}

        {tab === "move" && (
          <>
            <DayTabs days={days} value={dayIndex} onChange={setDayIndex} />
            <section className="section">
              <RouteGraph dayNo={dayIndex + 1} />
            </section>
            {transport.length > 0 && (
              <details className="section fold">
                <summary>🚕 이동 수단 메모</summary>
                <ul className="card-list">
                  {transport.map((leg) => (
                    <li className="card" key={leg.description}>
                      <Text textStyle="t5Bold" color="fg.neutral">
                        {leg.description}
                      </Text>
                      <Text textStyle="t4Regular" color="fg.neutral-subtle">
                        {leg.method} · {won(leg.cost_krw)}
                      </Text>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}

        {tab === "budget" && <BudgetTab days={days} travelers={data.trip.travelers} />}

        {tab === "prep" && data.prep && (
          <>
            {data.stay && data.stay.length > 0 && (
              <Section title="내 숙소">
                <StayRecommendations data={data} />
              </Section>
            )}
            <Section title="준비물">
              <ul className="checklist">
                {data.prep.checklist.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <Text textStyle="t4Regular" color="fg.neutral-subtle">
                날씨: {data.prep.weather_note}
              </Text>
            </Section>
          </>
        )}
      </main>

      <nav className="bottom-nav" aria-label="메뉴">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={t.id === tab ? "nav-item active" : "nav-item"}
            aria-current={t.id === tab ? "page" : undefined}
            onClick={() => select(t.id)}
          >
            <span aria-hidden>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

export { App };
