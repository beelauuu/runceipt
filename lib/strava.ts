export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date_local: string; // ISO 8601
  distance: number;         // meters
  moving_time: number;      // seconds
  elapsed_time: number;     // seconds
  total_elevation_gain: number; // meters
  average_speed: number;    // m/s
  max_speed: number;        // m/s
  average_heartrate?: number;
  max_heartrate?: number;
}

export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
}

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

export async function fetchActivities(token: string, after?: number): Promise<StravaActivity[]> {
  const params = new URLSearchParams({ per_page: "200" });
  if (after !== undefined) params.set("after", String(after));
  const url = `${STRAVA_API_BASE}/athlete/activities?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Strava API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<StravaActivity[]>;
}

export async function fetchAthlete(token: string): Promise<StravaAthlete> {
  const url = `${STRAVA_API_BASE}/athlete`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Strava API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<StravaAthlete>;
}
