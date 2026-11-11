import { Text } from "@seed-design/react";

// 숙소·관광지·공항 = 노드, 이동 = 간선. 선택한 Day의 경로만 색칠.
// 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리하므로 여기 날짜·편명 쓰면 안 됨.
// ponytail: 좌표는 손으로 찍은 개략 배치(북쪽 위), 거리는 stayMoves/itinerary 소요시간 기반 추정 — 실측 아님.

type NodeKind = "airport" | "stay" | "spot";
const ICON: Record<NodeKind, string> = { airport: "✈️", stay: "🏨", spot: "📍" };

const NODES: Record<string, { label: string; kind: NodeKind; x: number; y: number }> = {
  thapba: { label: "Thap Ba 온천", kind: "spot", x: 50, y: 40 },
  honchong: { label: "혼쫑 해변", kind: "spot", x: 200, y: 40 },
  ocean: { label: "해양학연구소", kind: "spot", x: 40, y: 150 },
  port: { label: "나트랑 항구", kind: "spot", x: 170, y: 150 },
  honmun: { label: "몬섬 해상", kind: "spot", x: 300, y: 110 },
  jw: { label: "JW Marriott", kind: "stay", x: 150, y: 275 },
  cxr: { label: "깜라인 공항", kind: "airport", x: 260, y: 355 },
  navy: { label: "Navy Hotel", kind: "stay", x: 90, y: 410 },
};
type NodeId = keyof typeof NODES;

// 교통수단은 아이콘으로 — 라벨에 거리·시간까지 넣으면 길어서
const MODE_ICON = { Grab: "🚕", 보트: "⛴️", 도보: "🚶" } as const;
const EDGES: { a: NodeId; b: NodeId; km: string; min: string; mode: keyof typeof MODE_ICON; t?: number }[] = [
  { a: "cxr", b: "navy", km: "4~5km", min: "10~15분", mode: "Grab", t: 0.6 },
  { a: "navy", b: "jw", km: "≈17km", min: "≈30분", mode: "Grab" },
  { a: "jw", b: "cxr", km: "≈15km", min: "15~30분", mode: "Grab", t: 0.6 },
  { a: "jw", b: "port", km: "≈35km", min: "≈50분", mode: "Grab" },
  { a: "port", b: "honmun", km: "≈10km", min: "≈30분", mode: "보트", t: 0.45 },
  // 우천 대안·미배정 장소
  { a: "port", b: "ocean", km: "≈0.5km", min: "≈5분", mode: "도보" },
  { a: "port", b: "honchong", km: "≈8km", min: "≈20분", mode: "Grab" },
  { a: "honchong", b: "thapba", km: "≈3km", min: "≈10분", mode: "Grab" },
];
const edgeKey = (a: string, b: string) => [a, b].sort().join("-");

type Step = { time: string; at: NodeId; to?: NodeId; text: string };
const ROUTES: Record<number, { color: string; note?: string; steps: Step[] }> = {
  1: { color: "#2f6fed", note: "출국일 — 인천 출발, 현지 이동 없음 (Day2 00:10 도착)", steps: [] },
  2: {
    color: "#2f6fed",
    steps: [
      { time: "00:10", at: "cxr", text: "T2 도착 · 입국·수하물" },
      { time: "00:50", at: "cxr", to: "navy", text: "Grab 사전 예약 (예정) · 10~15분 · 10~15만동" },
      { time: "01:05", at: "navy", text: "체크인 · 취침" },
      { time: "11:00", at: "navy", to: "jw", text: "Grab · ≈30분 · 25~30만동" },
      { time: "11:30", at: "jw", text: "얼리 체크인 요청 · 수영장 · 스파 · 해산물 저녁" },
    ],
  },
  3: {
    color: "#f26b1d",
    steps: [
      { time: "~08:00", at: "jw", to: "port", text: "Grab ≈50분 · 일정표에 없음 — 보트 투어 픽업 포함인지 확인" },
      { time: "09:00", at: "port", to: "honmun", text: "선상 관광 보트 (입수 없음)" },
      { time: "~12:30", at: "honmun", to: "port", text: "귀항" },
      { time: "13:00", at: "port", to: "jw", text: "Grab ≈50분" },
      { time: "14:00", at: "jw", text: "해산물 점심 · 16:00 레이트 체크아웃 · 저녁" },
      { time: "20:00", at: "jw", to: "cxr", text: "Grab 사전 예약 · 15~30분" },
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
  route.steps.forEach((s, i) => {
    if (!s.to) return;
    const k = edgeKey(s.at, s.to);
    stepNos.set(k, [...(stepNos.get(k) ?? []), i + 1]);
  });

  return (
    <div className="route-graph">
      <svg viewBox="0 0 340 450" role="img" aria-label={`Day ${dayNo} 이동 그래프`}>
        {EDGES.map((e) => {
          const A = NODES[e.a], B = NODES[e.b];
          const nos = stepNos.get(edgeKey(e.a, e.b));
          const on = !!nos;
          const label = `${on ? nos.map(circled).join("") + " " : ""}${MODE_ICON[e.mode]} ${e.km} · ${e.min}`;
          const t = e.t ?? 0.5; // 라벨 위치(간선 위 비율) — 노드와 겹치면 조정
          const mx = A.x + (B.x - A.x) * t, my = A.y + (B.y - A.y) * t;
          return (
            <g key={edgeKey(e.a, e.b)}>
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={on ? route.color : GRAY} strokeWidth={on ? 4 : 2}
                strokeDasharray={on ? undefined : "5 4"} strokeLinecap="round" />
              <text x={mx} y={my} className={on ? "edge-label on" : "edge-label"} fill={on ? route.color : "#8a919c"}>
                {label}
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
              <text x={n.x} y={n.y + 32} className={on ? "node-label on" : "node-label"}>{n.label}</text>
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
        간선 = 거리 · 소요시간 (🚕 Grab ⛴️ 보트 🚶 도보) · 개략도(실제 지도 아님) · 거리·시간은 추정 · 점선 회색 = 이날 안 가는 곳(우천 대안 포함)
      </Text>
    </div>
  );
}
