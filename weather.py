"""Open-Meteo 예보(무료·키 없음)를 itinerary.json의 "weather"에 저장. 사용: python weather.py"""
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime

# ponytail: Westin 좌표 한 점만. 나트랑 시내(약 20km)도 같은 예보로 봄 — 지점별 차이 커지면 지점 추가
LAT, LON, PLACE = 12.0331, 109.2127, "깜라인(Westin)"
DAILY = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,uv_index_max"
HOURLY = "weather_code,temperature_2m,precipitation_probability,precipitation"
WEB_DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web", "src", "data", "itinerary.json")


def fetch_weather(trip: dict) -> dict:
    """trip.start~end 날짜별 일 요약 + 시간별(0~23시, 현지) 예보. 예보 범위(약 16일) 밖이면 API가 400."""
    q = urllib.parse.urlencode({
        "latitude": LAT, "longitude": LON, "daily": DAILY, "hourly": HOURLY,
        "timezone": trip["tz"], "start_date": str(trip["start"])[:10], "end_date": str(trip["end"])[:10],
    })
    with urllib.request.urlopen(f"https://api.open-meteo.com/v1/forecast?{q}", timeout=15) as r:
        raw = json.load(r)
    d, h = raw["daily"], raw["hourly"]
    days = []
    for i, date in enumerate(d["time"]):
        hours = [k for k, t in enumerate(h["time"]) if t.startswith(date)]
        days.append({
            "date": date,
            "code": d["weather_code"][i],
            "t_max": d["temperature_2m_max"][i],
            "t_min": d["temperature_2m_min"][i],
            "rain_prob": d["precipitation_probability_max"][i],
            "rain_mm": d["precipitation_sum"][i],
            "wind_kmh": d["wind_speed_10m_max"][i],
            "uv": d["uv_index_max"][i],
            # 인덱스 = 현지 시(0~23)
            "hourly": [{
                "code": h["weather_code"][k],
                "temp": h["temperature_2m"][k],
                "rain_prob": h["precipitation_probability"][k],
                "rain_mm": h["precipitation"][k],
            } for k in hours],
        })
    return {
        "place": PLACE,
        "source": "Open-Meteo",
        "fetched_at": datetime.now().astimezone().strftime("%Y-%m-%d %H:%M %Z"),
        "days": days,
    }


def main():
    with open(WEB_DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)
    data["weather"] = fetch_weather(data["trip"])
    with open(WEB_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    for day in data["weather"]["days"]:
        print(f'{day["date"]} {day["t_min"]}~{day["t_max"]}°C 강수 {day["rain_prob"]}% {day["rain_mm"]}mm')


if __name__ == "__main__":
    sys.exit(main())
