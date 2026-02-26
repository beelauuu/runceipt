import { NextRequest, NextResponse } from "next/server";
import { fetchActivities, refreshAccessToken, StravaApiError } from "@/lib/strava";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function GET(req: NextRequest) {
  let token = req.cookies.get("strava_token")?.value;
  const refreshToken = req.cookies.get("strava_refresh_token")?.value;
  const expiresAt = Number(req.cookies.get("strava_expires_at")?.value ?? 0);

  if (!token || !refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Refresh the access token if it expires within 5 minutes
  let newTokens = null;
  if (Date.now() / 1000 > expiresAt - 300) {
    try {
      newTokens = await refreshAccessToken(refreshToken);
      token = newTokens.access_token;
    } catch {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  }

  const after = Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60;
  let activities;
  try {
    activities = await fetchActivities(token, after);
  } catch (err) {
    if (err instanceof StravaApiError && err.status === 401) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    throw err;
  }

  const response = NextResponse.json(activities);

  if (newTokens) {
    response.cookies.set("strava_token", newTokens.access_token, COOKIE_OPTS);
    response.cookies.set("strava_refresh_token", newTokens.refresh_token, COOKIE_OPTS);
    response.cookies.set("strava_expires_at", String(newTokens.expires_at), COOKIE_OPTS);
  }

  return response;
}
