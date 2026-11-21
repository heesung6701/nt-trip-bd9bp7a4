import { Stage, Phone, Row, Text, Icon, Count, States, Divider, type Act } from "./stageshow-kit";
import "./TripDemo.css";

// 브리핑용 사이트 소개 데모 (stageshow). 3박자: 일정(Day 2) → Day 3 칩 → 예산 탭에서 총액이 굴러 올라감.
// ponytail: 문구는 슬라이드와 같이 손으로 씀 — 일정 바뀌면 같이 고칠 것
type View = "d2" | "d3" | "budget";
type S = { view: View; n: number };

const REST = { x: 330, y: 470 };
const DAYS: Record<"d2" | "d3", [string, string, string][]> = {
  d2: [
    ["12:20", "Westin 점심 · 수영장", "해변 입수 · W는 직후 바로 씻기"],
    ["16:10", "가든 스파 120분", "Westin에서 도보 3분"],
    ["19:00", "해산물 저녁", "스파 끝나고 합류"],
  ],
  d3: [
    ["오전", "Westin 느긋하게", "레이트 체크아웃 요청"],
    ["오후", "리조트 → 공항", "Grab 호출"],
    ["밤", "출국", "귀국편 탑승"],
  ],
};
const TABS: { id: string; label: string; icon: "calendar" | "heart" | "card"; view: View }[] = [
  { id: "plan", label: "일정", icon: "calendar", view: "d2" },
  { id: "eat", label: "먹기", icon: "heart", view: "d2" },
  { id: "budget", label: "예산", icon: "card", view: "budget" },
];

const script = async (a: Act<S>) => {
  await a.wait(1200);
  a.mark("day3");
  await a.click("day3");
  a.put({ view: "d3" });
  await a.wait(1600);
  a.mark("budget");
  await a.click("tab-budget");
  a.put({ view: "budget" });
  a.put((s) => ({ ...s, n: 1 }));
  await a.wait(2600);
  await a.move(REST);
  await a.wait(500);
  await a.snap({ view: "d2", n: 0 });
  await a.wait(600);
};

const man = (n: number) => `${Math.round(n / 10000).toLocaleString("ko-KR")}만`;

export function TripDemo({ total, cash }: { total: number; cash: number }) {
  return (
    <Stage<S>
      width={400}
      height={520}
      compact={{ below: 400, width: 358, height: 520 }}
      initial={{ view: "d2", n: 0 }}
      poster={{ view: "budget", n: 1 }}
      script={script}
      cursor={{ at: REST, style: "touch" }}
      className="td"
    >
      {(s, _rect, layout) => (
        <Phone width={layout === "compact" ? 326 : 330} className="td-phone">
          <div className="td-app">
            <header className="td-head">
              <Text style={{ fontSize: 20, fontWeight: 700 }}>나트랑 여행</Text>
              <span className="td-chips">
                <span className="td-chip" data-on={s.view === "d2" || undefined}>Day 2</span>
                <span className="td-chip" data-on={s.view === "d3" || undefined} data-target="day3">Day 3</span>
              </span>
            </header>
            <div className="td-body">
              <States
                value={s.view}
                align="start"
                states={{
                  d2: <List rows={DAYS.d2} />,
                  d3: <List rows={DAYS.d3} />,
                  budget: (
                    <div className="td-budget">
                      <span className="td-budget__label">현지에서 쓸 돈 (둘이)</span>
                      <span className="td-budget__sum">
                        <Count value={s.n ? total : 0} format={man} />
                        <span className="td-budget__unit">동</span>
                      </span>
                      <Divider />
                      <Row title={<Text>현금</Text>} meta={<Text>{`${man(cash)}동`}</Text>} />
                      <Row title={<Text>카드 · 트래블월렛</Text>} meta={<Text>{`${man(total - cash)}동`}</Text>} />
                    </div>
                  ),
                }}
              />
            </div>
            <nav className="td-tabs">
              {TABS.map((t) => (
                <span key={t.id} className="td-tab" data-on={(t.id === "budget" ? s.view === "budget" : t.id === "plan" && s.view !== "budget") || undefined} data-target={`tab-${t.id}`}>
                  <Icon name={t.icon} size={20} />
                  <span>{t.label}</span>
                </span>
              ))}
            </nav>
          </div>
        </Phone>
      )}
    </Stage>
  );
}

function List({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="td-list">
      {rows.map(([t, title, sub]) => (
        <Row key={t} title={<Text>{title}</Text>} subtitle={<Text>{sub}</Text>} meta={<Text>{t}</Text>} />
      ))}
    </div>
  );
}
