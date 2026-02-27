import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000")
  );
  res.cookies.delete("strava_token");
  res.cookies.delete("strava_refresh_token");
  res.cookies.delete("strava_expires_at");
  return res;
}
