import type { Item } from "../types";

// 숙소 이동·체크인/아웃·ATM. 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리하므로 여기 날짜 쓰면 안 됨.
// 시각은 현지 기준. 요금은 Grab 4인승 추정(1만동 ≈ 550원).
export const STAY_MOVES: (Item & { day: number })[] = [
  { day: 1, start: "—", end: "—", title: "Navy Hotel 체크인 날짜 (예약상) — 실제 입실은 Day2 새벽", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "00:10", end: "01:00", title: "입국·수하물 → 예약한 Grab 기사 01:00 만나기 (픽업 지점 앱에서 확인)", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 2, start: "01:00", end: "01:15", title: "공항 → Navy Hotel (4~5km, 10~15만동) — Grab 01:00 예약 완료", kind: "이동", place: "Grab (예약 완료)", cost_krw: 7000 },
  { day: 2, start: "01:15", end: "01:30", title: "Navy Hotel 체크인 (06시까지 가능, 프런트 24시간)", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "10:45", end: "11:00", title: "Navy Hotel 체크아웃 (정규 12:00, 조식 포함)", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "11:00", end: "11:30", title: "Navy → Westin (약 17km, 25~30만동)", kind: "이동", place: "Grab", cost_krw: 15000 },
  { day: 2, start: "11:30", end: "11:45", title: "Westin 도착 · 짐 맡기고 얼리 체크인 요청 (Platinum 보장 혜택 아님, 공실 시) — 안 되면 바로 수영장으로", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 2, start: "12:00", end: "12:35", title: "Westin ↔ 모벤픽 리조트 VPBank ATM 왕복 (1.5km, 편도 ≈5만동) — 현금 500만동 출금, 외국 카드 수수료 없음. 비숙박객 출입 가능한지 프런트 확인", kind: "이동", place: "VPBank ATM (Movenpick Cam Ranh)", cost_krw: 5500 },
  { day: 2, start: "15:00", end: "15:10", title: "얼리 체크인 실패 시: 정규 체크인 15:00 — 수영장 중간에 프런트에서 키 받기", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "16:00", end: "16:05", title: "Westin 레이트 체크아웃 16:00 (확정) · 짐은 프런트 보관", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
];
