import { useState } from "react";
import { Badge, Callout, ImageFrame, Text } from "@seed-design/react";
import { HOTELS, type HotelInfo } from "./data/hotels";
import { STAY_MOVES } from "./data/stayMoves";
import { RESORTS, type ResortRow } from "./data/resortCompare";
import type { Activity, Day, Food, StayCandidate, TripData } from "./types";
import itinerary from "./data/itinerary.json";
import "./App.css";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const hhmm = (t: string) => t.slice(0, 5);

function matchHotel(name: string): HotelInfo | undefined {
  const n = name.toLowerCase();
  return HOTELS.find((h) => n.includes(h.name.toLowerCase()) || h.name.toLowerCase().includes(n));
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
  return (
    <div className="day">
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
        {items.map((item) => (
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
                <Text textStyle="t4Regular" color="fg.neutral-subtle">
                  {item.place} · {won(item.cost_krw)}
                </Text>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HotelRoomImage({ hotel }: { hotel: HotelInfo }) {
  if (hotel.roomImage) {
    return (
      <ImageFrame
        ratio={16 / 9}
        src={hotel.roomImage}
        alt={`${hotel.name} 객실`}
        loading="lazy"
        fallback={<div className="img-fallback">객실 사진 준비 중</div>}
      />
    );
  }
  return <div className="img-fallback">객실 사진 미확보 · 갤러리에서 확인</div>;
}

const TIER_LABEL: Record<HotelInfo["tier"], string> = {
  marriott: "Marriott",
  flex: "플렉스",
};

const TIER_TONE: Record<HotelInfo["tier"], "brand" | "neutral" | "warning"> = {
  marriott: "brand",
  flex: "warning",
};

function HotelComparison() {
  return (
    <div className="hotel-grid">
      {HOTELS.map((h) => (
        <article className="hotel-card" key={h.name}>
          <HotelRoomImage hotel={h} />
          <div className="hotel-body">
            <div className="meta">
              <Badge.Root size="medium" variant="outline" tone={TIER_TONE[h.tier]}>
                <Badge.Label>{TIER_LABEL[h.tier]}</Badge.Label>
              </Badge.Root>
            </div>
            <Text as="h4" textStyle="t5Bold" color="fg.neutral">
              {h.name}
            </Text>
            <Text textStyle="t4Regular" color="fg.neutral-subtle">
              {h.address}
            </Text>
            <Text textStyle="t4Regular" color="fg.neutral">
              {h.priceNote}
            </Text>
            <ul className="facilities">
              {h.facilities.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {h.costs && (
              <ul className="bullets">
                {h.costs.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
            <div className="links">
              <a href={h.listingUrl} target="_blank" rel="noreferrer">
                예약 페이지
              </a>
              {h.galleryUrl && (
                <a href={h.galleryUrl} target="_blank" rel="noreferrer">
                  갤러리
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function StayRecommendations({ data }: { data: TripData }) {
  const segments = data.stay ?? [];
  return (
    <div className="stay-segments">
      {segments.map((seg) => {
        const confirmed = seg.name ? matchHotel(seg.name) : undefined;
        return (
          <div className="segment" key={`${seg.check_in}-${seg.check_out}`}>
            <Text as="h3" textStyle="t5Bold" color="fg.neutral">
              {seg.check_in} ~ {seg.check_out}
            </Text>
            {seg.name && (
              <Text textStyle="t5Bold" color="fg.neutral">
                확정: {seg.name}
              </Text>
            )}
            {seg.recommended_region && (
              <Text textStyle="t4Regular" color="fg.neutral-subtle">
                {seg.recommended_region}
              </Text>
            )}
            {confirmed && (
              <div className="links">
                <a href={confirmed.listingUrl} target="_blank" rel="noreferrer">
                  예약 페이지
                </a>
              </div>
            )}
            {(seg.candidates ?? []).length > 0 && (
              <div className="candidate-list">
                {seg.candidates!.map((c: StayCandidate) => {
                  const hotel = matchHotel(c.name);
                  return (
                    <div className="candidate" key={c.name}>
                      <Text textStyle="t5Bold" color="fg.neutral">
                        {c.name}
                      </Text>
                      <Text textStyle="t4Regular" color="fg.neutral-subtle">
                        {c.region} · {won(c.price_krw_per_night)}/박
                      </Text>
                      <Text textStyle="t4Regular" color="fg.neutral">
                        {c.reason}
                      </Text>
                      {hotel && (
                        <div className="links">
                          <a href={hotel.listingUrl} target="_blank" rel="noreferrer">
                            예약 페이지
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
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

const RESORT_COLS: { key: Exclude<keyof ResortRow, "name" | "marriott">; label: string }[] = [
  { key: "room", label: "숙박비/박" },
  { key: "dining", label: "식당" },
  { key: "spa", label: "호텔 스파 60분" },
  { key: "massage", label: "외부 마사지" },
  { key: "rain", label: "비 올 때·비고" },
];

function ResortSheet() {
  return (
    <div className="sheet-wrap">
      <table className="sheet wrap">
        <thead>
          <tr>
            <th>호텔</th>
            {RESORT_COLS.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RESORTS.map((r) => (
            <tr key={r.name}>
              <td className="name">
                {r.name}
                {r.marriott && <div className="src">Marriott · Platinum</div>}
              </td>
              {RESORT_COLS.map((c) => {
                const cell = r[c.key];
                return (
                  <td key={c.key}>
                    {cell.t}
                    {cell.src && (
                      <div className="src">
                        {cell.src.map((s) => (
                          <a key={s.url + s.label} href={s.url} target="_blank" rel="noreferrer">
                            {s.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TABS = [
  { id: "plan", label: "일정", icon: "🗓" },
  { id: "stay", label: "숙소", icon: "🏨" },
  { id: "spots", label: "먹고 놀기", icon: "🍤" },
  { id: "move", label: "이동", icon: "🚕" },
  { id: "prep", label: "준비", icon: "🎒" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function App() {
  const data = itinerary as TripData;
  const [tab, setTab] = useState<TabId>("plan");
  const [dayIndex, setDayIndex] = useState(0);

  const days = allDays(data);
  const budget = data.itinerary?.budget_total_krw;
  const rain = data.itinerary?.rain_alternatives ?? [];
  const transport = data.transport ? Object.values(data.transport) : [];
  const select = (id: TabId) => {
    setTab(id);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <header className="topbar">
        <Text as="h1" textStyle="t5Bold" color="fg.neutral">
          {data.trip.destination} 여행
        </Text>
        <Text textStyle="t4Regular" color="fg.neutral-subtle">
          {data.trip.start} ~ {data.trip.end} · {data.trip.travelers}명
        </Text>
      </header>

      <main className="page">
        {tab === "plan" && (
          <>
            <Notices data={data} />
            <DayTabs days={days} value={dayIndex} onChange={setDayIndex} />
            <section className="section">
              <Timeline data={data} day={days[dayIndex]} dayNo={dayIndex + 1} />
            </section>
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

        {tab === "stay" && (
          <>
            {data.stay && data.stay.length > 0 && (
              <Section title="내 숙소">
                <StayRecommendations data={data} />
              </Section>
            )}
            <Section title="JW 대안 호캉스 비교 (비 올 때)">
              <Text textStyle="t4Regular" color="fg.neutral-subtle">
                숙박비는 예약사이트 스냅샷(Day2 실요금 아님), 식당·스파는 후기·프로모션가 위주. 셀 아래 링크가 근거. 1 USD ≈ 1,400원, 1만동 ≈ 550원.
              </Text>
              <ResortSheet />
            </Section>
            <Section title="숙소 후보 비교">
              <HotelComparison />
            </Section>
          </>
        )}

        {tab === "spots" && (
          <>
            {data.food && data.food.length > 0 && (
              <Section title="식당">
                <FoodList items={data.food} />
              </Section>
            )}
            {data.activities && data.activities.length > 0 && (
              <Section title="할 것">
                <ActivityList items={data.activities} />
              </Section>
            )}
          </>
        )}

        {tab === "move" && (
          <Section title="이동">
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
          </Section>
        )}

        {tab === "prep" && data.prep && (
          <>
            {budget !== undefined && (
              <Section title="예산 합계">
                <Text textStyle="t6Bold" color="fg.neutral">
                  {data.trip.travelers}명 기준 {won(budget)}
                </Text>
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
