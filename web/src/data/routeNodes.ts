// 이동 그래프 노드. x,y = SVG 개략 배치(북쪽 위·동쪽 오른쪽, 축척 무시), lat/lon = OpenStreetMap 좌표.
// 동서남북 순서는 실제와 맞아야 함 — routeNodes.check.mjs가 빌드 때 검사. 노드 추가·이동 시 lat/lon도 같이.
export type NodeKind = "airport" | "stay" | "spot" | "atm";

export const NODES: Record<string, { label: string; kind: NodeKind; x: number; y: number; lat: number; lon: number; labelUp?: boolean }> = {
  honchong: { label: "혼쫑 해변", kind: "spot", x: 175, y: 30, lat: 12.2728, lon: 109.2066 },
  thapba: { label: "Thap Ba 온천", kind: "spot", x: 50, y: 85, lat: 12.27044, lon: 109.17704 }, // OSM way 397966701 "Bùn khoáng Tháp Bà"
  atmVinmec: { label: "VPBank (Vinmec)", kind: "atm", x: 140, y: 90, lat: 12.2127, lon: 109.2107 }, // 42A Tran Phu, OSM relation 20341892. ponytail: 혼쫑보다 동쪽이지만 TOL 이내라 왼쪽 배치(간선 겹침 회피)
  ocean: { label: "해양학연구소", kind: "spot", x: 265, y: 95, lat: 12.2076, lon: 109.2147 },
  port: { label: "나트랑 항구", kind: "spot", x: 255, y: 205, lat: 12.2057, lon: 109.2148 }, // 꺼우다 선착장
  honmun: { label: "몬섬 해상", kind: "spot", x: 365, y: 290, lat: 12.1667, lon: 109.3049 },
  atmMovenpick: { label: "VPBank (모벤픽)", kind: "atm", x: 100, y: 296, lat: 12.0447, lon: 109.2055, labelUp: true }, // 모벤픽 리조트 안 CDM, 입구 OSM node 12462618661
  westin: { label: "Westin", kind: "stay", x: 200, y: 340, lat: 12.0331, lon: 109.2127 },
  cxr: { label: "깜라인 공항", kind: "airport", x: 335, y: 405, lat: 11.9983, lon: 109.2174 },
  navy: { label: "Navy Hotel", kind: "stay", x: 95, y: 430, lat: 11.9864, lon: 109.2004 },
};
