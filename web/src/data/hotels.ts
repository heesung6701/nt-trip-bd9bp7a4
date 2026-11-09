import sheratonRoom from "../assets/hotels/sheraton-a.jpg";

export interface HotelInfo {
  name: string;
  tier: "marriott" | "budget" | "flex";
  address: string;
  listingUrl: string;
  galleryUrl?: string;
  // 실제로 확인된 사진만 넣음. 외관·내부 사진은 검증 못해서 비움 — 갤러리 링크로 대체
  roomImage?: string;
  facilities: string[];
  priceNote: string;
  costs?: string[]; // 호텔 내 식사·스파 대략 비용 (1 USD ≈ 1,400원, 1 AUD ≈ 900원)
}

export const HOTELS: HotelInfo[] = [
  {
    name: "Sheraton Nha Trang Hotel & Spa",
    tier: "marriott",
    address: "26-28 Tran Phu St, 해변 바로 앞",
    listingUrl: "https://marriott.com/hotels/travel/nhasi-sheraton-nha-trang-hotel-and-spa/",
    galleryUrl: "https://www.fivestaralliance.com/gallery/sheraton-nha-trang-hotel-and-spa-gallery-images",
    roomImage: sheratonRoom,
    facilities: ["280실", "6층 인피니티풀", "Shine Spa", "레스토랑·바 6곳", "28층 루프탑바", "키즈클럽"],
    priceNote: "가격 미확인 (추정 25~35만원대)",
  },
  {
    name: "Four Points by Sheraton Nha Trang",
    tier: "marriott",
    address: "06 Nguyen Chanh",
    listingUrl: "https://www.marriott.com/en-us/hotels/cxrnp-four-points-nha-trang/rooms/",
    galleryUrl: "https://www.marriott.com/en-us/hotels/cxrnp-four-points-nha-trang/photos",
    facilities: ["225실", "아웃도어풀·키즈풀", "피트니스", "무료 주차"],
    priceNote: "가격 미확인 (추정 $100~150대)",
  },
  {
    name: "Nha Trang Marriott Resort & Spa (Hon Tre)",
    tier: "marriott",
    address: "혼쩨 섬 (Vinpearl 케이블카역 인근)",
    listingUrl: "https://es.hotels.com/ho1029256288/vinpearl-discovery-sealink-nha-trang-nha-trang-vietnam",
    facilities: ["프라이빗 해변 리조트", "케이블카·셔틀 필요"],
    priceNote: "스냅샷 $96~ (변동 큼)",
  },
  {
    name: "JW Marriott Cam Ranh Bay Resort & Spa",
    tier: "flex",
    address: "Lot D4C, Cam Lam (Bai Dai 해변), 공항 약 15~30분",
    listingUrl: "https://www.marriott.com/en-gb/hotels/cxrjw-jw-cam-ranh-vietnam/overview",
    facilities: ["오션뷰 인피니티 메인 풀", "랩 풀", "올데이 다이닝", "주니어 스위트·킹 디럭스 오션뷰", "공항 픽업 가능 (Trip.com 기준)"],
    priceNote: "표시가 304,901원/박 (날짜별 변동), 평점 4.6 (97개 후기)",
    costs: [
      "조식 뷔페: 객실 요금 포함이 보통, 별도면 1인 약 AUD 35(≈3.2만원) · 06:30~10:30",
      "Seafood Grill 저녁: 공식가 없음, 1인 약 5~8만원 추정 (출처 불확실)",
      "Spa by JW 60분 마사지: 공식가 미공개, 지역 리조트 스파 $35~60(≈5~8.5만원) — JW는 상단 이상 예상, 사전 예약 필수",
      "비교: 깜라인 외부 스파(Himalaya) 60분 47만동(≈2.6만원)",
    ],
  },
  {
    name: "The Westin Resort & Spa Cam Ranh",
    tier: "flex",
    address: "Lot D14A, Northern Peninsula, Cam Lam (Bai Dai 해변 600m), 공항 약 15~30분",
    listingUrl: "https://halalbooking.com/en-us/the-westin-resort-spa-cam-ranh/p/506760",
    facilities: ["오션프런트 리조트", "탁 트인 전망"],
    priceNote: "스냅샷 약 $103~134/박 (≈14~19만원 추정), 평점 4.4 (171개 후기)",
  },
  {
    name: "Havana Nha Trang (Premier Havana)",
    tier: "budget",
    address: "38 Tran Phu, 해변 바로 앞",
    listingUrl: "https://id.hotels.com/en/ho642136/premier-havana-hotel-nha-trang-vietnam/",
    facilities: ["~1000실", "식당 4곳", "풀·풀바", "스파", "가라오케"],
    priceNote: "1박 7~8만원대 (스냅샷)",
  },
  {
    name: "Regalia Gold Hotel",
    tier: "budget",
    address: "Nguyen Thi Minh Khai, 야시장 도보 5분",
    listingUrl: "https://au.hotels.com/ho1356342720/regalia-gold-hotel-nha-trang-vietnam",
    facilities: ["661실", "아웃도어풀·키즈풀", "스파", "24시 짐"],
    priceNote: "가격 미확인 (추정 9만원대)",
  },
  {
    name: "December Hotel",
    tier: "budget",
    address: "나트랑 시내",
    listingUrl: "https://sp.booking.com/hotel/vn/december-nha-trang.html",
    facilities: ["신축", "아웃도어풀", "루프탑 테라스", "피트니스"],
    priceNote: "가격 미확인 (추정 6~7만원대), 등급 사이트마다 상이",
  },
];
