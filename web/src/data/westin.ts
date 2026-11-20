// Westin Cam Ranh 부대시설·식당 (researcher 조사 2026-11-20, 공식 marriott.com 페이지·PDF 우선).
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
  { name: "수영장 3개 (리조트·인피니티·키즈)", detail: "운영시간 출처마다 다름(07~19시 / 06:30~20시) — 체크인 때 확인. 카바나 이용 포함", price: "투숙객 무료", src: `${M}/experiences/` },
  { name: "무료 액티비티 (24시간 전 등록)", detail: "Day2: 16~17 비치발리볼, 19~20:30 야외영화 · Day3: 07~08 RunWESTIN, 08:30~09:30 모닝 스트레칭", price: "무료", src: `${PDF}/wi-cxrwi-free-weekly-activities-40688.pdf` },
  { name: "Heavenly Spa", detail: "시그니처 Bamboo Body Therapy · 트리트먼트룸 6개(커플 2) · 객실 전화 0번 예약. 60/90/120분 가격은 공식 미공개", price: "가격 미확인", src: `${M}/experiences/` },
  { name: "WestinWORKOUT 피트니스", detail: "24시간 · 스팀/사우나 정보 없음", price: "투숙객 무료", src: `${M}/experiences/` },
  { name: "테니스 · 피클볼", detail: "06~17시 / 17~21시 요금 다름", price: "테니스 20만동++/시 (17시 이후 30만) · 피클볼 15만동++ (17시 이후 25만)", src: `${PDF}/wi-cxrwi-activities-price-list-43826.pdf` },
  { name: "자전거 대여", detail: "06~17시", price: "10만동++/시 (≈5,500원)", src: `${PDF}/wi-cxrwi-activities-price-list-43826.pdf` },
  { name: "개인 강습 (요가·테니스·PT)", detail: "예약제", price: "80만동++/시 (≈4.4만원)", src: `${PDF}/wi-cxrwi-activities-price-list-43826.pdf` },
  { name: "시내 셔틀", detail: "리조트→나트랑 시내 주말 11:30·14:30 / 복귀 15:30·18:15 · 5일 전 예약. 공항 무료 셔틀은 2박 이상만 — 1박이라 해당 없음 (한국 여행사 페이지 출처, 호텔 확인 필요)", price: "미확인", src: "https://tripon.kr/accommodation/490" },
  { name: "데이패스 · 데이유즈 룸", detail: "상품 존재만 확인 — 체크아웃 후 시설 이용·샤워 대안. 가격 미확인", price: "미확인", src: `${M}/experiences/` },
  { name: "체크아웃 후 스파 샤워실", detail: "Heavenly Spa(2층) 샤워실 체크아웃 후 무료, 21:00 마감 · 부대시설도 체크아웃 후 이용 가능. 호텔 제공 정보라고 여행사가 게재(날짜 없음), 공식 marriott.com엔 없음 — 체크인 때 확인", price: "무료 (여행사 표기)", src: "https://www.tourpik.com/item.php?id=TC55430355" },
];

export const WESTIN_EAT: Facility[] = [
  { name: "The Verandah (올데이)", detail: "07~22시 · 베트남식·해산물 단품 · 조식 06:30~10:30 · 캐주얼. Hot Pot Night는 금·토만 (Day2 일요일 없음)", price: "조식 투숙객 포함 표기 · 외부 구매 60만동+ (연도 불명)", src: `${M}/dining/` },
  { name: "Hang Ten Beach Bar & Grill", detail: "11~21시 · 해산물·숯불 그릴 · 예약 SevenRooms 또는 내선 5608 · 해산물 플래터 주문 시 와인 1병 증정", price: "커플 5코스 400만동~ (24시간 전 예약) · Ocean to Table 사전주문 Club Marriott 30% 할인", src: `${M}/dining/` },
  { name: "Haven Lounge", detail: "14~22시 · 커피·애프터눈티·선셋 칵테일", price: "가격 미공개", src: `${M}/dining/` },
  { name: "Plunge Bar (풀바)", detail: "음료·스낵 · 시간 미표기", price: "가격 미공개", src: `${M}/dining/` },
  { name: "Westin Fresh by The Juicery", detail: "주스·스무디", price: "가격 미공개", src: `${M}/dining/` },
  { name: "룸서비스", detail: "공식 페이지에 24/7과 미제공이 둘 다 있음 — 체크인 때 확인", price: "—", src: `${M}/dining/` },
];
