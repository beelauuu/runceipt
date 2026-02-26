import { NextRequest, NextResponse } from "next/server";
import { fetchActivities } from "@/lib/strava";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("strava_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const activities = await fetchActivities(token);
  return NextResponse.json(activities);
}
