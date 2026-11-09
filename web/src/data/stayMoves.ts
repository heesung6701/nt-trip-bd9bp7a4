import type { Item } from "../types";

// 숙소 이동·체크인/아웃. 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리하므로 여기 날짜 쓰면 안 됨.
// 시각은 현지 기준. 요금은 Grab 4인승 추정(1만동 ≈ 550원).
export const STAY_MOVES: (Item & { day: number })[] = [
  { day: 1, start: "—", end: "—", title: "Navy Hotel 체크인 날짜 (예약상) — 실제 입실은 Day2 새벽", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "00:10", end: "00:50", title: "입국·수하물 → Grab/공항 택시 잡기", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 2, start: "00:50", end: "01:05", title: "공항 → Navy Hotel (4~5km, 10~15만동)", kind: "이동", place: "Grab 또는 공항 택시", cost_krw: 7000 },
  { day: 2, start: "01:05", end: "01:20", title: "Navy Hotel 체크인 (06시까지 가능, 프런트 24시간)", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "10:45", end: "11:00", title: "Navy Hotel 체크아웃 (정규 12:00, 조식 포함)", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "11:00", end: "11:30", title: "Navy → JW Marriott (약 17km, 25~30만동)", kind: "이동", place: "Grab", cost_krw: 15000 },
  { day: 2, start: "11:30", end: "11:45", title: "JW 도착 · 짐 맡기고 플래티넘 얼리 체크인 요청 (정규 15:00)", kind: "숙소", place: "JW Marriott Cam Ranh Bay", cost_krw: 0 },
  { day: 3, start: "16:00", end: "16:05", title: "JW 레이트 체크아웃 (플래티넘 최대 16:00) · 짐은 프런트 보관", kind: "숙소", place: "JW Marriott Cam Ranh Bay", cost_krw: 0 },
];
