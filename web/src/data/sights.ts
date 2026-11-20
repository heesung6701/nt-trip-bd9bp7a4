import { NODES } from "./routeNodes";

// 관광지도용 장소. 좌표는 OpenStreetMap(Nominatim) — 기존 노드(routeNodes.ts)는 그 좌표 재사용.
// 입장료·시간·소요는 itinerary.json 플랜 B·activities 값만 재사용(소요는 추정). 몰↔장소 거리는 OSRM 도로 계산(OSM 좌표).
// 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리하므로 여기 날짜 쓰면 안 됨.
export type SightStatus = "base" | "rain" | "sun" | "skip" | "transit";
export type SightKind = "spa" | "sight" | "transit" | "stay";

export const STATUS: Record<SightStatus, { icon: string; label: string; color: string }> = {
  base: { icon: "✅", label: "기본 일정", color: "#2f6fed" },
  rain: { icon: "🌧️", label: "플랜 B·비", color: "#3a9ad9" },
  sun: { icon: "☀️", label: "플랜 B·맑음", color: "#f5a524" },
  skip: { icon: "🚫", label: "제외 권장", color: "#c0392b" },
  transit: { icon: "🚐", label: "시내 셔틀 승하차", color: "#8a919c" },
};
export const KIND_ICON: Record<SightKind, string> = { spa: "♨️", sight: "📍", transit: "🚐", stay: "🏨" };

export interface Sight {
  id: string;
  label: string;
  kind: SightKind;
  status: SightStatus;
  lat: number;
  lon: number;
  info: string; // 핵심 한 줄
  src: string; // 좌표 출처
}

const OSM = (way: string) => `OSM ${way}`;

export const SIGHTS: Sight[] = [
  { id: "thapba", label: "Thap Ba 온천 머드 스파", kind: "spa", status: "rain", lat: NODES.thapba.lat, lon: NODES.thapba.lon,
    info: "온천 탕(바닷물 아님) · 약 120분 · 약 30,000원(추정) · Day3 오전, 우천+보트 취소 시 대안(기본 일정 아님) · 온천 탕 입욕 가능(바닷물 아님) · 몰에서 도로 약 5.6km·10분",
    src: OSM("way 397966701 Bùn khoáng Tháp Bà") },
  { id: "ponagar", label: "뽀나가르 참탑", kind: "sight", status: "sun", lat: 12.2653884, lon: 109.1951777,
    info: "약 3만동≈1,650원 · 06:00~18:00 (10~12월 17:30 마감 출처 있음) · 45~60분(소요 추정 60) · 무릎·어깨 가리는 복장 · 몰에서 도로 약 3.1km·5분",
    src: "OSM Nominatim 'Tháp Po Nagar'" },
  { id: "longson", label: "롱선사", kind: "sight", status: "sun", lat: 12.2513064, lon: 109.1806381,
    info: "무료 · 대불까지 계단 150~190개(아래 구간만 가도 됨) · 소요 추정 45분 · 점심 휴식 시간 확인 필요 · 몰에서 도로 약 1.8km·3분",
    src: "OSM Nominatim 'Chùa Long Sơn'" },
  { id: "honchong", label: "혼쫑 곶", kind: "sight", status: "sun", lat: NODES.honchong.lat, lon: NODES.honchong.lon,
    info: "해변 무료(발목 아래 물가만) · 바위 등반은 한 출처에서 약 3만동(확인 필요) · 맑을 때만, 기본 일정 아님 · 몰에서 도로 약 3.4km·5분",
    src: OSM("way 792392852 Hòn Chồng") },
  { id: "dam", label: "담시장", kind: "sight", status: "rain", lat: 12.2553289, lon: 109.1916641,
    info: "무료 · 05:00~18:30(영업시간 확인 필요) · 40~60분(소요 추정 50) · 실내 · 몰에서 도로 약 1.1km·3분",
    src: "OSM Nominatim 'Chợ Đầm'" },
  { id: "yersin", label: "예르생 박물관", kind: "sight", status: "rain", lat: 12.2509232, lon: 109.1961308,
    info: "약 2만동≈1,100원 · 월~금 07:30~11:30·14:00~17:00 · Day2(일요일)는 휴관, Day3(월)만 · 30~45분(소요 추정 40) · 몰에서 도로 약 1.0km·2분",
    src: "OSM Nominatim 'Bảo tàng Alexandre Yersin'" },
  { id: "cathedral", label: "나트랑 대성당", kind: "sight", status: "rain", lat: 12.2467333, lon: 109.188137,
    info: "무료 · 외관 위주, 비 약할 때만 · 일요일은 미사로 05~07시·11~16:30만 방문, 월요일이 나음 · 30분 · 몰에서 도로 약 1.0km·2분",
    src: OSM("way 162818208 Nhà thờ Chính tòa Nha Trang") },
  { id: "ocean", label: "해양학연구소", kind: "sight", status: "rain", lat: NODES.ocean.lat, lon: NODES.ocean.lon,
    info: "성인 약 4만동≈2,200원(출처별 2~4만동) · 06:00~18:00 매일 · 1~1.5시간(소요 추정 90분) · Day3 보트 취소 시 대체 · 몰에서 도로 약 5.5km·8분(18:15 몰 복귀 고려해 17:30 전 퇴장)",
    src: "routeNodes.ts ocean (OSM)" },
  { id: "mall", label: "Gold Coast 몰", kind: "transit", status: "transit", lat: 12.2482338, lon: 109.1951162,
    info: "Westin 시내 셔틀 승하차(Westin 안내 기준 Day3 평일 11:30 출발 · 18:15 복귀 · 요금·예약·소요 확인 필요) · 실내 몰 · 좌표는 같은 주소(1 Tran Hung Dao) Lotte Mart Nha Trang Gold Coast 건물 기준, 몰 본체 아님 · 바로 옆 Nha Trang Center(09:00~22:00, 실내, OSM 12.2483, 109.1965)",
    src: OSM("way 1239587429 Lotte Mart Nha Trang Gold Coast") },
];

// 시내 지도 밖(남쪽 약 35km) — 지도 하단에 화살표로만 표시
export const WESTIN_NOTE = "▼ Westin · Bai Dai 해변 — 이 지도 남쪽 약 35km (Grab ≈50분, 시내 셔틀은 Gold Coast 몰까지). Bai Dai 해변은 맑을 때 발목 아래 물가 걷기(무료)";
