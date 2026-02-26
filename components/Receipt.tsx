"use client";

import { StravaActivity } from "@/lib/strava";
import { metersToMiles, secondsToHMS, mpsToMinPerMile } from "@/lib/format";
import ActivityRow from "./ActivityRow";
import ReceiptBarcode from "./ReceiptBarcode";

interface Props {
  activities: StravaActivity[];
}

export default function Receipt({ activities }: Props) {
  const runs = activities.filter(
    (a) => (a.sport_type === "Run" || a.type === "Run") && a.distance > 0
  );

  console.log(runs);

  const totalDistanceM = runs.reduce((sum, a) => sum + a.distance, 0);
  const totalTimeS = runs.reduce((sum, a) => sum + a.moving_time, 0);
  const totalElevM = runs.reduce((sum, a) => sum + a.total_elevation_gain, 0);

  const longestRun = runs.reduce(
    (best, a) => (a.distance > (best?.distance ?? 0) ? a : best),
    runs[0]
  );
  const fastestRun = runs.reduce(
    (best, a) => (a.average_speed > (best?.average_speed ?? 0) ? a : best),
    runs[0]
  );

  const totalMiles = parseFloat(metersToMiles(totalDistanceM)).toFixed(1);
  const totalElevFt = Math.round(totalElevM * 3.28084);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      id="receipt"
      className="bg-white text-black font-mono w-80 mx-auto p-6 shadow-lg"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xl font-bold tracking-widest">RUNCEIPT</div>
        <div className="text-xs mt-1">Your Monthly Run Summary</div>
        <div className="text-xs text-gray-500">{today}</div>
      </div>

      <Divider />

      {/* Activity line items */}
      <div className="mb-2">
        {runs.slice(0, 100).map((activity, i) => (
          <ActivityRow key={activity.id} activity={activity} index={i} />
        ))}
        {runs.length > 100 && (
          <div className="text-xs text-center text-gray-400 mt-1">
            + {runs.length - 100} more runs
          </div>
        )}
      </div>

      <Divider dashed />

      {/* Totals */}
      <div className="text-xs space-y-1 mb-3">
        <Row label="TOTAL RUNS" value={String(runs.length)} />
        <Row label="TOTAL DISTANCE" value={`${totalMiles} mi`} />
        <Row label="TOTAL TIME" value={secondsToHMS(totalTimeS)} />
        <Row label="TOTAL ELEVATION" value={`${totalElevFt.toLocaleString()} ft`} />
      </div>

      <Divider dashed />

      {/* Highlights */}
      <div className="text-xs space-y-1 mb-3">
        <div className="font-bold text-center text-xs mb-1">-- HIGHLIGHTS --</div>
        {longestRun && (
          <Row
            label="LONGEST RUN"
            value={`${metersToMiles(longestRun.distance)} mi`}
          />
        )}
        {fastestRun && (
          <Row
            label="FASTEST PACE"
            value={`${mpsToMinPerMile(fastestRun.average_speed)} /mi`}
          />
        )}
      </div>

      <Divider />

      {/* Footer */}
      <div className="text-center text-xs space-y-1 mb-4">
        <div>Thank you for running!</div>
        <div className="text-gray-400">runceipt.vercel.app</div>
      </div>

      {/* Barcode */}
      <ReceiptBarcode value={`${totalMiles}MI`} />
      <div className="text-center text-xs text-gray-400 mt-1">{totalMiles} MILES</div>
    </div>
  );
}

function Divider({ dashed }: { dashed?: boolean }) {
  return (
    <div className={`border-t my-2 ${dashed ? "border-dashed" : ""} border-gray-400`} />
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
