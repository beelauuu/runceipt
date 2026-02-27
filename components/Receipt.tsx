"use client";

import { StravaActivity, getActivityCategory } from "@/lib/strava";
import {
  metersToDistance,
  secondsToHMS,
  mpsToMinPerUnit,
  mpsToSpeedPerUnit,
  metersToElevation,
  distanceLabel,
  paceLabel,
  speedLabel,
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
    athleteId,
  } = options;

  // Determine activity mode from enabled sport types
  const enabledCats = new Set(
    [...enabledSportTypes].map(getActivityCategory).filter((c) => c !== "other")
  );
  const hasRuns = enabledCats.has("run");
  const hasRides = enabledCats.has("ride");
  const hasSwims = enabledCats.has("swim");
  const isMixed = enabledCats.size > 1;
  const isSingleRide = !isMixed && hasRides;
  const isSingleSwim = !isMixed && hasSwims;
  const isSingleRun = !isMixed && hasRuns;

  const activityKind = isSingleRun ? "Run" : isSingleRide ? "Ride" : isSingleSwim ? "Swim" : "Activity";

  // 1. Date filter
  const now = new Date();
  let rangeStart: Date;
  let rangeLabel: string;
  if (dateRange === "week") {
    rangeStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    rangeLabel = `Weekly ${activityKind}`;
  } else if (dateRange === "month") {
    rangeStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    rangeLabel = `Monthly ${activityKind}`;
  } else {
    rangeStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    rangeLabel = `3-Month ${activityKind}`;
  }

  // Stage 1 — stable aggregates (date + type filter only)
  const baseSet = activities
    .filter((a) => new Date(a.start_date_local) >= rangeStart)
    .filter((a) =>
      enabledSportTypes.size > 0
        ? enabledSportTypes.has(a.sport_type) && a.distance > 0
        : a.distance > 0
    );

  // Stage 2 — row display (add min distance filter)
  let displaySet =
    minDistanceMiles > 0
      ? baseSet.filter((a) => a.distance >= minDistanceMiles * 1609.344)
      : baseSet;

  // Sort displaySet
  if (sortOrder === "date") {
    displaySet = [...displaySet].sort(
      (a, b) =>
        new Date(b.start_date_local).getTime() -
        new Date(a.start_date_local).getTime()
    );
  } else if (sortOrder === "longest") {
    displaySet = [...displaySet].sort((a, b) => b.distance - a.distance);
  } else if (sortOrder === "fastest") {
    displaySet = [...displaySet].sort(
      (a, b) => b.average_speed - a.average_speed
    );
  }

  // Slice for rows
  const displayed = maxRuns !== null ? displaySet.slice(0, maxRuns) : displaySet;

  // Aggregates from baseSet — stable across min distance / max runs / sort changes
  const totalDistanceM = baseSet.reduce((sum, a) => sum + a.distance, 0);
  const totalTimeS = baseSet.reduce((sum, a) => sum + a.moving_time, 0);
  const totalElevM = baseSet.reduce(
    (sum, a) => sum + a.total_elevation_gain,
    0
  );

  const longestRun =
    baseSet.length > 0
      ? baseSet.reduce(
          (best, a) => (a.distance > best.distance ? a : best),
          baseSet[0]
        )
      : null;
  const fastestRun =
    baseSet.length > 0
      ? baseSet.reduce(
          (best, a) => (a.average_speed > best.average_speed ? a : best),
          baseSet[0]
        )
      : null;

  const totalDist = parseFloat(
    metersToDistance(totalDistanceM, unitSystem)
  ).toFixed(1);
  const elevStr = metersToElevation(totalElevM, unitSystem);
  const unit = distanceLabel(unitSystem);

  const runsWithHR = baseSet.filter((a) => a.average_heartrate != null);
  const avgHR =
    runsWithHR.length > 0
      ? Math.round(
          runsWithHR.reduce((sum, a) => sum + (a.average_heartrate ?? 0), 0) /
            runsWithHR.length
        )
      : null;

  const today = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
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
        <div className="text-xs">{subtitle}</div>
        <div className="text-xs text-gray-500">{today} {timeStr}</div>
      </div>

      <Divider />

      {/* Column headers */}
      <div className="flex text-xs font-mono font-bold mb-1">
        <span className="flex-1 mx-1">ACTIVITY</span>
        <span className="shrink-0 w-14 text-right">DIST</span>
        {showPace && <span className="shrink-0 w-16 text-right">{isSingleRide ? "SPEED" : "PACE"}</span>}
        {showHeartRate && <span className="shrink-0 w-12 text-right">HR</span>}
      </div>

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
        {displaySet.length === 0 && (
          <div className="text-xs text-center text-gray-400 py-2">
            No activities found
          </div>
        )}
        {displayed.length < baseSet.length && (
          <div className="text-xs text-center text-gray-400 mt-1">
            + {baseSet.length - displayed.length} more {activityKind.toLowerCase()}s
          </div>
        )}
      </div>

      <Divider dashed />

      {/* Totals + Highlights */}
      <div className="text-xs space-y-1 mb-3">
        <Row label={`TOTAL ${activityKind.toUpperCase()}S`} value={String(baseSet.length)} />
        <Row label="TOTAL DISTANCE" value={`${totalDist} ${unit}`} />
        <Row label="TOTAL TIME" value={secondsToHMS(totalTimeS)} />
        <Row label="TOTAL ELEVATION" value={elevStr} />
        {showHeartRate && avgHR !== null && (
          <Row label="AVG HEART RATE" value={`${avgHR} bpm`} />
        )}
        {longestRun && (
          <Row
            label={`LONGEST ${activityKind.toUpperCase()}`}
            value={`${metersToDistance(longestRun.distance, unitSystem)} ${unit}`}
          />
        )}
        {showPace && fastestRun && (isSingleRun || isSingleRide) && (
          <Row
            label={isSingleRide ? "TOP SPEED" : "FASTEST PACE"}
            value={
              isSingleRide
                ? `${mpsToSpeedPerUnit(fastestRun.average_speed, unitSystem)} ${speedLabel(unitSystem)}`
                : `${mpsToMinPerUnit(fastestRun.average_speed, unitSystem)}${paceLabel(unitSystem)}`
            }
          />
        )}
      </div>

      <Divider />

      {/* Footer */}
      <div className="text-center text-xs space-y-1 mb-4">
        <div>
          {isSingleRide
            ? "THANK YOU FOR RIDING!"
            : isSingleSwim
            ? "THANK YOU FOR SWIMMING!"
            : isMixed
            ? "THANK YOU FOR BEING ACTIVE!"
            : "THANK YOU FOR RUNNING!"}
        </div>
        <div className="text-gray-400">runceipt.beelau.dev</div>
      </div>

      {/* Barcode */}
      <ReceiptBarcode value={athleteId ? `https://www.strava.com/athletes/${athleteId}` : `${totalDist}${unit.toUpperCase()}`} />
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
