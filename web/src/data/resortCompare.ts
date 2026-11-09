// JW 대안 호캉스 비교 (2026년 11월 09일 검색). 1 USD ≈ 1,400원, 1만동 ≈ 550원.
// 숙박비는 예약사이트 스냅샷(Day2 실요금 아님), 식당·스파는 후기·프로모션가 위주 — 예약 전 재확인.

export interface Src {
  label: string;
  url: string;
}
export interface Cell {
  t: string;
  src?: Src[];
}
export interface ResortRow {
  name: string;
  marriott: boolean;
  room: Cell;
  dining: Cell;
  spa: Cell; // 호텔 스파 60분
  massage: Cell; // 외부 로컬 마사지 접근성
  rain: Cell;
}

const TA_JW = "https://www.tripadvisor.com/Hotel_Review-g18928520-d33299183-Reviews-JW_Marriott_Cam_Ranh_Bay_Resort_Spa-Cam_Hai_Dong_Cam_Lam_District_Khanh_Hoa_Provinc.html";
const TA_WESTIN = "https://www.tripadvisor.com/Hotel_Review-g18928520-d24154516-Reviews-The_Westin_Resort_Spa_Cam_Ranh-Cam_Hai_Dong_Cam_Lam_District_Khanh_Hoa_Province.html";
const FLOOD_2025 = { label: "DTiNews 2025.11 침수", url: "https://dtinews.dantri.com.vn/vietnam-today/nha-trang-severely-flooded-following-prolonged-heavy-rain-20251118080904874.htm" };
const CAMRANH_LOCAL = "Grab 필요. 근처 Himalaya 60분 47만동(≈2.6만원)";

export const RESORTS: ResortRow[] = [
  {
    name: "JW Marriott Cam Ranh (현재 예약)",
    marriott: true,
    room: {
      t: "$210~245 ≈ 29~34만원",
      src: [
        { label: "Tripadvisor", url: TA_JW },
        { label: "Trip.com", url: "https://us.trip.com/hotels/cam-lam-hotel-detail-131642737/jw-marriott-cam-ranh-bay-resort-spa/" },
      ],
    },
    dining: {
      t: "Crab House 1인 AUD 50~80(≈4.5~7만원), 메뉴가 외 세금·봉사료 23%. 점심은 양식만",
      src: [
        { label: "Traveloka", url: "https://www.traveloka.com/en-au/hotel/vietnam/jw-marriott-cam-ranh-bay-resort--spa-9000007545971" },
        { label: "Marriott 다이닝", url: "https://www.marriott.com/en-us/hotels/cxrjw-jw-cam-ranh-vietnam/dining/" },
      ],
    },
    spa: {
      t: "Spa by JW (2025.12 오픈, 09~21시) — 가격 미공개",
      src: [{ label: "Hospibuz", url: "https://hospibuz.com/hotel/Hotel-listicles/jw-marriott-cam-ranh-bay-resort-spa-unveils-spa-by-jw-in-vietnams-new-wellness-sanctuary-10894921" }],
    },
    massage: { t: CAMRANH_LOCAL },
    rain: { t: "리조트 단지 고립 → 비 오면 리조트 가격으로 갇힘" },
  },
  {
    name: "Westin Cam Ranh",
    marriott: true,
    room: {
      t: "$99~141 ≈ 14~20만원",
      src: [{ label: "Tripadvisor", url: TA_WESTIN }],
    },
    dining: {
      t: "저녁 뷔페 1인 60만동+(≈3.3만원~), 연어 요리 75만동(≈4.1만원). 저녁 평 별로, 조식 호평",
      src: [
        { label: "Planet of Hotels", url: "https://en.planetofhotels.com/vietnam/cam-ranh/westin-resort-spa-cam-ranh" },
        { label: "Trip.com 후기", url: "https://us.trip.com/hotels/cam-lam-hotel-detail-94218761/the-westin-resort-spa-cam-ranh/review.html" },
      ],
    },
    spa: {
      t: "Heavenly Spa (09~22시) — 가격 미공개. 1박당 60분 스파 무료 패키지(Wellness Getaway) 있었음, 현재 여부 확인",
      src: [
        { label: "Club Marriott 오퍼", url: "https://www.myclubmarriott.com/hotel/offerdetail/en/special-offer-wellness-getaway" },
        { label: "Chudu24", url: "https://khachsan.chudu24.com/ks.15589.the-westin-resort-spa-cam-ranh.html" },
      ],
    },
    massage: { t: CAMRANH_LOCAL },
    rain: { t: "JW와 같은 고립, 단 가격 절반" },
  },
  {
    name: "Sheraton Nha Trang (시내)",
    marriott: true,
    room: {
      t: "$90~130 ≈ 13~18만원 (디럭스 오션뷰 약 $128)",
      src: [
        { label: "Vietnam Beach Holiday", url: "https://www.vietnambeachholiday.com/resorts/Nha_Trang_resorts/Sheraton_Nha_Trang_Hotel_Spa.htm" },
        { label: "Hotels Combined", url: "https://www.hotelscombined.com/Hotel/Sheraton_Nha_Trang.htm" },
      ],
    },
    dining: {
      t: "Feast 해산물 뷔페 79~89만동(≈4.3~4.9만원), 랍스터·주류 포함 최대 203만동(≈11만원). 회원 2인 1인 결제 프로모션. 걸어서 시내 해산물집(1인 ~10만동)",
      src: [
        { label: "InterContinental 가이드", url: "https://nhatrang.intercontinental.com/travel-guide/luxury-buffet-in-nha-trang/" },
        { label: "Club Marriott 오퍼", url: "https://www.myclubmarriott.com/hotel/offerdetail/en/buy-1-get-1-on-seafood-buffet_1464031099" },
      ],
    },
    spa: {
      t: "Shine Spa 60분 약 $50 (2017년 해피아워가, 오래됨). Bonvoy 10% 할인",
      src: [
        { label: "Tripadvisor 호텔 답변", url: "https://www.tripadvisor.com/Hotel_Feature-g293928-d1534400-zft9169-Sheraton_Nha_Trang_Hotel_Spa.html" },
        { label: "Tripadvisor Shine Spa", url: "https://www.tripadvisor.com/Attraction_Review-g293928-d9718203-Reviews-Shine_Spa_for_Sheraton-Nha_Trang_Khanh_Hoa_Province.html" },
      ],
    },
    massage: { t: "시내라 걸어서 로컬 마사지숍" },
    rain: { t: "실내·주변 선택지 많음. 단 2025년 11월 시내 큰 침수. 공항 약 45분", src: [FLOOD_2025] },
  },
  {
    name: "Mövenpick Cam Ranh",
    marriott: false,
    room: { t: "$150~500 (Alma 블로그, 홍보성)", src: [{ label: "Alma 블로그", url: "https://www.alma-resort.com/5-stars-resorts-in-cam-ranh/" }] },
    dining: { t: "Panorama 저녁 뷔페 89만동(≈4.9만원)", src: [{ label: "공식", url: "https://movenpickresortcamranh.com/product/panorama-buffet-dinner/" }] },
    spa: { t: "60분 135만동(≈7.4만원), 할인 시 94.5만동", src: [{ label: "스파 메뉴 PDF", url: "https://movenpickresortcamranh.com/wp-content/uploads/2024/01/SPA-MAIN-MENU-EXPORT-EN.pdf" }] },
    massage: { t: CAMRANH_LOCAL },
    rain: { t: "Platinum 혜택 없음" },
  },
  {
    name: "Alma Cam Ranh",
    marriott: false,
    room: { t: "$132~158 (Tripadvisor 비교, 날짜 불명)", src: [{ label: "Alma 블로그", url: "https://www.alma-resort.com/5-stars-resorts-in-cam-ranh/" }] },
    dining: { t: "가격 못 찾음" },
    spa: { t: "Le Spa 60분 150~180만동(≈8~10만원)", src: [{ label: "Trip.com 가이드", url: "https://sg.trip.com/moments/theme/poi-alma-resort-cam-ranh-80014354-guides-993135/" }] },
    massage: { t: CAMRANH_LOCAL },
    rain: { t: "Platinum 혜택 없음" },
  },
  {
    name: "Fusion Cam Ranh (스파 포함)",
    marriott: false,
    room: {
      t: "$156~283 ≈ 22~40만원 — 매일 50분 스파 1회 + 조식 포함",
      src: [
        { label: "Booking.com", url: "https://www.booking.com/hotel/vn/fusion-resort-nha-trang.html" },
        { label: "SpaDreams", url: "https://www.spadreams.com/hotel/fusion-resort-cam-ranh-cam-ranh-south-central-vietnam-85G/" },
      ],
    },
    dining: { t: "가격 못 찾음" },
    spa: { t: "1박당 1회 포함 (48시간 전 예약)", src: [{ label: "Booking.com", url: "https://www.booking.com/hotel/vn/fusion-resort-nha-trang.html" }] },
    massage: { t: CAMRANH_LOCAL },
    rain: { t: "비 오는 날 스파 위주면 가성비 계산 달라짐. Platinum 혜택 없음" },
  },
];
