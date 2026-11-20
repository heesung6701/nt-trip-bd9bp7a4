export interface Flight {
  airline: string;
  no: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  cabin?: string;
}

export interface Item {
  start: string;
  end: string;
  title: string;
  kind: string;
  place: string;
  cost_krw: number;
}

export interface Day {
  date: string;
  items: Item[];
}

export interface Itinerary {
  days: Day[];
  rain_alternatives: string[];
  budget_total_krw: number;
}

export interface StayCandidate {
  name: string;
  region: string;
  price_krw_per_night: number;
  reason: string;
}

export interface StaySegment {
  check_in: string;
  check_out: string;
  name?: string;
  recommended_region?: string;
  candidates?: StayCandidate[];
}

export interface Activity {
  name: string;
  region: string;
  duration_min: number;
  cost_krw: number;
  indoor: boolean;
  recommended_time: string;
}

export interface Food {
  name: string;
  region: string;
  meal_type: string;
  cost_krw: number;
  note: string;
}

export interface TransportLeg {
  description: string;
  method: string;
  cost_krw: number;
}

export interface Prep {
  checklist: string[];
  weather_note: string;
}

export interface WeatherHour {
  code: number;
  temp: number;
  rain_prob: number;
  rain_mm: number;
}

export interface WeatherDay {
  date: string;
  code: number;
  t_max: number;
  t_min: number;
  rain_prob: number;
  rain_mm: number;
  wind_kmh: number;
  uv: number;
  hourly: WeatherHour[]; // 인덱스 = 현지 시(0~23)
}

export interface Weather {
  place: string;
  source: string;
  fetched_at: string;
  days: WeatherDay[];
}

export interface TripData {
  trip: {
    destination: string;
    start: string;
    end: string;
    tz: string;
    travelers: number;
    request: string;
    flights: Flight[];
  };
  warnings: string[];
  errors: string[];
  itinerary: Itinerary | null;
  stay: StaySegment[] | null;
  activities: Activity[] | null;
  food: Food[] | null;
  transport: Record<string, TransportLeg> | null;
  prep: Prep | null;
  weather?: Weather | null;
}
