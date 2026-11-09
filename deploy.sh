#!/bin/sh
# 마스킹한 빌드를 GitHub Pages(gh-pages)로 배포. 날짜→DayN, 편명 제거. 원본 json은 항상 복구.
# 여행 날짜·편명은 이 파일에 쓰지 않음 — itinerary.json의 trip.start/end/flights에서 읽음 (공개 repo).
set -eu
REPO=heesung6701/nt-trip-bd9bp7a4
J=$(pwd)/web/src/data/itinerary.json
T=$(mktemp -d)
cp "$J" "$T/orig.json"
trap 'cp "$T/orig.json" "$J"' EXIT
python3 - "$J" "$T/sensitive.txt" <<'PY'
import datetime as dt, json, re, sys
p, out = sys.argv[1], sys.argv[2]
s = open(p, encoding="utf-8").read()
trip = json.loads(s)["trip"]
start, end = (dt.date.fromisoformat(trip[k][:10]) for k in ("start", "end"))
nos = [f["no"] for f in trip["flights"] if f.get("no")]
dates = [start + dt.timedelta(i) for i in range(-1, (end - start).days + 2)]  # 앞뒤 하루 여유
day = {(d.month, d.day): f"Day{(d - start).days + 1}" for d in dates}  # 출발일 = Day1

def sub(pat, fmt):
    global s
    s = re.sub(pat, lambda m: fmt(m) if (int(m["m"]), int(m["d"])) in day else m[0], s)

s = re.sub(r'"no": "[^"]*"', '"no": ""', s)
sub(r"\d{4}-(?P<m>\d{2})-(?P<d>\d{2})", lambda m: day[int(m["m"]), int(m["d"])])
sub(r"(?P<m>\d{1,2})/(?P<d>\d{1,2})~(?P<d2>\d{1,2})",
    lambda m: f'{day[int(m["m"]), int(m["d"])]}~{day.get((int(m["m"]), int(m["d2"])), m["d2"])}')
for pat in (r"(?<![\d-])(?P<m>\d{1,2})-(?P<d>\d{2})(?![\d-])", r"(?P<m>\d{1,2})/(?P<d>\d{1,2})", r"(?P<m>\d{1,2})월 ?(?P<d>\d{1,2})일"):
    sub(pat, lambda m: day[int(m["m"]), int(m["d"])])
open(p, "w", encoding="utf-8").write(s)

# 빌드 결과에 남으면 안 되는 문자열 (grep -F 패턴)
pats = {f"{start:%Y-%m}", *nos}
for d in dates:
    pats |= {f"{d.month}/{d.day}", f"{d.month}월 {d.day}일", f"{d.month}월{d.day}일"}
open(out, "w", encoding="utf-8").write("\n".join(sorted(pats)) + "\n")
PY
(cd web && npm run build >/dev/null)
if grep -qFf "$T/sensitive.txt" web/dist/index.html || grep -qE '@[a-z]+\.(com|net)' web/dist/index.html; then
  echo "마스킹 실패: 민감 문자열 남음 — 소스에 여행 날짜·편명을 직접 쓰지 말고 DayN으로" >&2; exit 1
fi
mkdir "$T/site"
cp web/dist/index.html "$T/site/index.html"
touch "$T/site/.nojekyll"
cd "$T/site"
# 히스토리 안 남김: 매번 새 repo로 커밋 1개만 force push
git init -q -b main
git add -A
git -c user.name=heesung6701 -c user.email=heesung6701@users.noreply.github.com commit -qm "Update site"
git push -q -f "https://github.com/$REPO.git" main:gh-pages
echo "배포 완료: https://heesung6701.github.io/nt-trip-bd9bp7a4/"
