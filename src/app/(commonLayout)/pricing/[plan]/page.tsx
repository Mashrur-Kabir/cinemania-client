import PlanDetailsClient from "@/components/modules/home/PlanDetailsClient";

export default async function PlanDetailsPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  // 🎯 THE FIX: Resolve promise on the server side
  const { plan } = await params;

  return <PlanDetailsClient plan={plan} />;
}
