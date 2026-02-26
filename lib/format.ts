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
