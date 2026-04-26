import { getSingleReview } from "@/services/review.services";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { getUserInfo } from "@/services/auth.services";
import ArchiveNotFoundRedirect from "@/components/modules/dashboard/user-dashboard/review/ArchiveNotFoundRedirect";
import ArchivedReviewCard from "@/components/modules/dashboard/user-dashboard/archive/ArchivedReviewCard";

export default async function SingleArchivedReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userInfo = await getUserInfo();

  // 🛡️ Hard Auth Bounce (Keep this on the server)
  if (!userInfo) redirect("/login");

  const response = await getSingleReview(id);
  const review = response.data;

  // 🛡️ Security Check:
  // If it doesn't exist, isn't rejected, or doesn't belong to the user,
  // return our Client Component to handle the toast + redirect smoothly.
  if (
    !response.success ||
    !review ||
    review.status !== "REJECTED" ||
    review.userId !== userInfo.id
  ) {
    return <ArchiveNotFoundRedirect />;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link
        href="/dashboard/my-reviews/archive"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all mb-10 group"
      >
        <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
        Back to Archive
      </Link>

      <header className="mb-10 flex items-center gap-4 border-b border-rose-500/20 pb-6">
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
          <ShieldAlert className="size-6 text-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Quarantined Record
          </h1>
          <p className="text-[10px] font-black text-rose-500/50 uppercase tracking-widest mt-1">
            System ID: {review.id.split("-")[0]}
          </p>
        </div>
      </header>

      <ArchivedReviewCard review={review} />
    </div>
  );
}
