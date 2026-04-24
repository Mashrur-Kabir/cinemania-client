import { getWatchedHistory } from "@/services/user.services";
import Pagination from "@/components/shared/pagination/Pagination";
import DiaryEntry from "./DiaryEntry";
import { IDiaryEntry } from "@/types/dashboard.types";

export default async function HistoryTimeline({ page }: { page: number }) {
  const limit = 5;

  const response = await getWatchedHistory({ page, limit });

  const history = response.data;
  const meta = response.meta;

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-32 opacity-20 animate-in fade-in duration-700">
        <p className="text-4xl font-black uppercase tracking-tighter italic">
          The timeline is empty.
        </p>
        <p className="text-sm font-bold tracking-widest mt-2">
          LOG A MOVIE TO START YOUR DIARY
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((entry: IDiaryEntry, i: number) => (
        <DiaryEntry key={entry.id} entry={entry} index={i} />
      ))}

      {meta && meta.totalPages > 1 && (
        <div className="mt-24 flex justify-center pb-20 relative z-50">
          <Pagination meta={meta} />
        </div>
      )}
    </div>
  );
}
