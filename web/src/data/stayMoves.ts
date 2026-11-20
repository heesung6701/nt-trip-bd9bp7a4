import type { Item } from "../types";

// 일정표(itinerary.json)에 없는 이동·체크인/아웃·ATM. 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리하므로 여기 날짜 쓰면 안 됨.
// 시각은 현지 기준. 요금은 Grab 4인승 추정(1만동 ≈ 550원).
export const STAY_MOVES: (Item & { day: number })[] = [
  // Day1 = 출발~숙소 입실까지 한 밤. 인천 쪽은 KST, 도착 후는 현지(KST-2h)이고 자정 넘으면 24:xx로 적어 정렬 유지 (화면엔 "+1")
  { day: 1, start: "17:30", end: "18:30", title: "[KST] 인천공항 T1 도착 (출발 3시간 전) · 파라타항공 카운터 체크인·짐 부치기 — 온라인 체크인 해두면 빠름", kind: "이동", place: "인천공항 T1", cost_krw: 0 },
  { day: 1, start: "18:30", end: "19:00", title: "[KST] 보안검색·출국심사 (자동출입국 심사)", kind: "이동", place: "인천공항 T1", cost_krw: 0 },
  { day: 1, start: "19:00", end: "19:55", title: "[KST] 저녁·면세 — 기내식 포함 여부 확인 · 출발 전 eSIM 설치 확인", kind: "이동", place: "인천공항 T1", cost_krw: 0 },
  { day: 1, start: "19:55", end: "20:35", title: "[KST] 탑승 (출발 40분 전 게이트, 탑승권에서 게이트 확인) → 20:35 출발, 비행 약 5시간 35분", kind: "이동", place: "인천공항 T1", cost_krw: 0 },
  { day: 1, start: "24:10", end: "24:25", title: "[현지] 깜라인 T2 도착 · 시계 -2시간 · 비행기 모드 끄고 eSIM 데이터 켜기 (Grab 연락용)", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "24:25", end: "24:55", title: "[현지] 입국심사 — 한국 여권 45일 무비자 · 귀국편 e-티켓 보여줄 수 있게. 자정 한국발 편 몰리면 30~60분", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "24:55", end: "25:00", title: "[현지] 수하물 찾기 · 세관 (e-Customs QR) · 입국장 ATM은 은행 미확인 — 급하지 않으면 패스", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "25:00", end: "25:05", title: "[현지] 입국장 출구에서 Grab 기사 만나기 (01:00 예약 완료) — 앱에서 차량번호·픽업 지점 확인, 늦어지면 앱 채팅으로 알리기", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "25:05", end: "25:20", title: "[현지] Grab → Navy Hotel (4~5km, 10~15분, 10~15만동)", kind: "이동", place: "Grab (예약 완료)", cost_krw: 7000 },
  { day: 1, start: "25:20", end: "25:35", title: "[현지] Navy Hotel 체크인 (예약은 Day1 · 06시까지 입실 가능, 프런트 24시간) → 바로 취침", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "09:30", end: "10:45", title: "기상 · Navy 조식 (포함, 운영 시간 체크인 때 프런트 확인) · 짐 정리", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "10:45", end: "11:00", title: "Navy Hotel 체크아웃 (정규 12:00, 조식 포함)", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "11:00", end: "11:30", title: "Navy → Westin (약 17km, 25~30만동)", kind: "이동", place: "Grab", cost_krw: 15000 },
  { day: 2, start: "11:30", end: "11:45", title: "Westin 도착 · 짐 맡기고 얼리 체크인 요청 (Platinum 보장 혜택 아님, 공실 시) — 안 되면 바로 수영장으로", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 2, start: "12:00", end: "12:35", title: "Westin ↔ 모벤픽 리조트 VPBank ATM 왕복 (1.5km, 편도 ≈5만동) — 현금 출금 (예산 탭 추천액), 외국 카드 수수료 없음. 비숙박객 출입 가능한지 프런트 확인", kind: "이동", place: "VPBank ATM (Movenpick Cam Ranh)", cost_krw: 5500 },
  { day: 2, start: "15:00", end: "15:10", title: "얼리 체크인 실패 시: 정규 체크인 15:00 — 수영장 중간에 프런트에서 키 받기", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "16:00", end: "16:05", title: "Westin 레이트 체크아웃 16:00 (확정) · 짐은 프런트 보관", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
];
