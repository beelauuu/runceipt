// Fake receipt snapshots for wallpaper tiles
const FAKE_RECEIPTS = [
  {
    heading: "Sarah's Monthly Summary",
    sport: "run",
    activities: [
      { name: "Morning 5K", dist: "3.10 mi" },
      { name: "Sunday Long Run", dist: "10.20 mi" },
      { name: "Track Tuesday", dist: "5.00 mi" },
    ],
    totalCount: 8,
    totalDist: "28.4 mi",
    longest: "12.30 mi",
  },
  {
    heading: "Mike's 3-Month Summary",
    sport: "run",
    activities: [
      { name: "Easy Recovery", dist: "2.50 mi" },
      { name: "Half Marathon", dist: "13.10 mi" },
      { name: "Speed Work", dist: "4.00 mi" },
    ],
    totalCount: 34,
    totalDist: "142.6 mi",
    longest: "13.10 mi",
  },
  {
    heading: "Alex's Weekly Summary",
    sport: "ride",
    activities: [
      { name: "Zwift Group Ride", dist: "18.40 mi" },
      { name: "Gravel Grind", dist: "42.10 mi" },
      { name: "Recovery Spin", dist: "12.00 mi" },
    ],
    totalCount: 4,
    totalDist: "89.3 mi",
    longest: "42.10 mi",
  },
  {
    heading: "Jordan's Monthly Summary",
    sport: "swim",
    activities: [
      { name: "Morning Laps", dist: "1,800 yd" },
      { name: "Open Water OW", dist: "2,200 yd" },
      { name: "Drills Session", dist: "1,400 yd" },
    ],
    totalCount: 10,
    totalDist: "16,400 yd",
    longest: "2,200 yd",
  },
  {
    heading: "Casey's 3-Month Summary",
    sport: "ride",
    activities: [
      { name: "Tour de Neighborhood", dist: "28.50 mi" },
      { name: "Climb Everything", dist: "55.20 mi" },
      { name: "Coffee Shop Sprint", dist: "14.80 mi" },
    ],
    totalCount: 22,
    totalDist: "684.2 mi",
    longest: "78.40 mi",
  },
  {
    heading: "Riley's Weekly Summary",
    sport: "run",
    activities: [
      { name: "Lunch Break Jog", dist: "3.50 mi" },
      { name: "Trail Ramble", dist: "7.20 mi" },
      { name: "Fartlek Friday", dist: "5.10 mi" },
    ],
    totalCount: 5,
    totalDist: "21.8 mi",
    longest: "7.20 mi",
  },
  {
    heading: "Morgan's Monthly Summary",
    sport: "swim",
    activities: [
      { name: "Masters Practice", dist: "3,000 yd" },
      { name: "Easy Freestyle", dist: "2,000 yd" },
      { name: "Threshold Set", dist: "2,500 yd" },
    ],
    totalCount: 14,
    totalDist: "38,500 yd",
    longest: "3,200 yd",
  },
];

// Pre-computed tile positions: top%, left%, rotate(deg), which fake receipt to use
const WALLPAPER_TILES = [
  { top: -2, left: -4, rotate: -6, dataIndex: 0 },
  { top: -3, left: 18, rotate: 4, dataIndex: 1 },
  { top: -1, left: 38, rotate: -3, dataIndex: 2 },
  { top: -4, left: 58, rotate: 7, dataIndex: 3 },
  { top: -2, left: 78, rotate: -5, dataIndex: 4 },
  { top: -3, left: 96, rotate: 3, dataIndex: 5 },
  { top: 22, left: -5, rotate: 5, dataIndex: 6 },
  { top: 20, left: 15, rotate: -4, dataIndex: 3 },
  { top: 23, left: 35, rotate: 6, dataIndex: 4 },
  { top: 21, left: 55, rotate: -7, dataIndex: 0 },
  { top: 22, left: 74, rotate: 4, dataIndex: 1 },
  { top: 20, left: 93, rotate: -6, dataIndex: 2 },
  { top: 50, left: -3, rotate: -3, dataIndex: 5 },
  { top: 48, left: 17, rotate: 7, dataIndex: 6 },
  { top: 51, left: 57, rotate: -5, dataIndex: 2 },
  { top: 49, left: 76, rotate: 3, dataIndex: 3 },
  { top: 50, left: 95, rotate: -4, dataIndex: 4 },
  { top: 73, left: -4, rotate: 6, dataIndex: 1 },
  { top: 72, left: 16, rotate: -5, dataIndex: 5 },
  { top: 74, left: 36, rotate: 4, dataIndex: 6 },
  { top: 71, left: 56, rotate: -6, dataIndex: 0 },
  { top: 73, left: 75, rotate: 5, dataIndex: 3 },
  { top: 72, left: 94, rotate: -3, dataIndex: 4 },
];

const SPORT_LABELS: Record<string, { count: string; footer: string }> = {
  run:  { count: "TOTAL RUNS",  footer: "THANK YOU FOR RUNNING" },
  ride: { count: "TOTAL RIDES", footer: "THANK YOU FOR RIDING" },
  swim: { count: "TOTAL SWIMS", footer: "THANK YOU FOR SWIMMING" },
};

function MiniReceipt({ data }: { data: (typeof FAKE_RECEIPTS)[0] }) {
  const labels = SPORT_LABELS[data.sport] ?? SPORT_LABELS.run;

  return (
    <div
      className="w-48 bg-white rounded-sm shadow-md px-3 py-3 font-mono select-none"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Header */}
      <div className="text-center mb-2">
        <div className="text-sm font-bold tracking-widest">RUNCEIPT</div>
        <div className="text-[9px] text-gray-400">{data.heading}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 mb-2" />

      {/* Activity rows */}
      {data.activities.map((act, i) => (
        <div key={i} className="flex justify-between text-[8.5px] text-gray-600 leading-relaxed">
          <span className="truncate mr-1">{act.name}</span>
          <span className="shrink-0">{act.dist}</span>
        </div>
      ))}

      {/* Dashed divider */}
      <div className="border-t border-dashed border-gray-300 my-2" />

      {/* Totals */}
      <div className="flex justify-between text-[8px] text-gray-600">
        <span>{labels.count}</span>
        <span>{data.totalCount}</span>
      </div>
      <div className="flex justify-between text-[8px] text-gray-600">
        <span>TOTAL DIST</span>
        <span>{data.totalDist}</span>
      </div>
      <div className="flex justify-between text-[8px] text-gray-600">
        <span>LONGEST</span>
        <span>{data.longest}</span>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 mt-2 pt-2">
        <div className="text-[7.5px] text-gray-400 text-center tracking-wide">
          {labels.footer}
        </div>
      </div>
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main
      className="relative overflow-hidden min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      {/* Wallpaper layer */}
      <div className="absolute inset-0 pointer-events-none">
        {WALLPAPER_TILES.map((tile, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${tile.top}%`,
              left: `${tile.left}%`,
              transform: `rotate(${tile.rotate}deg)`,
              opacity: 0.22,
            }}
          >
            <MiniReceipt data={FAKE_RECEIPTS[tile.dataIndex]} />
          </div>
        ))}
      </div>

      {/* Content card */}
      <div
        className="relative z-10 rounded-2xl shadow-xl px-10 py-10 text-center"
        style={{ backgroundColor: "rgba(255,255,255,0.88)", backdropFilter: "blur(6px)" }}
      >
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          RUNCEIPT
        </h1>
        <p className="mt-2 text-gray-600" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
          Your runs, receipt-style.
        </p>

        {error === "denied" && (
          <p className="mt-4 text-sm text-gray-500" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            You cancelled the Strava connection. Try again when you&apos;re ready.
          </p>
        )}

        <a
          href="/api/auth/start"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 px-8 py-4 text-white font-semibold text-lg shadow-md hover:bg-orange-600 transition-colors"
        >
          {/* Strava bolt */}
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

        <p className="mt-4 text-xs text-gray-400">
          We only read your activity data. We never post on your behalf.
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-xs text-gray-400">
        made with love by{" "}
        <a
          href="https://beelau.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600 transition-colors"
        >
          brian
        </a>{" "}
        &amp; claude{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="inline w-3 h-3 text-red-400 -mt-0.5"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </footer>
    </main>
  );
}
