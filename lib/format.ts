import { UnitSystem } from "./receiptOptions";

/** Convert meters to miles, formatted to 2 decimal places */
export function metersToMiles(meters: number): string {
  return (meters / 1609.344).toFixed(2);
}

/** Convert total seconds to H:MM:SS string */
export function secondsToHMS(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Convert m/s to min/mile pace string (e.g. "8:32") */
export function mpsToMinPerMile(mps: number): string {
  if (mps === 0) return "--";
  const secondsPerMile = 1609.344 / mps;
  const mins = Math.floor(secondsPerMile / 60);
  const secs = Math.round(secondsPerMile % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/** Format an ISO date string to a short date like "Jan 15" */
export function formatShortDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Convert meters to distance string (miles or km), 2 decimal places */
export function metersToDistance(meters: number, unit: UnitSystem): string {
  if (unit === "imperial") {
    return (meters / 1609.344).toFixed(2);
  }
  return (meters / 1000).toFixed(2);
}

/** Convert m/s to min/mile or min/km pace string (e.g. "8:32") */
export function mpsToMinPerUnit(mps: number, unit: UnitSystem): string {
  if (mps === 0) return "--";
  const metersPerUnit = unit === "imperial" ? 1609.344 : 1000;
  const secondsPerUnit = metersPerUnit / mps;
  const mins = Math.floor(secondsPerUnit / 60);
  const secs = Math.round(secondsPerUnit % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/** Convert meters of elevation to formatted string (ft or m) */
export function metersToElevation(meters: number, unit: UnitSystem): string {
  if (unit === "imperial") {
    return `${Math.round(meters * 3.28084).toLocaleString()} ft`;
  }
  return `${Math.round(meters).toLocaleString()} m`;
}

/** Distance unit label */
export function distanceLabel(unit: UnitSystem): string {
  return unit === "imperial" ? "mi" : "km";
}

/** Pace unit label */
export function paceLabel(unit: UnitSystem): string {
  return unit === "imperial" ? "/mi" : "/km";
}

/** Convert m/s to mph or kph speed string (for cycling) */
export function mpsToSpeedPerUnit(mps: number, unit: UnitSystem): string {
  if (mps === 0) return "--";
  if (unit === "imperial") {
    return (mps * 2.23694).toFixed(1);
  }
  return (mps * 3.6).toFixed(1);
}

/** Speed unit label for cycling */
export function speedLabel(unit: UnitSystem): string {
  return unit === "imperial" ? "mph" : "kph";
}
