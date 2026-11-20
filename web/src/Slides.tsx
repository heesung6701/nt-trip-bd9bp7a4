import { useEffect, useState } from "react";
import { BUDGET, VND_PER_KRW, cashToWithdraw } from "./data/budget";
import type { Day, TripData } from "./types";

// 저녁 브리핑용 슬라이드 (#slides). ←/→·스페이스·클릭으로 넘김, F = 전체화면.
// 날짜·편명은 itinerary.json에서만 읽음 — 배포 때 deploy.sh가 DayN으로 마스킹하므로 여기 날짜 쓰면 안 됨.
// ponytail: 슬라이드 문구는 일정표에서 골라 손으로 씀 — 일정 바뀌면 여기도 같이 고칠 것

const WEEK = "일월화수목금토";
const vnd = (n: number) => `${(n / 10000).toLocaleString("ko-KR")}만동`;
const krw = (n: number) => `${(Math.round(n / VND_PER_KRW / 1000) * 1000).toLocaleString("ko-KR")}원`;

function S({ cover, kicker, title, children }: { cover?: boolean; kicker: string; title?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className={cover ? "slide cover" : "slide"}>
      <p className="kicker">{kicker}</p>
      {title && (cover ? <h1>{title}</h1> : <h2>{title}</h2>)}
      {children}
    </section>
  );
}

function Tl({ rows }: { rows: [string, React.ReactNode, boolean?][] }) {
  return (
    <ul className="tl">
      {rows.map(([t, body, hi]) => (
        <li key={t} className={hi ? "hi" : undefined}>
          <time>{t}</time>
          <span>{body}</span>
        </li>
      ))}
    </ul>
  );
}

export function Slides({ data, days, onExit }: { data: TripData; days: Day[]; onExit: () => void }) {
  const d = (n: number) => {
    const date = days[n - 1]?.date ?? `Day${n}`;
    if (date.startsWith("Day")) return `Day ${n}`;
    const [, m, dd] = date.split("-").map(Number);
    return `${m}/${dd}(${WEEK[new Date(`${date}T00:00:00`).getDay()]})`;
  };
  const [out, back] = data.trip.flights;
  const hm = (s: string) => s.slice(11, 16);
  const w = (n: number) => data.weather?.days.find((x) => x.date === days[n - 1]?.date);
  const cash = BUDGET.filter((l) => l.pay === "현금").reduce((a, l) => a + l.vnd, 0);
  const total = BUDGET.reduce((a, l) => a + l.vnd, 0);
  const withdraw = cashToWithdraw(cash);

  const slides = [
    <S cover kicker="TRIP BRIEFING" title={<>나트랑 · 깜란<br />2박 쉬러 가기</>}>
      <p className="sub">{d(1)} 밤 출발 → {d(4)} 아침 도착 · 둘이서</p>
      <p className="sub">바다엔 안 들어가요 · 리조트에서 오래 놀기 · 해산물 많이</p>
    </S>,
    <S kicker="한눈에" title="3박 4일, 실제로 노는 건 이틀">
      <div className="grid g4">
        <div className="card"><span className="tag">{d(1)}</span><b className="big">출발</b><p>{hm(out.depart)} 인천 출발 (KST)</p><p className="sub">현지 00:10 도착</p></div>
        <div className="card"><span className="tag sun">{d(2)}</span><b className="big">리조트 + 스파</b><p>Navy에서 자고 → Westin</p><p>수영장 · <b>당신 스파</b> · 해산물 저녁</p></div>
        <div className="card"><span className="tag leaf">{d(3)}</span><b className="big">보트 + 늦은 체크아웃</b><p>오전 보트 (입수 없음)</p><p>16시까지 방 쓰기 → 저녁 → 공항</p></div>
        <div className="card"><span className="tag">{d(4)}</span><b className="big">귀국</b><p>현지 00:30 출발</p><p className="sub">인천 {hm(back.arrive)} 도착</p></div>
      </div>
    </S>,
    <S kicker="비행기 · 숙소" title="둘 다 예약 끝">
      <div className="grid g2">
        <div className="card">
          <span className="tag">✈ 항공</span>
          <p><b>가는 편</b> {out.airline} {out.no}</p>
          <p className="sub">{d(1)} {hm(out.depart)} {out.from} → 현지 00:10 {out.to}</p>
          <p><b>오는 편</b> {back.airline} {back.no}</p>
          <p className="sub">현지 {d(4)} 00:30 {back.from} → {hm(back.arrive)} {back.to}</p>
          <p className="sub">마지막 밤({d(3)})은 숙소 없이 공항으로</p>
        </div>
        <div className="card">
          <span className="tag">🏨 숙소</span>
          <p><b>① Navy Hotel Cam Ranh</b> — 잠만 자는 곳</p>
          <p className="sub">공항 5분 · 새벽 도착이라 {d(1)}로 예약 · 조식 포함</p>
          <p><b>② Westin Resort &amp; Spa Cam Ranh</b> — 메인</p>
          <p className="sub">{d(2)} 오전 도착 · <b>레이트 체크아웃 16시 확정</b> · 짐 맡기고 저녁까지 리조트</p>
          <p className="sub">얼리 체크인은 요청만 (방 있으면)</p>
        </div>
      </div>
    </S>,
    <S kicker={`${d(2)} · 첫날`} title="새벽 도착 → 늦잠 → 리조트">
      <Tl rows={[
        ["00:10", "깜라인 도착 · 입국 · 짐 찾기"],
        ["01:00", <>Grab 기사님 만나기 (<b>예약 완료</b>) → Navy Hotel 15분</>],
        ["01:15", "체크인 · 바로 잠"],
        ["~10:45", "조식 · 체크아웃"],
        ["11:00", "Grab으로 Westin (30분)"],
        ["12:00", "현금 뽑기 — 모벤픽 리조트 VPBank ATM (Grab 5분, 수수료 없음)"],
        ["13:00", "점심 후 수영장 · 비치 라운지"],
        ["16:10", <><b>당신은 가든 스파 120분</b> · 나는 근처 구경 (다음 장)</>, true],
        ["19:00", "Westin 해산물 저녁"],
      ]} />
    </S>,
    <S kicker="당신 전용 🌿" title="가든 스파 · 가든스페셜 120분">
      <div className="grid g2">
        <div className="card">
          <span className="tag sun">16:10 ~ 18:10</span>
          <p>허브찜질 포함 전신 120분</p>
          <p><b>84만동 ($36)</b> · 팁 약 10만동 · 현금</p>
          <p className="sub">Westin에서 200m — 걸어서 3분</p>
          <p className="sub">영업 10~22시 · 카톡 "가든스파 깜란"</p>
        </div>
        <div className="card">
          <span className="tag">그동안 나는</span>
          <p className="sub">근처 산책·일몰·카페 후보 조사 중 — 정리되면 여기 채움</p>
        </div>
      </div>
      <p className="sub">⚠ 예약금 입금해야 확정 → <b>오늘 밤 카톡 예약</b> · 1인 가격도 같이 확인</p>
    </S>,
    <S kicker={`${d(3)} · 둘째 날`} title="보트 → 리조트 → 공항">
      <Tl rows={[
        ["~08:00", "Grab으로 나트랑 항구 (50분) — 투어 픽업 포함인지 확인"],
        ["09:00", <>몬섬 쪽 선상 관광 보트 · <b>탑승만, 물엔 안 들어감</b></>],
        ["13:00", "Grab으로 Westin 복귀"],
        ["14:00", "Westin 해산물 점심"],
        ["16:00", <><b>레이트 체크아웃</b> · 짐 맡기고 라운지에서 쉬기</>, true],
        ["18:00", "리조트 저녁"],
        ["20:00", "Grab 공항 (15~30분) → 00:30 출발"],
      ]} />
    </S>,
    <S kicker="날씨 · 비 오면" title="소나기 확률 높음 — 실내 플랜 B 있음">
      <div className="grid g3">
        {[2, 3].map((n) => {
          const x = w(n);
          return (
            <div className="card" key={n}>
              <span className="tag">{d(n)}</span>
              {x ? <><b className="big">{Math.round(x.t_min)}~{Math.round(x.t_max)}°C</b><p>비 {x.rain_prob}% · {x.rain_mm}mm · UV {x.uv}</p></> : <p className="sub">예보 없음</p>}
            </div>
          );
        })}
        <div className="card">
          <span className="tag warn">비 오면</span>
          <ul className="dots">
            <li>첫날 수영장 → Westin 실내 휴식 (스파는 그대로)</li>
            <li>둘째 날 보트 취소 → 해양학연구소 수족관</li>
            <li>식사는 리조트 실내</li>
          </ul>
        </div>
      </div>
      {data.weather && <p className="sub">{data.weather.source} {data.weather.fetched_at} 예보 · 선크림 필수</p>}
    </S>,
    <S kicker="돈" title={`현지에서 쓸 돈 약 ${krw(total)} (둘이)`}>
      <div className="grid g3">
        <div className="card"><span className="tag">합계</span><b className="big num">{vnd(total)}</b><p className="num">≈ {krw(total)} · 1인 ≈ {krw(total / 2)}</p><p className="sub">숙박·항공 빼고</p></div>
        <div className="card"><span className="tag sun">현금</span><b className="big num">{vnd(withdraw)} 뽑기</b><p className="num">≈ {krw(withdraw)} · 한 번만</p><p className="sub">스파·팁·간식·입장료</p></div>
        <div className="card"><span className="tag leaf">카드</span><b className="big num">{vnd(total - cash)}</b><p>트래블카드 · Grab 앱</p><p className="sub">리조트 식사 · Grab · 보트</p></div>
      </div>
      <p className="sub">ATM은 <b>VPBank</b>만 (외국 카드 수수료 없음) — Westin 근처 모벤픽 리조트 안 · 항구 근처 Vinmec</p>
    </S>,
    <S kicker="출발 전 할 일" title="내일까지 끝낼 것">
      <ul className="dots check">
        <li className="done">숙소 2곳 확정 · Westin 레이트 체크아웃 16시</li>
        <li className="done">공항 → Navy Grab 01:00 예약</li>
        <li><b>가든 스파 카톡 예약 + 예약금</b> (당신만 · 1인 가격 확인)</li>
        <li><b>보트 투어 예약</b> — 혼문 정박하는지 · 항구 픽업 포함인지 물어보기</li>
        <li>{d(3)} 20:00 Westin → 공항 Grab 예약</li>
        <li>eSIM 설치 · e-Customs QR · 여권</li>
        <li>선크림 · 우산/우비 · 220V 그대로</li>
      </ul>
    </S>,
    <S cover kicker="끝" title="질문 · 바꾸고 싶은 거?">
      <p className="sub">이동 중엔 휴대폰으로 일정 사이트 보면 돼요</p>
    </S>,
  ];

  const [i, setI] = useState(() => Math.min(Math.max(0, +location.hash.split("/")[1] - 1 || 0), slides.length - 1));
  const go = (n: number) => setI(Math.min(Math.max(0, n), slides.length - 1));
  useEffect(() => history.replaceState(null, "", `#slides/${i + 1}`), [i]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) go(i + 1);
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) go(i - 1);
      else if (e.key === "Escape") onExit();
      else if (e.key === "f") void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  return (
    <div className="deck" onClick={(e) => go(e.clientX > innerWidth / 3 ? i + 1 : i - 1)}>
      {slides[i]}
      <button className="deck-exit" onClick={(e) => { e.stopPropagation(); onExit(); }} aria-label="슬라이드 닫기">✕</button>
      <div className="deck-bar" style={{ width: `${((i + 1) / slides.length) * 100}%` }} />
      <div className="deck-foot">{i + 1} / {slides.length}</div>
    </div>
  );
}
