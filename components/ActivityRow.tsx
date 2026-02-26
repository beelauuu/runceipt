import { StravaActivity } from "@/lib/strava";
import { metersToMiles, formatShortDate } from "@/lib/format";

interface Props {
  activity: StravaActivity;
  index: number;
}

export default function ActivityRow({ activity, index }: Props) {
  const miles = metersToMiles(activity.distance);
  const date = formatShortDate(activity.start_date_local);

  return (
    <div className="flex justify-between text-xs font-mono py-0.5">
      <span className="flex-1 mx-1 truncate">{activity.name}</span>
      <span className="shrink-0 text-right">{date}</span>
      <span className="shrink-0 w-16 text-right">{miles} mi</span>
    </div>
  );
}
