// src/components/modules/dashboard/profile/GenreInsight.tsx
import { getMyProfile } from "@/services/user.services";
import GenreBar from "../overview/GenreBar";

export default async function GenreInsight() {
  const { data } = await getMyProfile();
  const topGenres = data.genres || [];

  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 h-full">
      <h3 className="text-xl font-black uppercase tracking-tighter mb-8">
        Cinematic Taste
      </h3>

      <div className="space-y-8">
        {topGenres.map((genre, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {genre.name}
              </span>
              <span className="text-xs font-black text-primary italic">
                {genre.percentage}%
              </span>
            </div>

            {/* Custom Progress Bar */}
            <GenreBar percent={genre.percentage} />

            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {genre.count} Titles Watched
            </p>
          </div>
        ))}
      </div>

      {topGenres.length === 0 && (
        <p className="text-sm text-muted-foreground italic text-center py-20">
          Not enough data to map your taste yet.
        </p>
      )}
    </div>
  );
}
