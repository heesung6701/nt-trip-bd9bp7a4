// 출처: "죄송이 버섯 맛집" 오픈카톡 정리 리스트 (사용자가 붙여준 내용, 개인 취향·미검증).
// 달랏·빈펄섬 항목은 이번 여행 동선 밖이라 뺌. 거리는 Westin 기준 깜란 외엔 대부분 시내(차 30분+).
export const JJONG_SOURCE = "죄송이 버섯 맛집 (오픈카톡)";

export interface JjongPlace {
  cat: string;
  area: "깜란" | "혼총" | "나트랑 시내";
  name: string;
  note: string;
  tags: string[];
  menu?: { name: string; price: string }[]; // 가격이 적힌 메뉴 (가격은 원문 표기 그대로)
}

export const JJONG_CATS = ["해산물", "베트남 현지식", "껌땀", "쌀국수", "구이요리", "선술집", "한식", "삼겹살", "일식", "중식", "이탈리안", "스테이크", "반미", "뷔페", "디저트", "카페", "기타", "혼총 카페", "혼총", "깜란"] as const;

export const JJONG: JjongPlace[] = [
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "목식당",
    "note": "2층에어컨자리 예약필수, 10시~3시 해피아워 할인,버터갈릭새우,맛조개모닝글로리,조개죽,파기름가리비",
    "tags": [
      "예약"
    ]
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "꽌옥응언",
    "note": "가성비로컬, 양적으니 다양하게 먹기",
    "tags": []
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "Hải sản Thanh Sương2",
    "note": "하이산탄쓰엉2,현지인로컬맛집",
    "tags": []
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "루엉송깡",
    "note": "새우회,에어컨o티멤버쉽10%할인",
    "tags": []
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "더코랄",
    "note": "치즈가리비,키조개",
    "tags": []
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "Quán Ốc Phủi",
    "note": "시내근처 가성비로컬씨푸드",
    "tags": []
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "Bánh Canh Cua Thố Đá T&N",
    "note": "머드크랩ㆍ키로당75만동 알찬게추가금 싱가포르소스없을시 마늘버터",
    "tags": []
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "Nhà Hàng 20",
    "note": "냐항20,로컬씨푸드,새우구이,새우사시미,타이거새우찜,해산물볶음면,버터옥수수",
    "tags": []
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "Hải Sản Bến Cảng",
    "note": "로컬씨푸드, 타이거새우회 존맛탱, 시내와거리가 있으나 저렴",
    "tags": []
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "Nha Trang Fork 포크",
    "note": "보일링씨푸드+꼬치고기맛집,오리지널맛은 약간매콤, 갈릭버터맛으로추천,4인일경우 보일링씨푸드2인분에 꼬치시켜서 먹으면 충분",
    "tags": []
  },
  {
    "cat": "해산물",
    "area": "나트랑 시내",
    "name": "떠이66",
    "note": "나랑고고님 추천 현지인맛집",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "짜오마오1호점",
    "note": "미꽝,반쎄오; 2호점은 해산물위주",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "넴느엉당반꾸엔",
    "note": "로컬 에어컨o; 돼지갈비조림,월남쌈,밥무료; 촌촌킴",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "바토이",
    "note": "가지구이 꼭,스프링롤",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "곡하노이",
    "note": "로컬,분짜",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "분짜하노이",
    "note": "분노남보,분짜,짜조,비빔",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "Cơm Nhà 79",
    "note": "백반집3만5천동",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "Bò né Mỹ Cảnh",
    "note": "보네미깐, 오므라이스 추천, 로컬치고 가격이 있으나 청결함",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "Nem nướng Phú Phương",
    "note": "로컬 넴느엉, 시킬때 35,000동짜리로",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "메오키친 시내점",
    "note": "반쎄오",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "옌 반깐 반세오",
    "note": "써니언니추천, 메추리알반깐,소고기반깐,소스에 고추양념넣어서 먹으면 더맛남,간단하게먹기좋음",
    "tags": []
  },
  {
    "cat": "베트남 현지식",
    "area": "나트랑 시내",
    "name": "Ngõ Hẻm CN1,CN2,CN3",
    "note": "1,2,3호점까지 있음 가까운곳 가면됨, 분더우맘똠",
    "tags": []
  },
  {
    "cat": "껌땀",
    "area": "나트랑 시내",
    "name": "Cơm tấm Trịnh Phong",
    "note": "",
    "tags": []
  },
  {
    "cat": "껌땀",
    "area": "나트랑 시내",
    "name": "쫑 동 껌땀 Cơm Tấm Trống Đồng",
    "note": "",
    "tags": []
  },
  {
    "cat": "껌땀",
    "area": "나트랑 시내",
    "name": "CƠM TẤM 👌 NGON",
    "note": "",
    "tags": []
  },
  {
    "cat": "껌땀",
    "area": "나트랑 시내",
    "name": "Cơm tấm 82 Trịnh Phong",
    "note": "숯불향돼지고기에 같이주는 국물도 시원",
    "tags": []
  },
  {
    "cat": "껌땀",
    "area": "나트랑 시내",
    "name": "Cơm Tấm Sài Gòn Đô Thành",
    "note": "꽁안님 외 다수의 추천",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "포한푹 뚝배기쌀국수",
    "note": "샤브식",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "포수아 Phở Xưa Hà Nội 1975",
    "note": "강추",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "포푹롱",
    "note": "",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "Bún Quậy A Ken",
    "note": "분꿔이어켄, 오징어쌀국수,3번소고기+오징어,금귤차추천",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "후띠에묵",
    "note": "해산물쌀국수",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "안어이",
    "note": "왕갈비탕식쌀국수",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "포틴",
    "note": "곱창쌀국수",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "라냐",
    "note": "곱창쌀국수, 모자르면 연두부튀김",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "Quán phở Bắc",
    "note": "밤11~새벽5,쌩로컬,흐린눈하면맛있는집,인당5만동",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "Hủ Tiếu Mực 79 Nguyễn Gia",
    "note": "후띠우맛집, 짜먹=오징어오뎅 맛있음, 자극적이지않고 슴슴한맛이라 어른들좋아함, 2층에어컨자리 있음, 입구에 사탕수수 후식도 추천",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "Bún Bò Hương Giang",
    "note": "분보후에 맛집",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "나트랑 게국수 Mì quảng-Bún riêu",
    "note": "옥수수면,아침일찍열고 저렴,해장시 강추",
    "tags": []
  },
  {
    "cat": "쌀국수",
    "area": "나트랑 시내",
    "name": "Bánh Canh Cua Thố Đá T&N - 27 Vân Đồn",
    "note": "크랩케이크누들수프, 양많음",
    "tags": []
  },
  {
    "cat": "구이요리",
    "area": "나트랑 시내",
    "name": "Xiên nướng Lão Quý",
    "note": "수수픽 꼬치집, 막창꼬치가 맛있다고함",
    "tags": []
  },
  {
    "cat": "구이요리",
    "area": "나트랑 시내",
    "name": "Cá Nướng Pe Pa",
    "note": "로컬생선구이집,병어구이,굴치즈구이,닭발,오징어소금구이ㆍ마요네즈요청하기,닭날개",
    "tags": []
  },
  {
    "cat": "선술집",
    "area": "나트랑 시내",
    "name": "Nhà Hàng Bông Crazy",
    "note": "로컬야장, 맥주9천동, 저렴, 안주는 먹을만함",
    "tags": []
  },
  {
    "cat": "선술집",
    "area": "나트랑 시내",
    "name": "콴언x.o",
    "note": "로컬 케그생맥주,순두부튀김,새우구이,꼬치,굴,떡갈비,옥수수튀김",
    "tags": []
  },
  {
    "cat": "선술집",
    "area": "나트랑 시내",
    "name": "Quán Hẻm Ốc Vân Đồn",
    "note": "햄옥,해산물요리류, 로컬인데소주팜,성게,달팽이,새우회,매운조개탕,숯불해산물구이,맛조개모닝글로리, 버터갈릭가리비,특히 굴 바다포도 강추8천원",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "나트랑 한식당369",
    "note": "제육볶음,계란찜",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "주막골",
    "note": "",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "훈민정음",
    "note": "",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "고대감",
    "note": "감자탕",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "밥도둑",
    "note": "게장",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "길이네",
    "note": "백순대,돼지찌개,오징어튀김",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "장터국밥",
    "note": "",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "족발신선생",
    "note": "",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "K-가마솥치킨",
    "note": "",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "만나식당",
    "note": "",
    "tags": []
  },
  {
    "cat": "한식",
    "area": "나트랑 시내",
    "name": "불돈 BULDON BBQ",
    "note": "구 전주옥, 빈맥병원근처로 이전, 염소탕,한치물회,애들은돈까스",
    "tags": []
  },
  {
    "cat": "삼겹살",
    "area": "나트랑 시내",
    "name": "베테랑",
    "note": "",
    "tags": []
  },
  {
    "cat": "삼겹살",
    "area": "나트랑 시내",
    "name": "금돼지식당",
    "note": "숙성고기",
    "tags": []
  },
  {
    "cat": "삼겹살",
    "area": "나트랑 시내",
    "name": "나트랑왕뚜껑",
    "note": "김찌마싯슴",
    "tags": []
  },
  {
    "cat": "삼겹살",
    "area": "나트랑 시내",
    "name": "목구멍",
    "note": "미나리삼겹살,얼음생맥주",
    "tags": []
  },
  {
    "cat": "삼겹살",
    "area": "나트랑 시내",
    "name": "조까삼",
    "note": "삼겹살은 평타, 항정살 추천! 명이님추천집",
    "tags": []
  },
  {
    "cat": "일식",
    "area": "나트랑 시내",
    "name": "미타미",
    "note": "우니, 연어, 우설 별미",
    "tags": []
  },
  {
    "cat": "일식",
    "area": "나트랑 시내",
    "name": "YA! Japanese Dining",
    "note": "혼밥하기좋은 돈카츠우동",
    "tags": []
  },
  {
    "cat": "일식",
    "area": "나트랑 시내",
    "name": "키와미 초밥",
    "note": "",
    "tags": []
  },
  {
    "cat": "일식",
    "area": "나트랑 시내",
    "name": "Nhà Hàng Nhật Bản IZAKAYA KIWAMI",
    "note": "초밥이나 사시미도 맛있지만 꼬치도 맛있음",
    "tags": []
  },
  {
    "cat": "중식",
    "area": "나트랑 시내",
    "name": "도야짬뽕",
    "note": "",
    "tags": []
  },
  {
    "cat": "중식",
    "area": "나트랑 시내",
    "name": "미보초론",
    "note": "아침일찍 오픈함,얼큰우육면,쇼마이,홍콩라면4번,새우딤섬",
    "tags": []
  },
  {
    "cat": "중식",
    "area": "나트랑 시내",
    "name": "Haidilao Nha Trang",
    "note": "하이디라오, 잘로앱으로 바다뷰자리 예약가능",
    "tags": [
      "예약"
    ]
  },
  {
    "cat": "중식",
    "area": "나트랑 시내",
    "name": "코리아킹짬뽕",
    "note": "",
    "tags": []
  },
  {
    "cat": "이탈리안",
    "area": "나트랑 시내",
    "name": "피자포피스",
    "note": "부라타피자,파스타",
    "tags": []
  },
  {
    "cat": "이탈리안",
    "area": "나트랑 시내",
    "name": "la cala",
    "note": "",
    "tags": []
  },
  {
    "cat": "이탈리안",
    "area": "나트랑 시내",
    "name": "Heaven Pizza",
    "note": "",
    "tags": []
  },
  {
    "cat": "이탈리안",
    "area": "나트랑 시내",
    "name": "Tacos Amigos",
    "note": "French Tacos - Tacos Pháp; 화덕피자",
    "tags": []
  },
  {
    "cat": "이탈리안",
    "area": "나트랑 시내",
    "name": "Fish House Nha Trang - Italian Restaurant",
    "note": "",
    "tags": []
  },
  {
    "cat": "스테이크",
    "area": "나트랑 시내",
    "name": "MaXi's 1 Steak & Pizza",
    "note": "스테이크,피자,까르보나라,생맥주 다 맛있는집",
    "tags": []
  },
  {
    "cat": "스테이크",
    "area": "나트랑 시내",
    "name": "An Lam Bistro",
    "note": "가성비좋음, 까르보나라, 베이컨아스파라거스볶음도 추천",
    "tags": []
  },
  {
    "cat": "스테이크",
    "area": "나트랑 시내",
    "name": "Grill House",
    "note": "그릴하우스, 스테이크도 괜찮고 4인가족이라면 바베큐세트도 괜찮음",
    "tags": []
  },
  {
    "cat": "스테이크",
    "area": "나트랑 시내",
    "name": "El Coyote",
    "note": "이엘코요테,멕시코요리집인데 타코는 비추,라자냐랑 숙성스테이크추천,돌판에 나오기에 음식나오면 잠시 덜어놨다가 취향껏익혀먹기,스테이크주문시 기본샐러드제공",
    "tags": []
  },
  {
    "cat": "스테이크",
    "area": "나트랑 시내",
    "name": "Kintan Dining & Bar",
    "note": "와규집",
    "tags": []
  },
  {
    "cat": "반미",
    "area": "나트랑 시내",
    "name": "앙반미",
    "note": "",
    "tags": []
  },
  {
    "cat": "반미",
    "area": "나트랑 시내",
    "name": "엄마손반미",
    "note": "포장후 에그커피가서 먹기",
    "tags": []
  },
  {
    "cat": "반미",
    "area": "나트랑 시내",
    "name": "마이베이커리반미베트남",
    "note": "로컬반미집",
    "tags": []
  },
  {
    "cat": "반미",
    "area": "나트랑 시내",
    "name": "반미비엣",
    "note": "",
    "tags": []
  },
  {
    "cat": "반미",
    "area": "나트랑 시내",
    "name": "응안후옹",
    "note": "구글에 로컬반미로 검색",
    "tags": []
  },
  {
    "cat": "뷔페",
    "area": "나트랑 시내",
    "name": "쿠우쿠우 나트랑점",
    "note": "",
    "tags": []
  },
  {
    "cat": "뷔페",
    "area": "나트랑 시내",
    "name": "Buffet Poseidon Gold Coast Nha Trang",
    "note": "",
    "tags": []
  },
  {
    "cat": "뷔페",
    "area": "나트랑 시내",
    "name": "I Like Buffet - 1210",
    "note": "로컬뷔페, 해산물&고기&맥주 무제한, 시내랑은 거리가 좀 있고 청결도는 다른뷔페보다 떨어짐 저렴히 먹고싶을때",
    "tags": []
  },
  {
    "cat": "디저트",
    "area": "나트랑 시내",
    "name": "에그커피",
    "note": "솔트커피 강추",
    "tags": []
  },
  {
    "cat": "디저트",
    "area": "나트랑 시내",
    "name": "척칩",
    "note": "김청김빈 환전하러간김에 가보기 PM2:30오픈",
    "tags": []
  },
  {
    "cat": "디저트",
    "area": "나트랑 시내",
    "name": "바나나튀김집 Chuối Chiên Mè Den Hoàng Nam",
    "note": "",
    "tags": []
  },
  {
    "cat": "디저트",
    "area": "나트랑 시내",
    "name": "미미프루츠",
    "note": "",
    "tags": []
  },
  {
    "cat": "디저트",
    "area": "나트랑 시내",
    "name": "Chè Thái WanWan",
    "note": "째",
    "tags": []
  },
  {
    "cat": "디저트",
    "area": "나트랑 시내",
    "name": "더빙빙",
    "note": "애플망고빙수",
    "tags": []
  },
  {
    "cat": "디저트",
    "area": "나트랑 시내",
    "name": "CHUỐI NƯỚNG",
    "note": "츄이느엉,바나나구이",
    "tags": []
  },
  {
    "cat": "디저트",
    "area": "나트랑 시내",
    "name": "반짠느엉",
    "note": "",
    "tags": []
  },
  {
    "cat": "디저트",
    "area": "나트랑 시내",
    "name": "반짱쫀 노점 Bánh Tráng Trộn Bảo Ngọc",
    "note": "맵기조절가능, 바로먹어야맛있음",
    "tags": []
  },
  {
    "cat": "카페",
    "area": "나트랑 시내",
    "name": "Cà phê Đi",
    "note": "24시간영업 해먹카페, 커피 2만동짜리 시키고 해먹에서 자도 됨, 체크인하기전에 들러보면 좋을듯, 특히 초코빙수추천, 진짜 초코우유로 빙수를 함4만5천동",
    "tags": [
      "24시간"
    ]
  },
  {
    "cat": "카페",
    "area": "나트랑 시내",
    "name": "Dala story cafe 달라",
    "note": "달랏느낌",
    "tags": []
  },
  {
    "cat": "카페",
    "area": "나트랑 시내",
    "name": "Phe La 패라",
    "note": "해변가오션뷰",
    "tags": []
  },
  {
    "cat": "카페",
    "area": "나트랑 시내",
    "name": "Than-The Greenery탄",
    "note": "3호점까지잇음,컨셉다름",
    "tags": []
  },
  {
    "cat": "카페",
    "area": "나트랑 시내",
    "name": "Red Gate Bakery Cafe",
    "note": "베이글맛집,오후에없을수도",
    "tags": []
  },
  {
    "cat": "카페",
    "area": "나트랑 시내",
    "name": "Ca phe Dang당",
    "note": "작고컴퓨터작업하기좋음",
    "tags": []
  },
  {
    "cat": "카페",
    "area": "나트랑 시내",
    "name": "Cafe Grizzly Coffee&Bakery 그리즐리베이커리",
    "note": "베이커리카페",
    "tags": []
  },
  {
    "cat": "카페",
    "area": "나트랑 시내",
    "name": "Nha He Coffee Shop",
    "note": "코코넛커피,망고스무디",
    "tags": []
  },
  {
    "cat": "카페",
    "area": "나트랑 시내",
    "name": "Capybara Coffee & Tea",
    "note": "카피바라카페",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "코스타시푸드",
    "note": "브런치",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "그릭 키친,그릭수블라키",
    "note": "그리스식,치킨랩강추",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "Armenia Nha Trang",
    "note": "하차푸리,케밥,솔랸카",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "IVEGAN SUPERSHOP NHA TRANG - HEALTHY PLANT-BASED CAFE",
    "note": "비건식당, 발리분위기, 스무디볼, 베이글",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "알파카 홈스타일 카페",
    "note": "코티지치즈펜케이크,시르키니,버섯수프,아보카도샐러드",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "Lẩu bò Bà Triệu Nha Trang",
    "note": "소고기전골 현지인맛집",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "YASHODA INDIAN RESTAURANT",
    "note": "인도레스토랑",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "Ресторан «Гранат»",
    "note": "러시아음식이 궁금하다면",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "Haus Bremen",
    "note": "독일음식점, 슈바인학센",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "La Ombra - Mediterranean Café & Dining",
    "note": "지중해식 음식점",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "Cafe Culture brunch club nha trang",
    "note": "브런치카페",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "Burger People",
    "note": "수제버거 맛집",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "Cilantro Restaurant 2",
    "note": "해산물,양식,현지식 등 다 파는 레스토랑인데 대부분 음식들이 쏘쏘하게 먹을만하고 맥주가 만동, 거의 러시아인들이 많음, 왁!맛있는집은 아니지만 저렴히 이국적인분위기에서 맥주마시기에좋음",
    "tags": []
  },
  {
    "cat": "기타",
    "area": "나트랑 시내",
    "name": "Burger Wang",
    "note": "짜다는 평이 많긴하지만 여간한 수제버거보다 맛있다고함,맥주랑 찰떡궁합",
    "tags": []
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "FourSea - Coastal Dining & Coffee",
    "note": "바다 바로 앞 오션뷰, 식사+커피를 함께 즐기기 좋은곳",
    "tags": []
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "Bakeboy",
    "note": "베이커리맛집, 커피+디저트 유명한 카페",
    "tags": []
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "Sunday",
    "note": "한적한 바다전망, 음료사진 찍기 좋은 감성카페",
    "tags": []
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "Tuu Coffee",
    "note": "뚜루커피, 숲속같은 분위기, 24시간운영",
    "tags": [
      "24시간"
    ]
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "Tropical Zone",
    "note": "야자수와 바다를 함께 볼 수 있는 휴양지감성, 브런치도 가능",
    "tags": []
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "Góc Phố Goi Nắng",
    "note": "아기자기한 골목감성,창가 오션뷰좌석 추천",
    "tags": []
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "Cae Hòn Chổng View",
    "note": "혼총 대표 오션뷰카페, 바다전망이 가장 유명한곳중하나",
    "tags": []
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "View Biển Cafe",
    "note": "넓은 야외좌석, 여유롭게 쉬기좋은 분위기",
    "tags": []
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "Moonlight Chill",
    "note": "밤 분위기가 특히 예쁜 카페, 라이브공연이 있는날도 있음",
    "tags": []
  },
  {
    "cat": "혼총 카페",
    "area": "혼총",
    "name": "Hòn Chổng Coffee",
    "note": "현지인들이 많이찾는 카페, 넓은 야외공간과 저녁분위기가 좋음",
    "tags": []
  },
  {
    "cat": "혼총",
    "area": "혼총",
    "name": "TTP BAKERY",
    "note": "나랑고고님픽, 에그타르트, 코코넛떡",
    "tags": []
  },
  {
    "cat": "혼총",
    "area": "혼총",
    "name": "Seikō-Sushi 成功 Nha Trang",
    "note": "나랑고고픽 스시집",
    "tags": []
  },
  {
    "cat": "혼총",
    "area": "혼총",
    "name": "190 Homestyle bistro",
    "note": "나랑고고픽 버거집",
    "tags": []
  },
  {
    "cat": "혼총",
    "area": "혼총",
    "name": "Шашлыкофф стейк гриль бар",
    "note": "나랑고고픽 샤슬릭ㆍ러시아전통꼬치구이",
    "tags": []
  },
  {
    "cat": "혼총",
    "area": "혼총",
    "name": "FISH - CHIPS NHA TRANG",
    "note": "나랑고고픽 피쉬앤칩스",
    "tags": []
  },
  {
    "cat": "혼총",
    "area": "혼총",
    "name": "Aroy NhaTrang",
    "note": "가성비태국음식점",
    "tags": []
  },
  {
    "cat": "혼총",
    "area": "혼총",
    "name": "Anrizon Steakhouse Nha Trang",
    "note": "혼총곶 스테이크 양식 가성비맛집",
    "tags": []
  },
  {
    "cat": "혼총",
    "area": "혼총",
    "name": "Phố Chiều - Nha Trang",
    "note": "혼총쪽 로컬식당&술집, 나름 클럽같은곳",
    "tags": []
  },
  {
    "cat": "깜란",
    "area": "깜란",
    "name": "할머니반쎄오 Bánh xèo CÔ TUYẾT",
    "note": "반쎄오 단일메뉴라서 생망고쥬스 시켜서 같이 먹는거 추천",
    "tags": []
  },
  {
    "cat": "깜란",
    "area": "깜란",
    "name": "타오티엔 Hải Sản Thảo Tiến- Thao tien seafood restaurant",
    "note": "해산물집",
    "tags": []
  },
  {
    "cat": "깜란",
    "area": "깜란",
    "name": "엠어이 깜란 Nhà Hàng Hải Sản Em Ơi",
    "note": "베트남현지식",
    "tags": []
  },
  {
    "cat": "깜란",
    "area": "깜란",
    "name": "NHÀ HÀNG HẢI SẢN K10",
    "note": "로컬해산물 레스토랑",
    "tags": []
  },
  {
    "cat": "깜란",
    "area": "깜란",
    "name": "Eo Gio Bai Dai 씨푸드",
    "note": "배달가능, 구글예약 및픽드랍가능, 바닷가전망",
    "tags": [
      "배달",
      "예약"
    ],
    "menu": [
      {
        "name": "치즈바닷가재구이600~700g",
        "price": "78만동"
      },
      {
        "name": "갈릭버터바닷가재구이",
        "price": "75만동"
      },
      {
        "name": "갈릭후레이크게볶음",
        "price": "32만동"
      },
      {
        "name": "갈릭버터새우볶음",
        "price": "28만동"
      },
      {
        "name": "마늘후레이크달팽이",
        "price": "25만동"
      },
      {
        "name": "갈릭소스맛조개",
        "price": "14만5천동"
      },
      {
        "name": "조갯살모닝글로리",
        "price": "14만5천동"
      },
      {
        "name": "해산물볶음밥",
        "price": "13만동"
      },
      {
        "name": "모닝글로리볶음",
        "price": "5만동"
      }
    ]
  },
  {
    "cat": "깜란",
    "area": "깜란",
    "name": "Vua Hai San THAM",
    "note": "배달가능, 일정 금액이상픽업가능",
    "tags": [
      "배달"
    ],
    "menu": [
      {
        "name": "랍스터찜",
        "price": "76만5천동"
      },
      {
        "name": "구운치즈랍스터",
        "price": "59만동"
      },
      {
        "name": "치즈가리비구이",
        "price": "19만5천동"
      },
      {
        "name": "숯불새우구이",
        "price": "17만5천동"
      },
      {
        "name": "새우스프링롤",
        "price": "10만5천동"
      },
      {
        "name": "마늘계란볶음밥",
        "price": "5만5천동"
      }
    ]
  },
  {
    "cat": "깜란",
    "area": "깜란",
    "name": "King Beef Steak",
    "note": "피자, 파스타, 스테이크, 카드결제가능",
    "tags": [
      "카드"
    ]
  },
  {
    "cat": "깜란",
    "area": "깜란",
    "name": "Xoai BBQ",
    "note": "구글예약가능, 카드결제가능",
    "tags": [
      "카드",
      "예약"
    ],
    "menu": [
      {
        "name": "해산물콤보/구이콤보",
        "price": "34만9천동"
      },
      {
        "name": "혼합된소고기",
        "price": "16만9천동"
      },
      {
        "name": "소고기구이",
        "price": "13만9천동"
      },
      {
        "name": "해산물볶음밥",
        "price": "9만9천동"
      },
      {
        "name": "삼겹살소스구이",
        "price": "7만9천동"
      }
    ]
  },
  {
    "cat": "깜란",
    "area": "깜란",
    "name": "짜라푸드 - 바베큐 & 씨푸드",
    "note": "배달가능, 카드가능, 영문메뉴판",
    "tags": [
      "배달",
      "카드"
    ],
    "menu": [
      {
        "name": "해산물콤보/BBQ콤보",
        "price": "37만9천동"
      },
      {
        "name": "무뼈오징어찜",
        "price": "18만5천동"
      },
      {
        "name": "새우마늘볶음/양념돼지갈비",
        "price": "15만5천동"
      },
      {
        "name": "오징어튀김/전복죽",
        "price": "12만9천동"
      },
      {
        "name": "해산물죽/해물볶음밥/면",
        "price": "10만9천동"
      },
      {
        "name": "닭다리/닭날개",
        "price": "9만9천동"
      },
      {
        "name": "삼겹살 칠리소스구이",
        "price": "7만9천동"
      },
      {
        "name": "조개마늘볶음",
        "price": "6만9천동"
      },
      {
        "name": "모닝글로리볶음",
        "price": "4만5천동"
      }
    ]
  }
];
