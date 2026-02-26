import { NextRequest, NextResponse } from "next/server";
import { fetchAthlete } from "@/lib/strava";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("strava_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const athlete = await fetchAthlete(token);
  return NextResponse.json({ firstname: athlete.firstname, id: athlete.id });
}
