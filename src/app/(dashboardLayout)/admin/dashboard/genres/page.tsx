import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllGenres } from "@/services/genre.services";
import GenreTable from "@/components/modules/dashboard/admin-dashboard/genre/GenreTable";

const GenreManagementPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["genres"],
    queryFn: () => getAllGenres(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
          Taxonomy <span className="text-fuchsia-500">Tags</span>
        </h1>
        <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
          Manage the genre classification grid.
        </p>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <GenreTable />
      </HydrationBoundary>
    </div>
  );
};

export default GenreManagementPage;
