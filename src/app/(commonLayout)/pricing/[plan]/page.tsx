import PlanDetailsClient from "@/components/modules/home/PlanDetailsClient";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function PlanDetailsPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  // 🛡️ SECURITY GUARD: Check for valid session
  const userInfo = await getUserInfo();

  // If no user is found, instantly bounce them to the login terminal
  if (!userInfo) {
    redirect("/login");
  }

  // 🎯 Resolve promise on the server side
  const { plan } = await params;

  return <PlanDetailsClient plan={plan} />;
}
