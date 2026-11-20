import { useState } from "react";
import { Text } from "@seed-design/react";
import { KIND_ICON, SIGHTS, STATUS, WESTIN_NOTE } from "./data/sights";

// 관광지도: 이동 지도(RouteGraph)와 달리 위·경도를 그대로 투영(동서남북·상대 거리 실제와 일치).
// 시내(Nha Trang) 구역만 확대 — Westin은 남쪽 약 35km라 지도 밖, 하단 화살표로 표시.
const W = 480, PAD = 44, PX_PER_KM = 100;
const LABEL_UP = new Set(["yersin"]); // 몰과 가까워 라벨이 겹치는 노드는 위쪽에
const KM_LAT = 111.2; // 위도 1° ≈ km
const lats = SIGHTS.map((s) => s.lat), lons = SIGHTS.map((s) => s.lon);
const latMax = Math.max(...lats), latMin = Math.min(...lats), lonMin = Math.min(...lons), lonMax = Math.max(...lons);
const lonKm = KM_LAT * Math.cos(((latMax + latMin) / 2 * Math.PI) / 180);
const mapW = (lonMax - lonMin) * lonKm * PX_PER_KM;
const x0 = (W - mapW) / 2;
const px = (lon: number) => x0 + (lon - lonMin) * lonKm * PX_PER_KM;
const py = (lat: number) => PAD + (latMax - lat) * KM_LAT * PX_PER_KM;
const H = py(latMin) + 110;

export function SightMap() {
  const [sel, setSel] = useState("thapba");
  const cur = SIGHTS.find((s) => s.id === sel)!;
  const mall = SIGHTS.find((s) => s.id === "mall")!;
  return (
    <div className="route-graph">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="나트랑 관광지도">
        <text x={W - 8} y={16} className="edge-label" textAnchor="end">↑ 북</text>
        {SIGHTS.map((s) => {
          const st = STATUS[s.status];
          const x = px(s.lon), y = py(s.lat), on = s.id === sel;
          return (
            <g key={s.id} onClick={() => setSel(s.id)} style={{ cursor: "pointer" }}>
              <circle cx={x} cy={y} r={on ? 15 : 12} fill={st.color} stroke={on ? "#222" : "#fff"} strokeWidth={on ? 3 : 2} />
              <text x={x} y={y + 1} className="node-icon" style={{ fontSize: 12 }}>{KIND_ICON[s.kind]}</text>
              <text x={x} y={LABEL_UP.has(s.id) ? y - 20 : y + 27} className={on ? "node-label on" : "node-label"}>{s.label}</text>
            </g>
          );
        })}
        <line x1={px(mall.lon)} y1={py(latMin) + 36} x2={px(mall.lon)} y2={H - 56} stroke="#c9ced6" strokeWidth={2} strokeDasharray="5 4" />
        <text x={W / 2} y={H - 38} className="edge-label">{"▼ 남쪽 약 35km: Westin · Bai Dai"}</text>
      </svg>
      <div className="card">
        <Text textStyle="t5Bold" color="fg.neutral">
          {STATUS[cur.status].icon} {cur.label} · {STATUS[cur.status].label}
        </Text>
        <Text textStyle="t4Regular" color="fg.neutral">{cur.info}</Text>
        <Text textStyle="t3Regular" color="fg.neutral-subtle">좌표 출처: {cur.src}</Text>
      </div>
      <ul className="card-list">
        {SIGHTS.map((s) => (
          <li className="card" key={s.id} onClick={() => setSel(s.id)} style={{ cursor: "pointer" }}>
            <Text textStyle="t4Bold" color="fg.neutral">
              {STATUS[s.status].icon} {s.label}
            </Text>
            <Text textStyle="t4Regular" color="fg.neutral-subtle">{STATUS[s.status].label}</Text>
          </li>
        ))}
      </ul>
      <Text textStyle="t4Regular" color="fg.neutral-subtle">
        {WESTIN_NOTE} · ✅ 기본 일정 🌧️ 플랜 B·비 ☀️ 플랜 B·맑음 🚫 제외 권장(빈원더스 — 알러지 충돌, 바호 폭포 — 우기 위험, 좌표 미확인으로 미표시) · 위·경도 그대로 투영한 지도(노드 위치 = 실제 위치) · 소요 추정·입장료·시간은 현장 확인 필요
      </Text>
    </div>
  );
}
