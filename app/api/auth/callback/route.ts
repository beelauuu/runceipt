import { NextRequest, NextResponse } from "next/server";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function GET(req: NextRequest) {
  // User denied authorization on the Strava screen
  if (req.nextUrl.searchParams.get("error")) {
    return NextResponse.redirect(new URL("/?error=denied", req.nextUrl.origin));
  }

  // Verify CSRF state token
  const stateParam = req.nextUrl.searchParams.get("state");
  const stateCookie = req.cookies.get("strava_oauth_state")?.value;
  if (!stateParam || !stateCookie || stateParam !== stateCookie) {
    return NextResponse.redirect(new URL("/?error=denied", req.nextUrl.origin));
  }

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

  const { access_token, refresh_token, expires_at } = await tokenRes.json();

  // Store tokens in httpOnly cookies so client JS can't read them
  const res = NextResponse.redirect(new URL("/receipt", req.nextUrl.origin));
  res.cookies.set("strava_token", access_token, COOKIE_OPTS);
  res.cookies.set("strava_refresh_token", refresh_token, COOKIE_OPTS);
  res.cookies.set("strava_expires_at", String(expires_at), COOKIE_OPTS);
  res.cookies.delete("strava_oauth_state");

  return res;
}
