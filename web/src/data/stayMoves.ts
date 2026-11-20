import type { Item } from "../types";

// 일정표(itinerary.json)에 없는 이동·체크인/아웃·ATM. 날짜 대신 Day 번호 — deploy.sh 마스킹은 itinerary.json만 처리하므로 여기 날짜 쓰면 안 됨.
// 시각은 현지 기준. 요금은 Grab 4인승 추정(1만동 ≈ 550원).
export const STAY_MOVES: (Item & { day: number })[] = [
  // Day1 = 출발~숙소 입실까지 한 밤. 인천 쪽은 KST, 도착 후는 현지(KST-2h)이고 자정 넘으면 24:xx로 적어 정렬 유지 (화면엔 "+1")
  { day: 1, start: "17:30", end: "18:30", title: "[KST] 인천공항 T1 도착 (출발 3시간 전) · 파라타항공 체크인 — 기내 휴대만(위탁 수하물 없음), 온라인 체크인·모바일 탑승권 가능한지 확인 필요, 기내 반입 규정(무게·액체) 확인", kind: "이동", place: "인천공항 T1", cost_krw: 0 },
  { day: 1, start: "18:30", end: "19:00", title: "[KST] 보안검색·출국심사 (자동출입국 심사)", kind: "이동", place: "인천공항 T1", cost_krw: 0 },
  { day: 1, start: "19:00", end: "19:55", title: "[KST] 저녁·면세 — 기내식 포함 여부 확인 · 출발 전 eSIM 설치 확인", kind: "이동", place: "인천공항 T1", cost_krw: 0 },
  { day: 1, start: "19:55", end: "20:35", title: "[KST] 탑승 (출발 40분 전 게이트, 탑승권에서 게이트 확인) → 20:35 출발, 비행 약 5시간 35분", kind: "이동", place: "인천공항 T1", cost_krw: 0 },
  { day: 1, start: "24:10", end: "24:25", title: "[현지] 깜라인 T2 도착 · 시계 -2시간 · 비행기 모드 끄고 eSIM 데이터 켜기 (Grab 연락용)", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "24:25", end: "24:55", title: "[현지] 입국심사 — 한국 여권 45일 무비자 · 귀국편 e-티켓 보여줄 수 있게. 자정 한국발 편 몰리면 30~60분", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "24:55", end: "25:00", title: "[현지] 기내 휴대만이라 수하물 찾기 없음 · 사전입국신고(prearrival.immigration.gov.vn, 도착 72시간 전부터 등록, QR 발급) QR 보여주기 — 2026-06-22부터 CXR 적용(visasnews.com 보도; VietJet 의무·싱가포르 외교부 강력 권고; 공식 사이트 재확인) · 입국장 ATM은 은행 미확인 — 급하지 않으면 패스 · 입국심사가 30~60분 지연되면 25:00 Grab 만남이 밀림 → 앱 채팅으로 기사에게 알리기", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "25:00", end: "25:05", title: "[현지] 입국장 출구에서 Grab 기사 만나기 (01:00 예약 완료) — 앱에서 차량번호·픽업 지점 확인, 늦어지면 앱 채팅으로 알리기", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
  { day: 1, start: "25:05", end: "25:20", title: "[현지] Grab → Navy Hotel (4~5km, 10~15분, 10~15만동)", kind: "이동", place: "Grab (예약 완료)", cost_krw: 7000 },
  { day: 1, start: "25:20", end: "25:35", title: "[현지] Navy Hotel 체크인 (예약은 Day1 · 06시까지 입실 가능, 프런트 24시간) → 바로 취침", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "09:30", end: "10:45", title: "기상 · Navy 조식 (포함, 운영 시간 체크인 때 프런트 확인) · 짐 정리", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "10:45", end: "11:00", title: "Navy Hotel 체크아웃 (정규 12:00, 조식 포함)", kind: "숙소", place: "Navy Hotel Cam Ranh", cost_krw: 0 },
  { day: 2, start: "11:00", end: "11:30", title: "Navy → Westin (약 8.7km, 10~15분 · 호출·대기 포함 30분 잡음, 10~20만동)", kind: "이동", place: "Grab", cost_krw: 11000 },
  { day: 2, start: "11:30", end: "11:45", title: "Westin 도착 · 짐 맡기고 얼리 체크인 요청 (Platinum 보장 혜택 아님, 공실 시) — 안 돼도 체크인 전에 수영장·Haven Lounge(14~22시) 이용 가능 (Westin에 직접 문의해 확인) · 레이트 체크아웃 16:00 가능 여부, 체크아웃 후 시설 이용·샤워 가능 여부, Haven Lounge 요금(무료/유료)은 확인 필요(Marriott 미표기) · Day3 공항 셔틀 21:20 하나만 예약 가능 (둘 다 예약 불가 — Westin 문의 결과 · 요금·24시간 전 규칙·픽업 장소 직원 확인 — 무료는 Marriott 공식 표기, 24시간 전 필수·안 하면 운행 취소 · 내선 5410) · 21:20 놓치면 바로 Grab이 기본, 21:45편은 자리 있으면 탑승(예약 불가·보장 아님) · 시내 셔틀은 별개(Westin 안내 기준 Day3 평일 11:30/18:15, 승하차 Gold Coast 몰): 요금 확인 필요(무료 여부 미확인), 예약 필요 여부·마감 확인 필요(공항 셔틀처럼 24시간 전이면 Day2 11:30까지 선예약해야 하고 당일 취소 확정 시엔 못 탈 수 있음 → 그때는 Grab 플랜 07:45), 취소 모른 채 미리 예약해도 노쇼 불이익 없는지 프런트 확인, 소요·11월 운행 확인", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 2, start: "12:00", end: "12:35", title: "Westin ↔ 모벤픽 리조트 VPBank ATM 왕복 (1.5km, 편도 ≈5만동 · 왕복 10만동) — 현금 출금 (예산 탭 추천액), 외국 카드 수수료 없음. 비숙박객 출입 가능한지 프런트 확인", kind: "이동", place: "VPBank ATM (Movenpick Cam Ranh)", cost_krw: 5500 },
  { day: 2, start: "15:00", end: "15:10", title: "얼리 체크인 실패 시: 정규 체크인 15:00 — 수영장·Haven Lounge는 체크인 전에도 이용 가능, 수영장 중간에 프런트에서 키 받기", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "06:45", end: "07:25", title: "조식 (The Verandah 06:30~10:30, 투숙객 포함 표기)", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "07:25", end: "07:40", title: "07:40까지 레이트 체크아웃 승인 못 받으면 체크아웃 (정규 12:00인데 Westin 복귀 14:00이라 못 맞춤) · 짐 프런트 보관 (체크아웃 후 시설 이용 가능 여부는 확인 필요 — Day2 체크인 때 문의) · 21:20 공항 셔틀 예약 재확인", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "07:45", end: "08:35", title: "Westin → 나트랑 항구 (≈35km, ≈50분, ≈50만동) — 투어 픽업 포함이면 생략 · Day2 저녁 Grab 사전 예약 · 투어사 집결 시각 확인 (09:00 출항이면 여유 25분)", kind: "이동", place: "Grab", cost_krw: 27500 },
  { day: 3, start: "16:00", end: "16:05", title: "Westin 레이트 체크아웃 (16:00까지 가능, 공실 시·보장 아님) · 짐은 프런트 보관", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "20:30", end: "21:05", title: "프런트에서 짐 찾기 · 공항 가기 전 샤워 — 체크아웃 후 샤워 가능 여부 Marriott 미표기·Westin 답변 없음 — Day2 체크인 때 확인 (확인 필요). 안 되면 데이유즈 룸 (가격 미확인)", kind: "숙소", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "21:10", end: "21:20", title: "공항 셔틀 픽업 장소 대기 (출발 10분 전 필수) — 21:20 놓치면 바로 프런트에 Grab·택시 요청이 기본 (≈7km, 15~30분, ≈15만동) · 21:45편은 자리 있으면 탑승(예약 불가·보장 아님, 공항 22:00~22:15쯤 도착이라 출발 2시간 전 22:30에 15~30분 여유뿐) · 공항 체크인 카운터 오픈 시각 확인 필요", kind: "이동", place: "The Westin Resort & Spa Cam Ranh", cost_krw: 0 },
  { day: 3, start: "21:50", end: "22:10", title: "공항 도착 후 출국 절차 — 기내 휴대만(위탁 수하물 없음)이라 체크인 카운터 대신 온라인 체크인·모바일 탑승권 가능한지 확인 필요(에어서울 깜란 지원 여부 못 찾음) · 기내 반입 규정(무게·액체) 확인", kind: "이동", place: "깜라인 공항 CXR T2", cost_krw: 0 },
];
