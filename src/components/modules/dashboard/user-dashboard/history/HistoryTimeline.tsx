// src/components/modules/dashboard/user-dashboard/history/HistoryTimeline.tsx
import { getWatchedHistory } from "@/services/userDashboard.services";
import DiaryEntry from "./DiaryEntry";

export default async function HistoryTimeline() {
  const { data: history } = await getWatchedHistory();

  if (!history?.length) {
    return (
      <div className="text-center py-20 opacity-30">
        <p className="text-xl font-bold text-white">Your diary is empty.</p>
        <p className="text-sm text-muted-foreground">
          Log your first movie to start the timeline.
        </p>
      </div>
    );
  }

  return (
    <>
      {history.map((entry, i) => (
        <DiaryEntry key={entry.id} entry={entry} index={i} />
      ))}
    </>
  );
}
