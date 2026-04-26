import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getAdminArchive,
  getPendingReviews,
  getReportedReviews,
} from "@/services/admin.services";
import ReportsManager from "@/components/modules/dashboard/admin-dashboard/reports/ReportsManager";
import { ShieldHalf } from "lucide-react";
import { getUserInfo } from "@/services/auth.services"; // 🎯 NEW IMPORT
import { redirect } from "next/navigation";

const ReportsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // If the cookie is gone (e.g., during logout re-render), bounce them safely before Axios crashes!
  const userInfo = await getUserInfo();
  if (!userInfo || userInfo.role !== "ADMIN") {
    redirect("/login");
  }
  const queryParamsObjects = await searchParams;
  const currentTab = queryParamsObjects.tab || "pending";

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (value === undefined) return "";
      if (Array.isArray(value)) {
        return value
          .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");

  const queryClient = new QueryClient();

  // 🎯 THE FIX: Parse the exact same way the client does so the query variables match 1:1.
  // This prevents React Query from instantly triggering a "refetch" jitter!
  const parsedParams = Object.fromEntries(new URLSearchParams(queryString));

  if (currentTab === "pending") {
    await queryClient.prefetchQuery({
      queryKey: ["pending-reviews", queryString],
      queryFn: () => getPendingReviews(parsedParams),
      staleTime: 1000 * 60 * 2,
    });
  } else if (currentTab === "reported") {
    // 🎯 THE FIX: Prefetch the new Reported Reviews Queue
    await queryClient.prefetchQuery({
      queryKey: ["reported-reviews", queryString],
      queryFn: () => getReportedReviews(parsedParams),
      staleTime: 1000 * 60 * 2,
    });
  } else {
    await queryClient.prefetchQuery({
      queryKey: ["archived-reviews", queryString],
      queryFn: () => getAdminArchive(parsedParams),
      staleTime: 1000 * 60 * 2,
    });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            Moderation <span className="text-amber-500">Queue</span>
          </h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
            Review and resolve pending transmissions.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
          <ShieldHalf className="size-5 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Live Security Feed
          </span>
        </div>
      </header>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReportsManager initialQueryString={queryString} />
      </HydrationBoundary>
    </div>
  );
};

export default ReportsManagementPage;
