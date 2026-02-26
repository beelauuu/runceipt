"use client";

import { StravaActivity } from "@/lib/strava";
import {
  metersToDistance,
  secondsToHMS,
  mpsToMinPerUnit,
  metersToElevation,
  distanceLabel,
  paceLabel,
} from "@/lib/format";
import { ReceiptOptions } from "@/lib/receiptOptions";
import ActivityRow from "./ActivityRow";
import ReceiptBarcode from "./ReceiptBarcode";

interface Props {
  activities: StravaActivity[];
  options: ReceiptOptions;
}

export default function Receipt({ activities, options }: Props) {
  const {
    dateRange,
    minDistanceMiles,
    maxRuns,
    sortOrder,
    showPace,
    showHeartRate,
    unitSystem,
    enabledSportTypes,
  } = options;

  // 1. Date filter
  const now = new Date();
  let rangeStart: Date;
  let rangeLabel: string;
  if (dateRange === "week") {
    rangeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    rangeLabel = "Weekly Run";
  } else if (dateRange === "month") {
    rangeStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    rangeLabel = "Monthly Run";
  } else {
    rangeStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    rangeLabel = "3-Month Run";
  }

  let filtered = activities.filter(
    (a) => new Date(a.start_date_local) >= rangeStart
  );

  // 2. Type filter
  if (enabledSportTypes.size > 0) {
    filtered = filtered.filter(
      (a) => enabledSportTypes.has(a.sport_type) && a.distance > 0
    );
  } else {
    filtered = filtered.filter((a) => a.distance > 0);
  }

  // 3. Min distance
  if (minDistanceMiles > 0) {
    filtered = filtered.filter(
      (a) => a.distance >= minDistanceMiles * 1609.344
    );
  }

  // 4. Sort
  if (sortOrder === "date") {
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(b.start_date_local).getTime() -
        new Date(a.start_date_local).getTime()
    );
  } else if (sortOrder === "longest") {
    filtered = [...filtered].sort((a, b) => b.distance - a.distance);
  } else if (sortOrder === "fastest") {
    filtered = [...filtered].sort((a, b) => b.average_speed - a.average_speed);
  }

  // 5. Slice for display
  const displayed = maxRuns !== null ? filtered.slice(0, maxRuns) : filtered;

  const totalDistanceM = filtered.reduce((sum, a) => sum + a.distance, 0);
  const totalTimeS = filtered.reduce((sum, a) => sum + a.moving_time, 0);
  const totalElevM = filtered.reduce(
    (sum, a) => sum + a.total_elevation_gain,
    0
  );

  const longestRun =
    filtered.length > 0
      ? filtered.reduce(
          (best, a) => (a.distance > best.distance ? a : best),
          filtered[0]
        )
      : null;
  const fastestRun =
    filtered.length > 0
      ? filtered.reduce(
          (best, a) => (a.average_speed > best.average_speed ? a : best),
          filtered[0]
        )
      : null;

  const totalDist = parseFloat(
    metersToDistance(totalDistanceM, unitSystem)
  ).toFixed(1);
  const elevStr = metersToElevation(totalElevM, unitSystem);
  const unit = distanceLabel(unitSystem);

  const runsWithHR = filtered.filter((a) => a.average_heartrate != null);
  const avgHR =
    runsWithHR.length > 0
      ? Math.round(
          runsWithHR.reduce((sum, a) => sum + (a.average_heartrate ?? 0), 0) /
            runsWithHR.length
        )
      : null;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subtitle = options.athleteName
    ? `${options.athleteName}'s ${rangeLabel} Summary`
    : `Your ${rangeLabel} Summary`;

  const rowOptions = { showPace, showHeartRate, truncateTitle: options.truncateTitle, unitSystem };

  return (
    <div
      id="receipt"
      className="bg-white text-black font-mono w-80 mx-auto p-6 shadow-lg"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-xl font-bold tracking-widest">RUNCEIPT</div>
        <div className="text-xs mt-1">{subtitle}</div>
        <div className="text-xs text-gray-500">{today}</div>
      </div>

      <Divider />

      {/* Activity line items */}
      <div className="mb-2">
        {displayed.map((activity, i) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            index={i}
            options={rowOptions}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-xs text-center text-gray-400 py-2">
            No activities found
          </div>
        )}
      </div>

      <Divider dashed />

      {/* Totals */}
      <div className="text-xs space-y-1 mb-3">
        <Row label="TOTAL RUNS" value={String(filtered.length)} />
        <Row label="TOTAL DISTANCE" value={`${totalDist} ${unit}`} />
        <Row label="TOTAL TIME" value={secondsToHMS(totalTimeS)} />
        <Row label="TOTAL ELEVATION" value={elevStr} />
        {showHeartRate && avgHR !== null && (
          <Row label="AVG HEART RATE" value={`${avgHR} bpm`} />
        )}
      </div>

      <Divider dashed />

      {/* Highlights */}
      <div className="text-xs space-y-1 mb-3">
        <div className="font-bold text-center text-xs mb-1">-- HIGHLIGHTS --</div>
        {longestRun && (
          <Row
            label="LONGEST RUN"
            value={`${metersToDistance(longestRun.distance, unitSystem)} ${unit}`}
          />
        )}
        {fastestRun && (
          <Row
            label="FASTEST PACE"
            value={`${mpsToMinPerUnit(fastestRun.average_speed, unitSystem)}${paceLabel(unitSystem)}`}
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
      <ReceiptBarcode value={`${totalDist}${unit.toUpperCase()}`} />
      <div className="text-center text-xs text-gray-400 mt-1">
        {totalDist} {unit.toUpperCase()}
      </div>
    </div>
  );
}

function Divider({ dashed }: { dashed?: boolean }) {
  return (
    <div
      className={`border-t my-2 ${dashed ? "border-dashed" : ""} border-gray-400`}
    />
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
