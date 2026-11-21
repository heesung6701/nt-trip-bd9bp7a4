// Westin Cam Ranh 부대시설·식당 — 출처는 공식 marriott.com 페이지·PDF만 (2026-11-20 확인, 여행사 정보 제외).
// 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리. 가격 "++" = VAT 8% + 봉사료 5% 별도(실제 ≈ ×1.134 추정).
export interface Facility {
  name: string;
  detail: string;
  price?: string;
  src?: string;
}

const M = "https://www.marriott.com/en-us/hotels/cxrwi-the-westin-resort-and-spa-cam-ranh";
const PDF = "https://www.marriott.com/content/dam/marriott-digital/wi/apec/hws/c/cxrwi/en_us/document/assets";

export const WESTIN_TAX_NOTE = "가격 뒤 ++ = VAT 8% + 봉사료 5% 별도 (실제 약 ×1.13). Bonvoy 회원 참여 업장 F&B 10% 할인. 문의: +84 258 399 3888 · Bonvoy 앱 채팅";

export const WESTIN_PLAY: Facility[] = [
  { name: "수영장 3개 (리조트·인피니티·키즈)", detail: "Fitness Pool·Kids Pool·Resort Pool · 운영시간 Marriott 미표기 — 체크인 때 확인. 카바나 있음", price: "투숙객 무료", src: `${M}/experiences/` },
  { name: "무료 액티비티 (24시간 전 등록)", detail: "Day2(일): 08:30 필라테스, 10~11 풀 미니게임, 16~17 비치발리볼, 19~20:30 야외영화 · Day3(월): 06:30~07:30 RunWESTIN, 08:30~09:30 모닝 스트레칭 · 상시 06~17 스노클링·비치발리볼·프리스비 등 (07·08:30 수업만 24시간 전 등록)", price: "무료", src: `${PDF}/wi-cxrwi-free-weekly-activities-40688.pdf` },
  { name: "Heavenly Spa", detail: "시그니처 Bamboo Body Therapy · 트리트먼트룸 6개(커플 2) · 객실 전화 0번 예약. 60/90/120분 가격은 공식 미공개", price: "가격 미확인", src: `${M}/experiences/` },
  { name: "WestinWORKOUT 피트니스", detail: "24시간 · 요가 스튜디오 · 스팀/사우나 정보 없음 · 신발 규정·신발 대여 Marriott 미표기 (대여 품목은 회복 도구·요가 매트·웨이트뿐) — 확인 필요", price: "투숙객 무료", src: `${M}/experiences/` },
  { name: "테니스 · 피클볼", detail: "06~17시 / 17~21시 요금 다름", price: "테니스 20만동++/시 (17시 이후 30만) · 피클볼 15만동++ (17시 이후 25만)", src: `${PDF}/wi-cxrwi-activities-price-list-43826.pdf` },
  { name: "카약 · 바디보드 · SUP 대여", detail: "06~16시 · 워터 액티비티 센터 06~18시. 주간 프로그램 PDF에 월·금 10~11시 카약이 있으나 무료인지 불명 — 유료로 보고 계획", price: "카약 1인 15만동++/시 · 2인 20만동++/시 · 바디보드 10만동++ · SUP 20만동++", src: `${PDF}/wi-cxrwi-activities-price-list-43826.pdf` },
  { name: "자전거 대여", detail: "06~17시", price: "10만동++/시 (≈5,500원)", src: `${PDF}/wi-cxrwi-activities-price-list-43826.pdf` },
  { name: "개인 강습 (요가·테니스·PT)", detail: "예약제", price: "80만동++/시 (≈4.4만원)", src: `${PDF}/wi-cxrwi-activities-price-list-43826.pdf` },
  { name: "공항 셔틀", detail: "공항→리조트 10:45 · 리조트→공항 21:20, 21:45 (하나만 예약 가능) · 21:20 예약 완료 · 24시간 전 예약 필수 · +84 258-3993888 내선 5410 · 출발 10분 전 픽업 장소 대기. 숙박일수 조건 표기 없음", price: "무료 (Complimentary)", src: `${M}/overview/` },
  { name: "시내 셔틀 (나트랑 Gold Coast 몰)", detail: "Westin 안내 기준 — 리조트→시내 11:30 매일, 14:30 토·일 추가 / 시내→리조트 18:15 매일, 15:30 토·일 추가 · Day2=주말 시간표, Day3=평일 시간표 · 24시간 전 예약(Marriott 페이지 표기) · 시내 기사 연락 +84 915-499-601 · 요금·예약 필요 여부·소요시간(도로 약 33km·차 35분은 OSM 계산값, 셔틀 실측 아님 — 일정은 여유 있게 50분 추정)·11월 운행 여부는 안내에 없음 — 확인 필요 · 승·하차 장소는 GOLD COAST SHOPPING MALL (01 Tran Hung Dao Street, Loc Tho Ward, Nha Trang City, Westin 안내 기준, 실내 몰이라 비 올 때 대기·구경 가능)", price: "확인 필요", src: `${M}/overview/` },
  { name: "데이패스 · 데이유즈 룸", detail: "해변·수영장·피트니스·레크리에이션 낮 시간 이용 상품. 가격 Marriott 미표기", price: "미확인", src: `${M}/experiences/` },
  { name: "체크아웃 후 수영장·피트니스·샤워", detail: "Marriott에 정책 없음 (정규 체크아웃 12:00). 체크인 때 프런트에 문의", price: "—" },
];

export const WESTIN_EAT: Facility[] = [
  { name: "The Verandah (올데이)", detail: "07~22시 · 베트남식·해산물 단품 · 조식 06:30~10:30 · 캐주얼. Hot Pot Night는 금·토만 (Day2 일요일 없음)", price: "조식 투숙객 포함 표기 · 외부 구매 60만동+ (연도 불명)", src: `${M}/dining/` },
  { name: "Hang Ten Beach Bar & Grill", detail: "11~21시 · 해산물·숯불 그릴 · 예약 SevenRooms 또는 내선 5608 · 해산물 플래터 주문 시 와인 1병 증정", price: "커플 5코스 400만동~ (24시간 전 예약) · Ocean to Table 사전주문 Club Marriott 30% 할인", src: `${M}/dining/` },
  { name: "Haven Lounge", detail: "14~22시 · 커피·애프터눈티·선셋 칵테일 · 체크인 전 이용 가능(Westin 문의 결과), 체크아웃 후는 미확인 · 해피아워 매일 18~20시 프리미엄 칵테일 50% 할인 · 19~21시 스낵(나초 22만동~, 세금·봉사료 별도) · Bonvoy 10%·Club Marriott 30% 할인", price: "칵테일 해피아워 50% 할인", src: "https://www.marriott.com/ko/offers/haven-lounger-offers-off-222472/cxrwi-the-westin-resort-and-spa-cam-ranh" },
  { name: "Plunge Bar (풀바)", detail: "음료·스낵 · 시간 미표기", price: "가격 미공개", src: `${M}/dining/` },
  { name: "Westin Fresh by The Juicery", detail: "주스·스무디", price: "가격 미공개", src: `${M}/dining/` },
  { name: "룸서비스", detail: "공식 페이지에 24/7과 미제공이 둘 다 있음 — 체크인 때 확인", price: "—", src: `${M}/dining/` },
];
