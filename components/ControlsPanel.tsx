"use client";

import { ReceiptOptions, SortOrder, UnitSystem, DateRange } from "@/lib/receiptOptions";
import { StravaActivity } from "@/lib/strava";

interface Props {
  activities: StravaActivity[];
  options: ReceiptOptions;
  onChange: (options: ReceiptOptions) => void;
}

export default function ControlsPanel({ activities, options, onChange }: Props) {
  const allTypes = [...new Set(activities.map((a) => a.sport_type))].sort();

  function update(partial: Partial<ReceiptOptions>) {
    onChange({ ...options, ...partial });
  }

  const minDistOptions = [
    { value: 0, label: "Any" },
    { value: 1, label: options.unitSystem === "metric" ? "2 km" : "1 mi" },
    { value: 3, label: options.unitSystem === "metric" ? "5 km" : "3 mi" },
    { value: 5, label: options.unitSystem === "metric" ? "8 km" : "5 mi" },
    { value: 10, label: options.unitSystem === "metric" ? "16 km" : "10 mi" },
  ];

  const toggleClass = (active: boolean) =>
    `flex-1 py-1 text-xs rounded border transition-colors ${
      active
        ? "bg-black text-white border-black"
        : "bg-white border-gray-300 hover:bg-gray-100"
    }`;

  return (
    <div className="w-80 bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono space-y-4">
      <div className="text-sm font-bold tracking-widest uppercase">Settings</div>

      {/* Date Range */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">
          Date Range
        </div>
        <div className="flex gap-1">
          {(["week", "month", "3months"] as DateRange[]).map((r) => (
            <button
              key={r}
              onClick={() => update({ dateRange: r })}
              className={toggleClass(options.dateRange === r)}
            >
              {r === "week" ? "Week" : r === "month" ? "Month" : "3 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* Min Distance */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">
          Min Distance
        </div>
        <div className="flex gap-1">
          {minDistOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ minDistanceMiles: opt.value })}
              className={toggleClass(options.minDistanceMiles === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Runs */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">
          Max Runs
        </div>
        <div className="flex gap-1">
          {([null, 10, 20, 50] as (number | null)[]).map((n) => (
            <button
              key={n ?? "all"}
              onClick={() => update({ maxRuns: n })}
              className={toggleClass(options.maxRuns === n)}
            >
              {n === null ? "All" : String(n)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Order */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">
          Sort Order
        </div>
        <select
          value={options.sortOrder}
          onChange={(e) => update({ sortOrder: e.target.value as SortOrder })}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white"
        >
          <option value="date">Date</option>
          <option value="longest">Longest</option>
          <option value="fastest">Fastest</option>
        </select>
      </div>

      {/* Unit System */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">
          Units
        </div>
        <div className="flex gap-1">
          {(["imperial", "metric"] as UnitSystem[]).map((u) => (
            <button
              key={u}
              onClick={() => update({ unitSystem: u })}
              className={toggleClass(options.unitSystem === u)}
            >
              {u === "imperial" ? "mi" : "km"}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.showPace ?? false}
            onChange={(e) => update({ showPace: e.target.checked })}
            className="w-3.5 h-3.5"
          />
          <span className="text-xs">Show Pace</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.showHeartRate ?? false}
            onChange={(e) => update({ showHeartRate: e.target.checked })}
            className="w-3.5 h-3.5"
          />
          <span className="text-xs">Show HR</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.truncateTitle ?? true}
            onChange={(e) => update({ truncateTitle: e.target.checked })}
            className="w-3.5 h-3.5"
          />
          <span className="text-xs">Truncate Title</span>
        </label>
      </div>

      {/* Activity Types */}
      {allTypes.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">
            Activity Types
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {allTypes.map((type) => (
              <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.enabledSportTypes?.has(type) ?? false}
                  onChange={(e) => {
                    const next = new Set(options.enabledSportTypes);
                    if (e.target.checked) next.add(type);
                    else next.delete(type);
                    update({ enabledSportTypes: next });
                  }}
                  className="w-3.5 h-3.5"
                />
                <span className="text-xs">{type}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
