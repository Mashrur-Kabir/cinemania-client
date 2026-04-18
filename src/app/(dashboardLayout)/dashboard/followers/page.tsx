import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeSection } from "@/components/modules/home/HomeSection";
import { Users, UserPlus } from "lucide-react";
import FollowerList from "@/components/modules/dashboard/user-dashboard/follower/FollowerList";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";
import FollowingList from "@/components/modules/dashboard/user-dashboard/follower/FollowingList";

export default async function FollowersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const userInfo = await getUserInfo();
  if (!userInfo) redirect("/login");

  const params = await searchParams;
  const currentPage = Number(params.page) || 1; // 🎯 THE FIX: Resolve page from URL

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-1000">
      <HomeSection
        title="THE NETWORK"
        subtitle="Your allies and rivals across the cinematic multiverse."
      >
        <Tabs defaultValue="followers" className="w-full mt-10">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14">
              <TabsTrigger
                value="followers"
                className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest transition-all"
              >
                <Users className="size-4 mr-2" /> Followers
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="rounded-xl px-8 h-full data-[state=active]:bg-accent data-[state=active]:text-black font-black uppercase text-[10px] tracking-widest transition-all"
              >
                <UserPlus className="size-4 mr-2" /> Following
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="followers">
            <FollowerList userId={userInfo.id} page={currentPage} />
          </TabsContent>

          <TabsContent value="following">
            <FollowingList userId={userInfo.id} page={currentPage} />
          </TabsContent>
        </Tabs>
      </HomeSection>
    </div>
  );
}
