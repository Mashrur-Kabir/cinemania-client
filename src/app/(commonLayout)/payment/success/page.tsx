import { Suspense } from "react";
import PaymentSuccessContent from "@/components/modules/payment/PaymentSuccessContent";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  // Extract parameters purely on the server
  const { session_id } = await searchParams;

  return (
    // Wrap in Suspense to prevent blocking the entire route layout during parameter resolution
    <Suspense fallback={<div className="min-h-screen bg-[#030406]" />}>
      <PaymentSuccessContent sessionId={session_id || null} />
    </Suspense>
  );
}
