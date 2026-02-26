export type SortOrder = "date" | "longest" | "fastest";
export type UnitSystem = "imperial" | "metric";
export type DateRange = "week" | "month" | "3months";

export interface ReceiptOptions {
  dateRange: DateRange;           // client-side date filter
  minDistanceMiles: number;       // 0 = no filter; set via preset buttons
  maxRuns: number | null;         // null = unlimited; set via preset buttons
  sortOrder: SortOrder;
  showPace: boolean;
  showHeartRate: boolean;
  truncateTitle: boolean;
  unitSystem: UnitSystem;
  enabledSportTypes: Set<string>; // populated after activities load
  athleteName: string | null;
  athleteId: number | null;
}

export const DEFAULT_OPTIONS: ReceiptOptions = {
  dateRange: "month",
  minDistanceMiles: 0,
  maxRuns: null,
  sortOrder: "date",
  showPace: false,
  showHeartRate: false,
  truncateTitle: true,
  unitSystem: "imperial",
  enabledSportTypes: new Set(),
  athleteName: null,
  athleteId: null,
};
