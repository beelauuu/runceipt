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

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

export async function fetchActivities(token: string): Promise<StravaActivity[]> {
  const url = `${STRAVA_API_BASE}/athlete/activities?per_page=100`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Strava API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<StravaActivity[]>;
}
