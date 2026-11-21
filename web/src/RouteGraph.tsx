import { Text } from "@seed-design/react";
import { NODES, type NodeKind } from "./data/routeNodes";

// 숙소·관광지·공항 = 노드, 이동 = 간선. 선택한 Day의 경로만 색칠.
// 하루 = 아침 기준: 자정~새벽 이동은 전날 Day에 "+1"로 붙임.
// 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리하므로 여기 날짜·편명 쓰면 안 됨.
// ponytail: 배치는 동서남북만 실제와 맞춘 개략도(routeNodes.ts), 거리는 stayMoves/itinerary 소요시간 기반 추정 — 실측 아님.

const ICON: Record<NodeKind, string> = { airport: "✈️", stay: "🏨", spot: "📍", atm: "🏧" };
type NodeId = keyof typeof NODES;

// 교통수단은 아이콘으로 — 라벨에 거리·시간까지 넣으면 길어서
const MODE_ICON = { Grab: "🚕", 셔틀: "🚐" } as const;
// cost = Grab 4인승 1대 요금(2인 합계), stayMoves·budget.ts와 같은 추정치. 셔틀은 Westin 무료(탑승 못 하면 Grab ≈15만동)
// navy↔westin·westin↔cxr 거리는 OSRM 도로 경로(OSM 좌표) 기준, westin↔cxr 시간은 OSRM 9분에 여유 둔 값
const EDGES: { a: NodeId; b: NodeId; km: string; min: string; cost: string; mode: keyof typeof MODE_ICON; t?: number }[] = [
  { a: "cxr", b: "navy", km: "4~5km", min: "10~15분", cost: "10~15만동", mode: "Grab", t: 0.6 },
  { a: "navy", b: "westin", km: "≈8.7km", min: "10~15분", cost: "10~20만동", mode: "Grab" },
  { a: "westin", b: "cxr", km: "≈7km", min: "15~30분", cost: "무료", mode: "셔틀", t: 0.6 },
  // ATM — VPBank는 외국 카드 출금 수수료 없음(2026 블로그 기준). 공항 T2 24시간 ATM은 은행 미확인이라 노드 없음
  { a: "westin", b: "atmMovenpick", km: "≈1.5km", min: "≈5분", cost: "≈5만동", mode: "Grab" },
];
const edgeKey = (a: string, b: string) => [a, b].sort().join("-");

type Step = { time: string; at: NodeId; to?: NodeId; text: string };
const ROUTES: Record<number, { color: string; note?: string; steps: Step[] }> = {
  1: {
    color: "#2f6fed",
    note: "인천 20:35(KST) 출발 → 현지 00:10(+1) 도착. 시각은 현지 기준",
    steps: [
      { time: "00:10+1", at: "cxr", text: "T2 도착 · 입국심사 30~60분 · 기내 휴대만 · T2 24시간 ATM 있음 (은행 미확인 — 수수료 비싸면 Day2 모벤픽 VPBank에서)" },
      { time: "01:00+1", at: "cxr", to: "navy", text: "Grab 예약 완료 (01:00 픽업) · 10~15분 · 10~15만동" },
      { time: "01:20+1", at: "navy", text: "체크인 · 취침" },
    ],
  },
  2: {
    color: "#2f6fed",
    steps: [
      { time: "11:00", at: "navy", to: "westin", text: "Grab · ≈8.7km · 10~15분 · 10~20만동" },
      { time: "11:30", at: "westin", text: "도착 · 짐 맡기고 얼리 체크인 요청 (안 돼도 체크인 전 수영장·Haven Lounge 이용 가능, Westin 확인) · 레이트 체크아웃 16:00 확인" },
      { time: "12:00", at: "westin", to: "atmMovenpick", text: "Grab ≈5분 · VPBank ATM 현금 출금 (예산 탭 추천액, 수수료 없음)" },
      { time: "12:20", at: "atmMovenpick", to: "westin", text: "Grab 복귀 → 점심 · 수영장 · 해변 입수(W는 직후 바로 씻기) · 16:10 W 가든 스파 120분 (Westin 200m 도보, 지도 노드 생략) · 그동안 M 해변 산책 → 18:10 마중 → Haven Lounge 해피아워(~20시) · 해산물 저녁 · M만 14:30 시내 셔틀 후보는 일정 탭 '비 오면' 의 'Day2 후보 - 시내'" },
    ],
  },
  3: {
    color: "#f26b1d",
    steps: [
      { time: "06:30", at: "westin", text: "M RunWESTIN 러닝 ~07:30 (신청함 · 비 오면 취소)" },
      { time: "08:00", at: "westin", text: "조식 · 서두르지 않음 · 프런트에 레이트 체크아웃 16:00 요청 (안 되면 빈 방 이동 요청 → 그래도 안 되면 0.5박 예약)" },
      { time: "09:30", at: "westin", text: "수영장 · 해변 입수(W는 직후 바로 씻기) · 비치발리볼·프리스비 (상시 무료)" },
      { time: "12:30", at: "westin", text: "해산물 점심 · 오후 휴식 · 해변 입수(W는 직후 바로 씻기) · 저녁 · 비 오면 Haven Lounge·스파 등 리조트 실내 · 11:30 무료 시내 셔틀 Gold Coast 몰 → 18:15 복귀는 일정 탭 '비 오면' 의 'Day3 후보 - 시내' (확인 필요)" },
      { time: "21:20", at: "westin", to: "cxr", text: "Westin 공항 셔틀 (예약 완료, 21:10 픽업 장소 대기) · 15~30분 · 21:50쯤 도착 — 놓치면 바로 Grab (≈15만동)" },
      { time: "00:30+1", at: "cxr", text: "출국 (현지 시각) — 새벽이라 이날 일정으로 표시" },
    ],
  },
  4: { color: "#8b5cf6", note: "귀국일 — 새벽 출국은 Day3에 표시, 인천 07:25(KST) 도착. 현지 이동 없음", steps: [] },
};

const GRAY = "#c9ced6";
const circled = (n: number) => String.fromCodePoint(0x2460 + n - 1);

export function RouteGraph({ dayNo }: { dayNo: number }) {
  const route = ROUTES[dayNo] ?? { color: GRAY, steps: [] };
  const visited = new Set<string>(route.steps.flatMap((s) => (s.to ? [s.at, s.to] : [s.at])));
  const stepNos = new Map<string, number[]>();
  const dirs = new Map<string, Set<"fwd" | "back">>(); // 간선 a→b 방향 = fwd
  route.steps.forEach((s, i) => {
    if (!s.to) return;
    const k = edgeKey(s.at, s.to);
    stepNos.set(k, [...(stepNos.get(k) ?? []), i + 1]);
    const e = EDGES.find((e) => edgeKey(e.a, e.b) === k);
    dirs.set(k, (dirs.get(k) ?? new Set()).add(e?.a === s.at ? "fwd" : "back"));
  });
  const arrow = `arrow-${dayNo}`;

  return (
    <div className="route-graph">
      <svg viewBox="0 0 400 270" role="img" aria-label={`Day ${dayNo} 이동 그래프`}>
        <defs>
          <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={route.color} />
          </marker>
        </defs>
        {EDGES.map((e) => {
          const A = NODES[e.a], B = NODES[e.b];
          const k = edgeKey(e.a, e.b);
          const nos = stepNos.get(k);
          const on = !!nos;
          const d = dirs.get(k);
          // 화살촉이 노드 원(r=17)에 가리지 않게 양끝을 20px 줄임
          const len = Math.hypot(B.x - A.x, B.y - A.y), ux = (B.x - A.x) / len, uy = (B.y - A.y) / len;
          const cut = on ? 20 : 0;
          const t = e.t ?? 0.5; // 라벨 위치(간선 위 비율) — 노드와 겹치면 조정
          const mx = A.x + (B.x - A.x) * t, my = A.y + (B.y - A.y) * t;
          return (
            <g key={k}>
              <line x1={A.x + ux * cut} y1={A.y + uy * cut} x2={B.x - ux * cut} y2={B.y - uy * cut}
                stroke={on ? route.color : GRAY} strokeWidth={on ? 4 : 2}
                strokeDasharray={on ? undefined : "5 4"} strokeLinecap="round"
                markerEnd={d?.has("fwd") ? `url(#${arrow})` : undefined}
                markerStart={d?.has("back") ? `url(#${arrow})` : undefined} />
              <text x={mx} y={my} className={on ? "edge-label on" : "edge-label"} fill={on ? route.color : "#8a919c"}>
                <tspan x={mx}>{nos && nos.map(circled).join("") + " "}{MODE_ICON[e.mode]} {e.min} · {e.cost}</tspan>
                <tspan x={mx} dy="1.2em">{e.km}</tspan>
              </text>
            </g>
          );
        })}
        {Object.entries(NODES).map(([id, n]) => {
          const on = visited.has(id);
          return (
            <g key={id}>
              <circle cx={n.x} cy={n.y} r={17} fill={on ? route.color : "#eef0f3"} stroke={on ? route.color : GRAY} strokeWidth={2} />
              <text x={n.x} y={n.y + 1} className="node-icon">{ICON[n.kind]}</text>
              <text x={n.x} y={n.labelUp ? n.y - 24 : n.y + 32} className={on ? "node-label on" : "node-label"}>{n.label}</text>
            </g>
          );
        })}
      </svg>
      {route.note && (
        <Text textStyle="t4Regular" color="fg.neutral-subtle">
          {route.note}
        </Text>
      )}
      {route.steps.length > 0 && (
        <ol className="route-steps">
          {route.steps.map((s, i) => (
            <li key={i}>
              <span className="step-no" style={{ background: route.color }}>{i + 1}</span>
              <span className="step-time">{s.time}</span>
              <span>
                <b>{NODES[s.at].label}{s.to && ` → ${NODES[s.to].label}`}</b> · {s.text}
              </span>
            </li>
          ))}
        </ol>
      )}
      <Text textStyle="t4Regular" color="fg.neutral-subtle">
        간선 = 순서 · 소요시간 · 요금(2인 1대) / 거리 · 화살표 = 이동 방향 (🚕 Grab 🚐 셔틀 · 🏧 VPBank ATM 수수료 없음) · 개략도(실제 지도 아님) · 거리·시간·요금은 추정 · 점선 회색 = 이날 안 가는 곳(우천 대안 포함)
      </Text>
    </div>
  );
}
