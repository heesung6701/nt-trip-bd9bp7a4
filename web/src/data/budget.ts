// 날짜별 현지 지출 예산 (2인 합계, 동). 환전·ATM 출금액 잡는 용도.
// 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리. 숙박비(예약 결제분)·항공 제외.
// Grab은 RouteGraph EDGES와 같은 추정치, 스파·보트·입장료는 researcher 조사(2026-11-20), 식사는 후기 기반 추정.
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
  { day: 1, title: "Grab 공항 → Navy (01:00 예약)", vnd: 150_000, pay: "카드", note: "Grab 앱 결제. 앱에서 현금 선택했으면 현금" },
  { day: 2, title: "Grab Navy → Westin", vnd: 200_000, pay: "카드", note: "Grab 앱 · ≈8.7km, 10~20만동 중 상한" },
  { day: 2, title: "Westin 점심", vnd: 1_000_000, pay: "카드", note: "추정 1인 50만동, 룸차지" },
  { day: 2, title: "Grab Westin ↔ 모벤픽 VPBank ATM 왕복", vnd: 100_000, pay: "카드", note: "편도 ≈5만동 추정" },
  { day: 2, title: "가든 스파 가든스페셜 120분 (W만)", vnd: 930_000, pay: "현금", note: "가격 확인 필요(카톡 문의) — 84만동(2025.10 블로그)과 $36(≈93만동) 두 출처가 달라 상한 93만동(≈51,150원)으로 잡음. 2인 이상 가격일 수 있음 — 1인 예약 가격·무료 픽업 조건 카톡 확인. 예약금 입금 후 현장 현금 결제 시 환불. Westin 200m 도보" },
  { day: 2, title: "스파 팁 (W)", vnd: 100_000, pay: "현금", note: "가든 스파 팁 정책 미확인 — 근처 헤르메스 120분 필수 팁 10만동 기준" },
  { day: 2, title: "M 비치바 한 잔 (스파 대기)", vnd: 200_000, pay: "카드", note: "Westin Hang Ten·Haven Lounge 가격 미공개 — 리조트 칵테일 세금 포함 추정. 할인 미적용 가정(Bonvoy 베트남 F&B 등급 할인은 약관상 미확인, 호텔 자체 할인 확인 필요)" },
  { day: 2, title: "Westin 해산물 저녁", vnd: 1_500_000, pay: "카드", note: "추정 (60만동++는 Verandah Hot Pot Night 세트(금·토만) 가격이라 일·월 저녁엔 해당 없음, 뷔페 가격은 Marriott 공식에 없음) · 세금·봉사료 별도" },
  { day: 2, title: "물·간식·잔돈 팁", vnd: 200_000, pay: "현금" },
  { day: 3, title: "Grab Westin → 나트랑 항구", vnd: 500_000, pay: "카드", note: "보트 투어 픽업 포함이면 0" },
  { day: 3, title: "선상 관광 보트 × 2", vnd: 1_300_000, pay: "카드", note: "OTA 사전 결제 (Klook $24.7/인~). 혼문 핵심구역 폐쇄 보도(2025.8) — 정박 여부 운영사 확인" },
  { day: 3, title: "나트랑 만 입장료 (혼문) × 2", vnd: 20_000, pay: "현금", note: "2025.9.25부터 1회 1만동, 항구 현장 결제 추정" },
  { day: 3, title: "Grab 항구 → Westin", vnd: 500_000, pay: "카드", note: "Grab 앱" },
  { day: 3, title: "Westin 해산물 점심", vnd: 1_000_000, pay: "카드", note: "추정" },
  { day: 3, title: "Westin 저녁", vnd: 1_500_000, pay: "카드", note: "추정" },
  { day: 3, title: "Westin 무료 공항 셔틀 → 공항 (21:20)", vnd: 0, pay: "카드", note: "무료 (Marriott 공식 표기, 요금은 예약 때 직원 재확인). Day2 체크인 때 21:20 하나만 예약 가능 — 24시간 전 안 하면 운행 취소. 21:20 놓치면 바로 Grab ≈15만동이 기본 (21:45편은 자리 있으면 탑승, 예약 불가·보장 아님). 레이트 체크아웃 거절 시 Haven Lounge 이용 가능 여부·요금 미확인 — 예산 별도" },
  // 21:20 셔틀을 놓칠 때의 Grab ≈15만동은 최악 케이스라 별도 줄로 넣지 않고 위 셔틀 줄 note에만 둠(합계·현금 추천액에 섞이지 않게)
  { day: 3, title: "물·간식·팁 · 공항 간식", vnd: 400_000, pay: "현금" },
];

// ponytail: 현금 합계 +20% 여유를 50만동 단위로 올림. VPBank ATM은 외국 카드 수수료 없음, 1회 한도 500만~1,000만동(기계마다, 2026 블로그)
export const cashToWithdraw = (cash: number) => Math.ceil((cash * 1.2) / 500_000) * 500_000;
