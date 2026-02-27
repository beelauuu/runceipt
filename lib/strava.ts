export const RUN_SPORT_TYPES = ["Run", "VirtualRun", "TrailRun"] as const;
export const RIDE_SPORT_TYPES = ["Ride", "VirtualRide", "GravelRide", "EBikeRide", "MountainBikeRide"] as const;
export const SWIM_SPORT_TYPES = ["Swim", "OpenWaterSwim"] as const;
export const SUPPORTED_SPORT_TYPES = new Set<string>([
  ...RUN_SPORT_TYPES,
  ...RIDE_SPORT_TYPES,
  ...SWIM_SPORT_TYPES,
]);

export type ActivityCategory = "run" | "ride" | "swim" | "other";

export function getActivityCategory(sportType: string): ActivityCategory {
  if ((RUN_SPORT_TYPES as readonly string[]).includes(sportType)) return "run";
  if ((RIDE_SPORT_TYPES as readonly string[]).includes(sportType)) return "ride";
  if ((SWIM_SPORT_TYPES as readonly string[]).includes(sportType)) return "swim";
  return "other";
}

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

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp (seconds)
}

export class StravaApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "StravaApiError";
  }
}

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

export async function fetchActivities(token: string, after?: number): Promise<StravaActivity[]> {
  const all: StravaActivity[] = [];
  let pageNum = 1;

  while (true) {
    const params = new URLSearchParams({ per_page: "200", page: String(pageNum) });
    if (after !== undefined) params.set("after", String(after));
    const url = `${STRAVA_API_BASE}/athlete/activities?${params}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      throw new StravaApiError(res.status, `Strava API error: ${res.status} ${res.statusText}`);
    }

    const batch = (await res.json()) as StravaActivity[];
    all.push(...batch);
    if (batch.length < 200) break;
    pageNum++;
  }

  return all;
}

export async function fetchAthlete(token: string): Promise<StravaAthlete> {
  const url = `${STRAVA_API_BASE}/athlete`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new StravaApiError(res.status, `Strava API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<StravaAthlete>;
}

export async function refreshAccessToken(refreshToken: string): Promise<StravaTokens> {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
  };
}
