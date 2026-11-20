// 이동 그래프 노드. x,y = SVG 개략 배치(북쪽 위·동쪽 오른쪽, 축척 무시), lat/lon = OpenStreetMap 좌표.
// 동서남북 순서는 실제와 맞아야 함 — routeNodes.check.mjs가 빌드 때 검사. 노드 추가·이동 시 lat/lon도 같이.
export type NodeKind = "airport" | "stay" | "spot" | "atm";

export const NODES: Record<string, { label: string; kind: NodeKind; x: number; y: number; lat: number; lon: number; labelUp?: boolean }> = {
  atmMovenpick: { label: "VPBank (모벤픽)", kind: "atm", x: 100, y: 96, lat: 12.0447, lon: 109.2055, labelUp: true }, // 모벤픽 리조트 안 CDM, 입구 OSM node 12462618661
  westin: { label: "Westin", kind: "stay", x: 200, y: 140, lat: 12.0331, lon: 109.2127 },
  cxr: { label: "깜라인 공항", kind: "airport", x: 335, y: 205, lat: 11.9983, lon: 109.2174 },
  navy: { label: "Navy Hotel", kind: "stay", x: 95, y: 230, lat: 11.9864, lon: 109.2004 },
};
