// 이동 그래프 노드 배치가 실제 동서남북과 맞는지 검사. 실행: node src/data/routeNodes.check.mjs (npm run build가 먼저 돌림)
// 북쪽이면 위(y 작음), 동쪽이면 오른쪽(x 큼).
import { NODES } from "./routeNodes.ts";

// ponytail: 0.005°(≈550m) 미만 차이는 같은 위치로 봄 — 붙어 있는 항구·연구소·Westin·공항 경도까지 줄 세우면 배치 불가
const TOL = 0.005;
const list = Object.entries(NODES);
const bad = [];
for (const [a, A] of list)
  for (const [b, B] of list) {
    if (A.lat - B.lat > TOL && !(A.y < B.y)) bad.push(`${A.label}이(가) ${B.label}보다 북쪽인데 위에 있지 않음`);
    if (A.lon - B.lon > TOL && !(A.x > B.x)) bad.push(`${A.label}이(가) ${B.label}보다 동쪽인데 오른쪽에 있지 않음`);
  }
if (bad.length) {
  console.error(bad.join("\n"));
  process.exit(1);
}
console.log(`이동 그래프 방향 OK (노드 ${list.length}개)`);
