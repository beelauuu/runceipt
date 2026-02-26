import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Exchange the authorization code for tokens
  const tokenRes = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text();
    return NextResponse.json(
      { error: "Token exchange failed", detail: body },
      { status: 502 }
    );
  }

  const { access_token } = await tokenRes.json();

  // Store the access token in an httpOnly cookie so client JS can't read it
  const res = NextResponse.redirect(new URL("/receipt", req.nextUrl.origin));
  res.cookies.set("strava_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6, // 6 hours
  });

  return res;
}
