export default function Home() {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/callback`;

  const stravaAuthUrl =
    `https://www.strava.com/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&approval_prompt=auto` +
    `&scope=read,activity:read`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight font-mono">STRAVACEIPT</h1>
        <p className="mt-2 text-gray-600">Your monthly runs, receipt-style.</p>
      </div>

      <a
        href={stravaAuthUrl}
        className="inline-flex items-center gap-3 rounded-full bg-orange-500 px-8 py-4 text-white font-semibold text-lg shadow-md hover:bg-orange-600 transition-colors"
      >
        {/* Strava logo mark — an inline SVG "S" bolt */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
        </svg>
        Connect with Strava
      </a>

      <p className="text-xs text-gray-400">
        We only read your activity data. We never post on your behalf.
      </p>
    </main>
  );
}
