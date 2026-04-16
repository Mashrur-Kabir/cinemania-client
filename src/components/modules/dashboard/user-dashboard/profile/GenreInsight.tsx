// src/components/modules/dashboard/profile/GenreInsight.tsx
import GenreBar from "../overview/GenreBar";
import { IUserProfileStats } from "@/types/user.types";

export default async function GenreInsight({
  genres,
}: {
  genres: IUserProfileStats["genres"];
}) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 h-full">
      <h3 className="text-xl font-black uppercase tracking-tighter mb-8">
        Cinematic Taste
      </h3>
      <div className="space-y-8">
        {genres.map((genre, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {genre.name}
              </span>
              <span className="text-xs font-black text-primary italic">
                {genre.percentage}%
              </span>
            </div>
            <GenreBar percent={genre.percentage} />
          </div>
        ))}
      </div>
    </div>
  );
}
