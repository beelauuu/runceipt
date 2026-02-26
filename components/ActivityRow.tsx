import { StravaActivity } from "@/lib/strava";
import {
  metersToDistance,
  mpsToMinPerUnit,
  distanceLabel,
  paceLabel,
  formatShortDate,
} from "@/lib/format";
import { ReceiptOptions } from "@/lib/receiptOptions";

interface Props {
  activity: StravaActivity;
  index: number;
  options: Pick<ReceiptOptions, "showPace" | "showHeartRate" | "truncateTitle" | "unitSystem">;
}

export default function ActivityRow({ activity, index, options }: Props) {
  const { showPace, showHeartRate, truncateTitle, unitSystem } = options;
  const distance = metersToDistance(activity.distance, unitSystem);
  const unit = distanceLabel(unitSystem);

  return (
    <div className="flex text-xs font-mono py-0.5">
      <span className={`flex-1 mx-1 ${truncateTitle ? "truncate" : "break-words"}`}>{activity.name}</span>
      <span className="shrink-0 w-14 text-right">
        {distance} {unit}
      </span>
      {showPace && (
        <span className="shrink-0 w-16 text-right">
          {mpsToMinPerUnit(activity.average_speed, unitSystem)}
          {paceLabel(unitSystem)}
        </span>
      )}
      {showHeartRate && (
        <span className="shrink-0 w-12 text-right">
          {activity.average_heartrate ? Math.round(activity.average_heartrate) : "—"}
        </span>
      )}
    </div>
  );
}
