// Day1~2(도착 밤) 숙소 후보. 검색 스냅샷(1 USD ≈ 1,400원) — 예약 전 재확인.
export interface AirportHotel {
  name: string;
  area: string;
  priceManwon: number | null;
  priceNote: string;
  airportKm: number | null;
  airportMin: number | null;
  cityKm: number | null;
  cityMin: number | null;
  cityFareManDong: number | null;
  rating: number | null;
  ratingSource: string;
  safety: string;
  note: string;
  lateCheckin: string;
}

export const AIRPORT_HOTELS: AirportHotel[] = [
  {
    "name": "Navy Hotel Cam Ranh (1순위)",
    "area": "깜라인 시내",
    "priceManwon": 3.2,
    "priceNote": "$20~25 + 세금 약 $6 (조식 포함 디럭스 트윈 예시)",
    "airportKm": 2.45,
    "airportMin": 5,
    "cityKm": 48.0,
    "cityMin": 60.0,
    "cityFareManDong": 30.0,
    "rating": 8.0,
    "ratingSource": "Booking 8.0(142) / Trip.com 8.1(389) / Google 4.4(3,000+)",
    "safety": "깜라인 시내(국도1호선 변) 현지 소도시. 관광객 적음. 지역별 치안 통계 없음, 소매치기·바가지 일반 주의",
    "note": "후기 '밤에 도착해서 자기만 했는데 좋았음'. 공항 이동은 호텔 픽업보다 택시가 절반 가격이라는 후기. 수영장 있음. 공항 거리는 Trip.com 2.45km 기준(구글은 7.4km). 조식 포함(06:30~09:00), 식당 Đại Dương 가격 미확인, 마사지·스파 없음",
    "lateCheckin": "체크인 14:00~06:00, 프런트 24시간, 공항 픽업(유료) — Trip.com"
  },
  {
    "name": "Magnolia Hotel Cam Ranh",
    "area": "깜라인 시내",
    "priceManwon": 2.7,
    "priceNote": "평균 약 CAD 26",
    "airportKm": 6.5,
    "airportMin": 10.0,
    "cityKm": 48.0,
    "cityMin": 60.0,
    "cityFareManDong": 30.0,
    "rating": 7.9,
    "ratingSource": "Trip.com 7.9(10) — 리뷰 적음",
    "safety": "깜라인 시내(국도1호선 변) 현지 소도시. 관광객 적음. 지역별 치안 통계 없음, 소매치기·바가지 일반 주의",
    "note": "리뷰 수 적어 신뢰도 낮음",
    "lateCheckin": ""
  },
  {
    "name": "Cam Ranh Beach Resort - 5 Mins to Airport",
    "area": "공항 인근",
    "priceManwon": null,
    "priceNote": "가격 미확인",
    "airportKm": null,
    "airportMin": 5,
    "cityKm": 30,
    "cityMin": 40,
    "cityFareManDong": 25,
    "rating": 8.3,
    "ratingSource": "Trip.com 8.3",
    "safety": "공항 인근 해변 지역. 지역별 치안 통계 없음, 밤 이동은 Grab 권장",
    "note": "⚠ 체크인 당일 21:30 이후 도착 시 다른 주소에서 체크인해야 한다고 명시 — 00:10 도착이라 예약 전 반드시 확인",
    "lateCheckin": "체크인 14:00~다음 날 03:00, 프런트 24시간 — 단 21:30 이후는 다른 주소에서 체크인"
  },
  {
    "name": "Trieu Khang Hotel",
    "area": "깜라인 시내 (74 Hung Vuong)",
    "priceManwon": null,
    "priceNote": "가격 미확인",
    "airportKm": 5.6,
    "airportMin": 12.0,
    "cityKm": 50.0,
    "cityMin": 65.0,
    "cityFareManDong": 30.0,
    "rating": 7.0,
    "ratingSource": "Kayak 7.0(140) / Travelfish 7.6(334) / Trip.com 8.1(65)",
    "safety": "깜라인 시내(국도1호선 변) 현지 소도시. 관광객 적음. 지역별 치안 통계 없음, 소매치기·바가지 일반 주의. Travelfish: 국도1호선 변 다소 고립된 위치",
    "note": "Travelfish: 객실 청결 아쉬움, 영어 거의 안 통함. 유료 공항 셔틀",
    "lateCheckin": ""
  },
  {
    "name": "The Grand Arena Cam Ranh Hotel & Resort",
    "area": "바이자이",
    "priceManwon": 9.7,
    "priceNote": "평균 약 $69~70",
    "airportKm": 8.3,
    "airportMin": 12.0,
    "cityKm": 28.0,
    "cityMin": 40.0,
    "cityFareManDong": 25.0,
    "rating": null,
    "ratingSource": "평점 미확인 (Trip.com 5성 표기)",
    "safety": "바이자이(Bai Dai) 리조트 밀집 해변. 조용하고 관광객 위주, 밤엔 상점·식당 적음. 지역 강력범죄 보고 못 찾음. 밤 이동은 Grab 권장",
    "note": "콘도형 객실 매물 섞여 있음 — 예약 시 공식 호텔 객실인지 확인",
    "lateCheckin": ""
  },
  {
    "name": "Duyen Ha Resort Cam Ranh",
    "area": "바이자이",
    "priceManwon": 8.8,
    "priceNote": "$63~108 (날짜별 편차 큼)",
    "airportKm": 6.9,
    "airportMin": 9.0,
    "cityKm": 28.0,
    "cityMin": 40.0,
    "cityFareManDong": 25.0,
    "rating": 8.4,
    "ratingSource": "Booking 8.4 / Tripadvisor 4.6/5(571)",
    "safety": "바이자이(Bai Dai) 리조트 밀집 해변. 조용하고 관광객 위주, 밤엔 상점·식당 적음. 지역 강력범죄 보고 못 찾음. 밤 이동은 Grab 권장",
    "note": "공항 거리 출처별 5~7km",
    "lateCheckin": ""
  },
  {
    "name": "Mövenpick Resort Cam Ranh",
    "area": "바이자이",
    "priceManwon": 13.9,
    "priceNote": "약 $99~130",
    "airportKm": 10.0,
    "airportMin": 12.0,
    "cityKm": 27.0,
    "cityMin": 40.0,
    "cityFareManDong": 25.0,
    "rating": 9.0,
    "ratingSource": "여행 가이드 4.5/5 (출처 1곳)",
    "safety": "바이자이(Bai Dai) 리조트 밀집 해변. 조용하고 관광객 위주, 밤엔 상점·식당 적음. 지역 강력범죄 보고 못 찾음. 밤 이동은 Grab 권장",
    "note": "공항 시간은 '깜라인 지역 5~15분' 일반값으로 추정",
    "lateCheckin": ""
  },
  {
    "name": "Selectum Noa Resort Cam Ranh",
    "area": "바이자이",
    "priceManwon": 15.4,
    "priceNote": "약 $110 올인클루시브 (1인 기준일 수 있음)",
    "airportKm": 10.0,
    "airportMin": 12.0,
    "cityKm": 27.0,
    "cityMin": 40.0,
    "cityFareManDong": 25.0,
    "rating": 9.2,
    "ratingSource": "Trip.com 4.6/5 (가이드 인용)",
    "safety": "바이자이(Bai Dai) 리조트 밀집 해변. 조용하고 관광객 위주, 밤엔 상점·식당 적음. 지역 강력범죄 보고 못 찾음. 밤 이동은 Grab 권장",
    "note": "올인클루시브라 늦은 도착 1박엔 비효율",
    "lateCheckin": ""
  },
  {
    "name": "Radisson Blu Resort Cam Ranh",
    "area": "바이자이",
    "priceManwon": 17.6,
    "priceNote": "$126~134 (표준룸, 사이트별 편차 큼)",
    "airportKm": 6.0,
    "airportMin": 12.0,
    "cityKm": 27.0,
    "cityMin": 40.0,
    "cityFareManDong": 25.0,
    "rating": 8.0,
    "ratingSource": "Tripadvisor 4.0/5(1,072)",
    "safety": "바이자이(Bai Dai) 리조트 밀집 해변. 조용하고 관광객 위주, 밤엔 상점·식당 적음. 지역 강력범죄 보고 못 찾음. 밤 이동은 Grab 권장",
    "note": "20만원 상한에 가까움",
    "lateCheckin": ""
  }
];
