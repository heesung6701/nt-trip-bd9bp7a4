// 날짜별 현지 지출 예산 (2인 합계, 동). 환전·ATM 출금액 잡는 용도.
// 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리. 숙박비(예약 결제분)·항공 제외.
// 금액은 대부분 추정 — Grab은 RouteGraph EDGES와 같은 값, 식사·스파는 숙소 비교 조사 때 후기 기준.
export const VND_PER_KRW = 10000 / 550; // 1만동 ≈ 550원

export type Pay = "현금" | "카드";
export interface BudgetLine {
  day: number;
  title: string;
  vnd: number;
  pay: Pay;
  note?: string;
}

export const BUDGET: BudgetLine[] = [
  { day: 2, title: "Grab 공항 → Navy (01:00 예약)", vnd: 150_000, pay: "카드", note: "Grab 앱 결제. 앱에서 현금 선택했으면 현금" },
  { day: 2, title: "Grab Navy → Westin", vnd: 300_000, pay: "카드", note: "Grab 앱" },
  { day: 2, title: "Westin 점심", vnd: 1_000_000, pay: "카드", note: "추정 1인 50만동, 룸차지" },
  { day: 2, title: "Grab Westin ↔ 가든 스파 왕복", vnd: 120_000, pay: "카드", note: "무료 픽업이면 0" },
  { day: 2, title: "가든 스파 120분 × 2", vnd: 1_600_000, pay: "현금", note: "가격 미확인 — 근처 로컬 스파 120분 $28~50 기준 1인 80만동 추정" },
  { day: 2, title: "스파 팁 × 2", vnd: 200_000, pay: "현금", note: "120분 1인 10만동 관례" },
  { day: 2, title: "Westin 해산물 저녁", vnd: 1_500_000, pay: "카드", note: "뷔페 1인 60만동+ & 세금·봉사료" },
  { day: 2, title: "물·간식·잔돈 팁", vnd: 200_000, pay: "현금" },
  { day: 3, title: "Grab Westin → 나트랑 항구", vnd: 500_000, pay: "카드", note: "보트 투어 픽업 포함이면 0" },
  { day: 3, title: "선상 관광 보트 × 2", vnd: 1_400_000, pay: "현금", note: "$27/인 기준, 현장 결제 가정 — 사전 결제했으면 0" },
  { day: 3, title: "Grab 항구 → Westin", vnd: 500_000, pay: "카드", note: "Grab 앱" },
  { day: 3, title: "Westin 해산물 점심", vnd: 1_000_000, pay: "카드", note: "추정" },
  { day: 3, title: "Westin 저녁", vnd: 1_500_000, pay: "카드", note: "추정" },
  { day: 3, title: "Grab Westin → 공항", vnd: 250_000, pay: "카드", note: "Grab 앱 사전 예약" },
  { day: 3, title: "물·간식·팁 · 공항 간식", vnd: 400_000, pay: "현금" },
];

// ponytail: 현금 합계 +20% 여유를 50만동 단위로 올림. VPBank ATM은 1회 500만동 이하 수수료 없음(2025 후기) — 넘으면 나눠 뽑기
export const cashToWithdraw = (cash: number) => Math.ceil((cash * 1.2) / 500_000) * 500_000;
