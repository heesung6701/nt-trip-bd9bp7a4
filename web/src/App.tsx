import { useEffect, useState } from "react";
import { Badge, Callout, Text } from "@seed-design/react";
import { STAY_MOVES } from "./data/stayMoves";
import { BUDGET, VND_PER_KRW, cashToWithdraw, type BudgetLine } from "./data/budget";
import { RouteGraph } from "./RouteGraph";
import { Slides } from "./Slides";
import type { Activity, Day, Food, Item, TripData, WeatherDay } from "./types";
import itinerary from "./data/itinerary.json";
import "./App.css";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
// 자정 넘긴 항목은 24:xx로 저장(정렬용) → "00:xx+1"로 표시
const hhmm = (t: string) => {
  const h = parseInt(t, 10);
  return h >= 24 ? `${String(h - 24).padStart(2, "0")}${t.slice(2, 5)}+1` : t.slice(0, 5);
};

// WMO weather code → 아이콘·라벨 (Open-Meteo)
function wx(code: number): string {
  if (code === 0) return "☀️ 맑음";
  if (code <= 2) return "🌤 구름 조금";
  if (code === 3) return "☁️ 흐림";
  if (code <= 48) return "🌫 안개";
  if (code <= 57) return "🌦 이슬비";
  if (code <= 67) return "🌧 비";
  if (code <= 77) return "🌨 눈";
  if (code <= 82) return "🌦 소나기";
  return "⛈ 뇌우";
}

function WeatherCard({ w, fetchedAt, place }: { w: WeatherDay; fetchedAt: string; place: string }) {
  return (
    <div className="weather">
      <Text textStyle="t5Bold" color="fg.neutral">
        {wx(w.code)} · {Math.round(w.t_min)}~{Math.round(w.t_max)}°C
      </Text>
      <Text textStyle="t4Regular" color={w.rain_prob >= 60 ? "fg.critical" : "fg.neutral-subtle"}>
        강수 {w.rain_prob}% · {w.rain_mm}mm · 바람 {Math.round(w.wind_kmh)}km/h · UV {w.uv}
      </Text>
      <Text textStyle="t3Regular" color="fg.neutral-muted">
        {place} 예보 · Open-Meteo · {fetchedAt} 기준
      </Text>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <Text as="h2" textStyle="t6Bold" color="fg.neutral">
        {title}
      </Text>
      <div className="section-body">{children}</div>
    </section>
  );
}

function FlightCards({ data }: { data: TripData }) {
  return (
    <div className="flights">
      {data.trip.flights.map((f) => (
        <div className="flight-card" key={`${f.airline}-${f.depart}`}>
          <Text textStyle="t5Bold" color="fg.neutral">
            {f.airline} {f.no}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            {f.from} → {f.to}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            KST {f.depart.replace("T", " ").slice(0, 16)} → {f.arrive.replace("T", " ").slice(0, 16)}
          </Text>
        </div>
      ))}
    </div>
  );
}

function Notices({ data }: { data: TripData }) {
  const messages = [...data.warnings, ...data.errors.map((e) => `(미해결) ${e}`)];
  if (messages.length === 0) return null;
  return (
    <Callout.Root tone="warning">
      <Callout.Content>
        <Callout.Title>확인이 필요해요</Callout.Title>
        {messages.map((m) => (
          <Callout.Description key={m}>{m}</Callout.Description>
        ))}
      </Callout.Content>
    </Callout.Root>
  );
}

function DayTabs({ days, value, onChange }: { days: { date: string }[]; value: number; onChange: (i: number) => void }) {
  return (
    <div className="day-tabs" role="tablist">
      {days.map((d, i) => (
        <button
          key={d.date}
          role="tab"
          aria-selected={i === value}
          className={i === value ? "chip active" : "chip"}
          onClick={() => onChange(i)}
        >
          {d.date.startsWith("Day") ? `Day ${i + 1}` : `Day ${i + 1} · ${d.date.slice(5)}`}
        </button>
      ))}
    </div>
  );
}

// 여행 전체 날짜(start~end). 플래너는 가용 시간 있는 날만 내보내므로 빈 날은 items: [] 로 채움.
function allDays(data: TripData): Day[] {
  const byDate = new Map((data.itinerary?.days ?? []).map((d) => [d.date, d]));
  const { start, end } = data.trip;
  const dates: string[] = [];
  const ms = start.match(/^Day(\d+)$/), me = end.match(/^Day(\d+)$/); // deploy.sh 마스킹: 날짜 → DayN
  if (ms && me) for (let n = +ms[1]; n <= +me[1]; n++) dates.push(`Day${n}`);
  else for (let t = Date.parse(start); t <= Date.parse(end); t += 86_400_000) dates.push(new Date(t).toISOString().slice(0, 10));
  return dates.map((date) => byDate.get(date) ?? { date, items: [] });
}

const dt = (s: string) => s.replace("T", " ").replace(/:\d\d$/, "");

function Timeline({ data, day, dayNo }: { data: TripData; day: Day | undefined; dayNo: number }) {
  if (!day) return null;
  const items = [...day.items, ...STAY_MOVES.filter((m) => m.day === dayNo)].sort((a, b) => a.start.localeCompare(b.start));
  const total = items.reduce((sum, i) => sum + i.cost_krw, 0);
  // ponytail: 항공 시각은 KST 기준 날짜로 매칭
  const flights = data.trip.flights.filter((f) => f.depart.startsWith(day.date) || f.arrive.startsWith(day.date));
  const w = data.weather?.days.find((d) => d.date === day.date);
  return (
    <div className="day">
      {w && data.weather && <WeatherCard w={w} fetchedAt={data.weather.fetched_at} place={data.weather.place} />}
      {flights.map((f) => (
        <Text key={f.depart} textStyle="t5Regular" color="fg.neutral">
          ✈️ {f.airline} {f.no} {f.from} → {f.to} · KST {dt(f.depart)} 출발 → {dt(f.arrive)} 도착
        </Text>
      ))}
      <Text textStyle="t4Regular" color="fg.neutral-subtle">
        일정 {items.length}개 · 예상 {won(total)}
      </Text>
      {items.length === 0 && (
        <Text textStyle="t5Regular" color="fg.neutral-subtle">
          이날은 잡힌 일정이 없어요 (이동·휴식)
        </Text>
      )}
      <ol className="timeline">
        {items.map((item) => {
          const h = item.title.startsWith("[KST]") ? undefined : w?.hourly[parseInt(item.start, 10)]; // 예보는 깜라인 현지 시각 기준 — 인천(KST) 항목엔 안 붙임
          return (
          <li key={`${item.start}-${item.title}`}>
            <div className="time">
              {hhmm(item.start)}
              <br />
              {hhmm(item.end)}
            </div>
            <div className="item-body">
              <Text textStyle="t5Bold" color="fg.neutral">
                {item.title}
              </Text>
              <div className="meta">
                <Badge.Root size="medium" variant="weak" tone="neutral">
                  <Badge.Label>{item.kind}</Badge.Label>
                </Badge.Root>
                {h && (
                  <Badge.Root size="medium" variant="weak" tone={h.rain_prob >= 60 ? "warning" : "neutral"}>
                    <Badge.Label>
                      {wx(h.code).split(" ")[0]} {Math.round(h.temp)}° · 비 {h.rain_prob}%
                    </Badge.Label>
                  </Badge.Root>
                )}
                <Text textStyle="t4Regular" color="fg.neutral-subtle">
                  {item.place} · {won(item.cost_krw)}
                </Text>
              </div>
            </div>
          </li>
          );
        })}
      </ol>
    </div>
  );
}

// 확정 숙소 공식 페이지 (Navy는 공식 사이트 없음)
const STAY_LINKS: Record<string, string> = {
  "The Westin Resort & Spa Cam Ranh": "https://www.marriott.com/en-us/hotels/cxrwi-the-westin-resort-and-spa-cam-ranh/overview/",
};

function StayRecommendations({ data }: { data: TripData }) {
  return (
    <div className="stay-segments">
      {(data.stay ?? []).map((seg) => (
        <div className="segment" key={`${seg.check_in}-${seg.check_out}`}>
          <Text as="h3" textStyle="t5Bold" color="fg.neutral">
            {seg.check_in} ~ {seg.check_out}
          </Text>
          {seg.name && (
            <Text textStyle="t5Bold" color="fg.neutral">
              확정: {seg.name}
            </Text>
          )}
          {seg.name && STAY_LINKS[seg.name] && (
            <div className="links">
              <a href={STAY_LINKS[seg.name]} target="_blank" rel="noreferrer">
                공식 페이지
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 일정표에 잡힌 항목 중 kind가 맞는 것만 Day별로 (먹기·놀기 탭)
function Scheduled({ days, kinds }: { days: Day[]; kinds: string[] }) {
  const rows = days.flatMap((d, i) => d.items.filter((it) => kinds.includes(it.kind)).map((it) => ({ dayNo: i + 1, it })));
  if (rows.length === 0) return <Text textStyle="t4Regular" color="fg.neutral-subtle">일정에 잡힌 항목 없음</Text>;
  return (
    <ul className="card-list">
      {rows.map(({ dayNo, it }: { dayNo: number; it: Item }) => (
        <li className="card" key={`${dayNo}-${it.start}-${it.title}`}>
          <Text textStyle="t5Bold" color="fg.neutral">
            Day {dayNo} {hhmm(it.start)} · {it.title}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            {it.place}
            {it.cost_krw > 0 && ` · ${won(it.cost_krw)}`}
          </Text>
        </li>
      ))}
    </ul>
  );
}

const vnd = (n: number) => `${(n / 10000).toLocaleString("ko-KR")}만동`;
const krw = (n: number) => won(Math.round(n / VND_PER_KRW / 1000) * 1000);
const sum = (ls: BudgetLine[], pay?: BudgetLine["pay"]) => ls.filter((l) => !pay || l.pay === pay).reduce((a, l) => a + l.vnd, 0);

function BudgetTab({ days, travelers }: { days: Day[]; travelers: number }) {
  const cash = sum(BUDGET, "현금"), total = sum(BUDGET);
  const withdraw = cashToWithdraw(cash);
  return (
    <>
      <Section title="환전·ATM">
        <Text textStyle="t6Bold" color="fg.neutral">
          현금 {vnd(withdraw)} 출금 추천 (≈{krw(withdraw)})
        </Text>
        <Text textStyle="t4Regular" color="fg.neutral-subtle">
          현금 예상 {vnd(cash)} + 여유 20% · 카드(트래블카드·Grab 앱) {vnd(total - cash)} · VPBank ATM 외국 카드 수수료 없음, 1회 한도 500만~1,000만동 (2026 블로그 기준) — Westin 근처는 모벤픽 리조트 안, 항구 근처는 Vinmec
        </Text>
        <Text textStyle="t4Regular" color="fg.neutral-subtle">
          {travelers}명 합계 {vnd(total)} ≈ {krw(total)} · 1인 ≈ {krw(total / travelers)} (숙박·항공 제외) · 1만동 ≈ 550원
        </Text>
      </Section>
      {days.map((d, i) => {
        const ls = BUDGET.filter((l) => l.day === i + 1);
        if (ls.length === 0) return null;
        return (
          <Section key={d.date} title={`Day ${i + 1} · ${vnd(sum(ls))} (현금 ${vnd(sum(ls, "현금"))})`}>
            <div className="sheet-wrap">
              <table className="sheet budget">
                <thead>
                  <tr>
                    <th>항목</th>
                    <th>금액</th>
                    <th>결제</th>
                  </tr>
                </thead>
                <tbody>
                  {ls.map((l) => (
                    <tr key={l.title}>
                      <td>
                        {l.title}
                        {l.note && <div className="src">{l.note}</div>}
                      </td>
                      <td className="num">
                        {vnd(l.vnd)}
                        <div className="src">≈{krw(l.vnd)}</div>
                      </td>
                      <td>{l.pay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        );
      })}
    </>
  );
}

function ActivityList({ items }: { items: Activity[] }) {
  return (
    <ul className="card-list">
      {items.map((a) => (
        <li className="card" key={a.name}>
          <Text textStyle="t5Bold" color="fg.neutral">
            {a.name}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            {a.region} · {a.duration_min}분 · {won(a.cost_krw)} · {a.indoor ? "실내" : "야외"} · {a.recommended_time}
          </Text>
        </li>
      ))}
    </ul>
  );
}

function FoodList({ items }: { items: Food[] }) {
  return (
    <ul className="card-list">
      {items.map((f) => (
        <li className="card" key={f.name}>
          <Text textStyle="t5Bold" color="fg.neutral">
            {f.name}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutral-subtle">
            {f.region} · {f.meal_type} · {f.cost_krw > 0 ? won(f.cost_krw) : "가격 미확인"}
          </Text>
          {f.note && (
            <Text textStyle="t4Regular" color="fg.neutral">
              {f.note}
            </Text>
          )}
        </li>
      ))}
    </ul>
  );
}

const TABS = [
  { id: "plan", label: "일정", icon: "🗓" },
  { id: "eat", label: "먹기", icon: "🍤" },
  { id: "play", label: "놀기", icon: "💆" },
  { id: "move", label: "이동", icon: "🚕" },
  { id: "budget", label: "예산", icon: "💵" },
  { id: "prep", label: "준비", icon: "🎒" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function App() {
  const data = itinerary as TripData;
  const [tab, setTab] = useState<TabId>("plan");
  const [dayIndex, setDayIndex] = useState(0);
  // 브리핑 슬라이드: #slides 또는 로컬 사본 private/briefing.html로 열면 바로 슬라이드
  const isSlides = () => location.hash.startsWith("#slides") || location.pathname.endsWith("briefing.html");
  const [slides, setSlides] = useState(isSlides);
  useEffect(() => {
    const onHash = () => setSlides(isSlides());
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  const days = allDays(data);
  const rain = data.itinerary?.rain_alternatives ?? [];
  const transport = data.transport ? Object.values(data.transport) : [];
  const select = (id: TabId) => {
    setTab(id);
    window.scrollTo({ top: 0 });
  };

  if (slides)
    return (
      <Slides
        data={data}
        days={days}
        onExit={() => {
          history.replaceState(null, "", location.pathname);
          setSlides(false);
        }}
      />
    );

  return (
    <>
      <header className="topbar">
        <Text as="h1" textStyle="t5Bold" color="fg.neutral">
          {data.trip.destination} 여행
        </Text>
        <Text textStyle="t4Regular" color="fg.neutral-subtle">
          {data.trip.start} ~ {data.trip.end} · {data.trip.travelers}명
        </Text>
        <a className="slides-link" href="#slides">
          📽 브리핑
        </a>
      </header>

      <main className="page">
        {tab === "plan" && (
          <>
            <Notices data={data} />
            <DayTabs days={days} value={dayIndex} onChange={setDayIndex} />
            <section className="section">
              <Timeline data={data} day={days[dayIndex]} dayNo={dayIndex + 1} />
            </section>
            <details className="section fold" open>
              <summary>🗺 이동 그래프</summary>
              <RouteGraph dayNo={dayIndex + 1} />
            </details>
            {rain.length > 0 && (
              <details className="section fold">
                <summary>☔ 비 오면 이렇게</summary>
                <ul className="bullets">
                  {rain.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </details>
            )}
            <details className="section fold">
              <summary>✈ 항공편</summary>
              <FlightCards data={data} />
            </details>
          </>
        )}

        {tab === "eat" && (
          <>
            <Section title="일정에 잡힌 식사">
              <Scheduled days={days} kinds={["meal"]} />
            </Section>
            {data.food && data.food.length > 0 && (
              <Section title="식당 후보">
                <FoodList items={data.food} />
              </Section>
            )}
          </>
        )}

        {tab === "play" && (
          <>
            <Section title="일정에 잡힌 것">
              <Scheduled days={days} kinds={["spa", "activity", "rest"]} />
            </Section>
            {data.activities && data.activities.length > 0 && (
              <Section title="추천·대안">
                <ActivityList items={data.activities} />
              </Section>
            )}
          </>
        )}

        {tab === "move" && (
          <>
            <DayTabs days={days} value={dayIndex} onChange={setDayIndex} />
            <section className="section">
              <RouteGraph dayNo={dayIndex + 1} />
            </section>
            {transport.length > 0 && (
              <details className="section fold">
                <summary>🚕 이동 수단 메모</summary>
                <ul className="card-list">
                  {transport.map((leg) => (
                    <li className="card" key={leg.description}>
                      <Text textStyle="t5Bold" color="fg.neutral">
                        {leg.description}
                      </Text>
                      <Text textStyle="t4Regular" color="fg.neutral-subtle">
                        {leg.method} · {won(leg.cost_krw)}
                      </Text>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}

        {tab === "budget" && <BudgetTab days={days} travelers={data.trip.travelers} />}

        {tab === "prep" && data.prep && (
          <>
            {data.stay && data.stay.length > 0 && (
              <Section title="내 숙소">
                <StayRecommendations data={data} />
              </Section>
            )}
            <Section title="준비물">
              <ul className="checklist">
                {data.prep.checklist.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <Text textStyle="t4Regular" color="fg.neutral-subtle">
                날씨: {data.prep.weather_note}
              </Text>
            </Section>
          </>
        )}
      </main>

      <nav className="bottom-nav" aria-label="메뉴">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={t.id === tab ? "nav-item active" : "nav-item"}
            aria-current={t.id === tab ? "page" : undefined}
            onClick={() => select(t.id)}
          >
            <span aria-hidden>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

export { App };
