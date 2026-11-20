import type { Item } from "../types";

// 일정표(itinerary.json)에 없는 이동·체크인/아웃·ATM. 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리하므로 여기 날짜 쓰면 안 됨.
// 시각은 현지 기준. 요금은 Grab 4인승 추정(1만동 ≈ 550원).
export const STAY_MOVES: (Item & { day: number })[] = [
  // Day1 = 현지 도착~숙소 입실까지 한 밤. 현지 시각(KST-2h), 자정 넘으면 24:xx로 적어 정렬 유지 (화면엔 "+1")
  { day: 1, start: "24:10", end: "24:25", title: "깜라인 T2 도착", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "24:25", end: "25:00", title: "패스트트랙으로 이동 → 안 되면 일반 입국심사", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "25:00", end: "25:05", title: "입국장 출구에서 Grab 기사 만나기 (01:00 예약)", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "25:05", end: "25:20", title: "Grab → Navy Hotel (4~5km, 10~15분, 10~15만동)", kind: "이동", place: "Grab (예약 완료)", cost_krw: 7000 },
  { day: 1, start: "25:20", end: "25:35", title: "Navy Hotel 체크인 (예약은 Day1 · 06시까지 입실 가능, 프런트 24시간) → 바로 취침", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "09:30", end: "10:45", title: "기상 · Navy 조식 (포함, 운영 시간 체크인 때 프런트 확인) · 짐 정리", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "10:45", end: "11:00", title: "Navy Hotel 체크아웃 (정규 12:00, 조식 포함)", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "11:00", end: "11:30", title: "Navy → Westin (약 8.7km, 10~15분 · 호출·대기 포함 30분 잡음, 10~20만동)", kind: "이동", place: "Grab", cost_krw: 11000 },
  { day: 2, start: "11:30", end: "11:45", title: "Westin 도착 · 짐 맡기고 얼리 체크인 요청 (보장 아님, 공실 시) — 안 돼도 수영장·Haven Lounge(14시~) 이용 가능 · 프런트 확인 목록은 준비 탭 체크리스트 참고", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 2, start: "12:00", end: "12:35", title: "Westin ↔ 모벤픽 리조트 VPBank ATM 왕복 (1.5km, 편도 ≈5만동 · 왕복 10만동) — 현금 출금 (예산 탭 추천액), 외국 카드 수수료 없음. 비숙박객 출입 가능한지 프런트 확인", kind: "이동", place: "VPBank ATM (Movenpick Cam Ranh)", cost_krw: 5500 },
  { day: 2, start: "15:00", end: "15:10", title: "얼리 체크인 실패 시: 정규 체크인 15:00 — 수영장 중간에 프런트에서 키 받기", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "06:45", end: "07:25", title: "조식 (The Verandah 06:30~10:30, 투숙객 포함 표기)", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "07:25", end: "07:40", title: "레이트 체크아웃 승인 못 받았으면 체크아웃 · 짐 프런트 보관", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "07:45", end: "08:35", title: "Westin → 나트랑 항구 Grab (≈35km, ≈50분, ≈50만동) — 투어 픽업 포함이면 생략", kind: "이동", place: "Grab", cost_krw: 27500 },
  { day: 3, start: "16:00", end: "16:05", title: "Westin 레이트 체크아웃 (16:00까지 가능, 공실 시·보장 아님) · 짐은 프런트 보관", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "20:30", end: "21:05", title: "프런트에서 짐 찾기 · 공항 가기 전 샤워", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "21:10", end: "21:20", title: "공항 셔틀 픽업 장소 대기 (21:20 예약 완료, 출발 10분 전) — 놓치면 프런트에 Grab 요청 (≈7km, 15~30분, ≈15만동)", kind: "이동", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "21:50", end: "22:10", title: "공항 도착 · 출국 절차 — 기내 휴대만, 온라인 체크인·모바일 탑승권 · 기내 반입 규정(무게·액체) 확인", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
];
