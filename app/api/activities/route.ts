import { NextRequest, NextResponse } from "next/server";
import { fetchActivities } from "@/lib/strava";
import { readCache, writeCache } from "@/lib/cache";
import type { StravaActivity } from "@/lib/strava";

const CACHE_KEY = "activities";
const ONE_HOUR_MS = 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("strava_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Return cached data if it's less than 1 hour old
  const cached = readCache<StravaActivity[]>(CACHE_KEY, ONE_HOUR_MS);
  // if (cached) {
  //   console.log("Returning cached activities");
  //   return NextResponse.json(cached);
  // }

  const activities = await fetchActivities(token);
  writeCache(CACHE_KEY, activities);

  return NextResponse.json(activities);
}
