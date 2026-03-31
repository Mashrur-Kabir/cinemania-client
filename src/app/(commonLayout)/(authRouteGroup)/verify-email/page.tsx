import VerifyEmailForm from "@/components/modules/auth/VerifyEmailForm";
import { redirect } from "next/navigation";

interface VerifyEmailParams {
  searchParams: Promise<{ email?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailParams) => {
  const params = await searchParams;

  // If no email is provided, return to login for safety
  if (!params.email) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <VerifyEmailForm email={params.email} />
    </div>
  );
};

export default VerifyEmailPage;
