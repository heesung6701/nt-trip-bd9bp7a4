import { Text } from "@seed-design/react";
import { NODES, type NodeKind } from "./data/routeNodes";

// 숙소·관광지·공항 = 노드, 이동 = 간선. 선택한 Day의 경로만 색칠.
// 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리하므로 여기 날짜·편명 쓰면 안 됨.
// ponytail: 배치는 동서남북만 실제와 맞춘 개략도(routeNodes.ts), 거리는 stayMoves/itinerary 소요시간 기반 추정 — 실측 아님.

const ICON: Record<NodeKind, string> = { airport: "✈️", stay: "🏨", spot: "📍", atm: "🏧" };
type NodeId = keyof typeof NODES;

// 교통수단은 아이콘으로 — 라벨에 거리·시간까지 넣으면 길어서
const MODE_ICON = { Grab: "🚕", 보트: "⛴️", 도보: "🚶" } as const;
// cost = Grab 4인승 1대 요금(2인 합계), stayMoves·budget.ts와 같은 추정치. 보트는 투어 요금에 포함
const EDGES: { a: NodeId; b: NodeId; km: string; min: string; cost: string; mode: keyof typeof MODE_ICON; t?: number }[] = [
  { a: "cxr", b: "navy", km: "4~5km", min: "10~15분", cost: "10~15만동", mode: "Grab", t: 0.6 },
  { a: "navy", b: "westin", km: "≈17km", min: "≈30분", cost: "25~30만동", mode: "Grab" },
  { a: "westin", b: "cxr", km: "≈15km", min: "15~30분", cost: "≈25만동", mode: "Grab", t: 0.6 },
  { a: "westin", b: "port", km: "≈35km", min: "≈50분", cost: "≈50만동", mode: "Grab" },
  { a: "port", b: "honmun", km: "≈10km", min: "≈30분", cost: "투어 포함", mode: "보트" },
  // ATM — VPBank는 외국 카드 출금 수수료 없음(2026 블로그 기준). 공항 T2 24시간 ATM은 은행 미확인이라 노드 없음
  { a: "westin", b: "atmMovenpick", km: "≈1.5km", min: "≈5분", cost: "≈5만동", mode: "Grab" },
  { a: "port", b: "atmVinmec", km: "≈0.9km", min: "≈12분", cost: "무료", mode: "도보", t: 0.4 },
  // 우천 대안·미배정 장소
  { a: "port", b: "ocean", km: "≈0.5km", min: "≈5분", cost: "무료", mode: "도보", t: 0.45 },
  { a: "port", b: "honchong", km: "≈8km", min: "≈20분", cost: "≈10만동", mode: "Grab", t: 0.65 },
  { a: "honchong", b: "thapba", km: "≈3km", min: "≈10분", cost: "≈5만동", mode: "Grab" },
];
const edgeKey = (a: string, b: string) => [a, b].sort().join("-");

type Step = { time: string; at: NodeId; to?: NodeId; text: string };
const ROUTES: Record<number, { color: string; note?: string; steps: Step[] }> = {
  1: {
    color: "#2f6fed",
    note: "인천 20:35(KST) 출발 → 현지 00:10(+1) 도착. 시각은 현지 기준",
    steps: [
      { time: "00:10+1", at: "cxr", text: "T2 도착 · 입국심사 30~60분 · 짐 찾기 · T2 24시간 ATM 있음 (은행 미확인 — 수수료 비싸면 Day2 모벤픽 VPBank에서)" },
      { time: "01:00+1", at: "cxr", to: "navy", text: "Grab 예약 완료 (01:00 픽업) · 10~15분 · 10~15만동" },
      { time: "01:20+1", at: "navy", text: "체크인 · 취침" },
    ],
  },
  2: {
    color: "#2f6fed",
    steps: [
      { time: "11:00", at: "navy", to: "westin", text: "Grab · ≈30분 · 25~30만동" },
      { time: "11:30", at: "westin", text: "도착 · 짐 맡기고 얼리 체크인 요청" },
      { time: "12:00", at: "westin", to: "atmMovenpick", text: "Grab ≈5분 · VPBank ATM 현금 출금 (예산 탭 추천액, 수수료 없음)" },
      { time: "12:20", at: "atmMovenpick", to: "westin", text: "Grab 복귀 → 점심 · 수영장 · 16:10 아내 가든 스파 120분 (Westin 200m 도보, 지도 노드 생략) · 그동안 남편 해변 산책 → 비치바 · 해산물 저녁" },
    ],
  },
  3: {
    color: "#f26b1d",
    steps: [
      { time: "~08:00", at: "westin", to: "port", text: "Grab ≈50분 · 일정표에 없음 — 보트 투어 픽업 포함인지 확인" },
      { time: "09:00", at: "port", to: "honmun", text: "선상 관광 보트 (입수 없음)" },
      { time: "~12:30", at: "honmun", to: "port", text: "귀항" },
      { time: "13:00", at: "port", to: "westin", text: "Grab ≈50분" },
      { time: "14:00", at: "westin", text: "해산물 점심 · 16:00 레이트 체크아웃 (확정) · 저녁" },
      { time: "20:00", at: "westin", to: "cxr", text: "Grab 사전 예약 · 15~30분" },
    ],
  },
  4: { color: "#8b5cf6", steps: [{ time: "00:30", at: "cxr", text: "출국 (현지 시각)" }] },
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
      <svg viewBox="0 0 400 470" role="img" aria-label={`Day ${dayNo} 이동 그래프`}>
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
        간선 = 순서 · 소요시간 · 요금(2인 1대) / 거리 · 화살표 = 이동 방향 (🚕 Grab ⛴️ 보트 🚶 도보 · 🏧 VPBank ATM 수수료 없음) · 개략도(실제 지도 아님) · 거리·시간·요금은 추정 · 점선 회색 = 이날 안 가는 곳(우천 대안 포함)
      </Text>
    </div>
  );
}
