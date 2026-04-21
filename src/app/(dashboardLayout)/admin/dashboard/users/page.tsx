import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllUsers, getUserAnalytics } from "@/services/admin.services";
import UserTable from "@/components/modules/dashboard/admin-dashboard/user/UserTable";
import UserAnalyticsDashboard from "@/components/modules/dashboard/admin-dashboard/user/UserAnalyticsDashboard";

const UsersManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;

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

  //prefetch table data
  await queryClient.prefetchQuery({
    queryKey: ["users", queryString],
    queryFn: () => getAllUsers(queryString),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  //prefetch dashboard analytics
  await queryClient.prefetchQuery({
    queryKey: ["user-analytics"],
    queryFn: () => getUserAnalytics(),
    staleTime: 1000 * 60 * 60, // 1 hour caching for stats
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
          User <span className="text-cyan-500">Base</span>
        </h1>
        <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">
          Monitor and manage personnel access.
        </p>
      </header>

      {/* Statistical Dashboard Component Placeholder will go right here eventually */}

      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserAnalyticsDashboard />
        <UserTable initialQueryString={queryString} />
      </HydrationBoundary>
    </div>
  );
};

export default UsersManagementPage;
