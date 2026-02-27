import { StravaActivity, getActivityCategory } from "@/lib/strava";
import {
  metersToDistance,
  mpsToMinPerUnit,
  mpsToSpeedPerUnit,
  distanceLabel,
  paceLabel,
  speedLabel,
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
  const category = getActivityCategory(activity.sport_type);

  function renderPace() {
    if (category === "ride") {
      return `${mpsToSpeedPerUnit(activity.average_speed, unitSystem)} ${speedLabel(unitSystem)}`;
    }
    if (category === "run") {
      return `${mpsToMinPerUnit(activity.average_speed, unitSystem)}${paceLabel(unitSystem)}`;
    }
    return "--";
  }

  return (
    <div className="flex text-xs font-mono py-0.5">
      <span className={`flex-1 mx-1.5 ${truncateTitle ? "truncate" : "wrap-break-word"}`}>{activity.name}</span>
      <span className="shrink-0 w-14 text-right">
        {distance}&nbsp;{unit}
      </span>
      {showPace && (
        <span className="shrink-0 w-16 text-right">
          {renderPace()}
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
