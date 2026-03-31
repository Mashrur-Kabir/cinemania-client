import ResetPasswordForm from "@/components/modules/auth/ResetPasswordForm";
import { redirect } from "next/navigation";

interface ResetParams {
  searchParams: Promise<{ email?: string }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetParams) => {
  const params = await searchParams;
  const email = params.email;

  // 🛡️ Security Guard: If no email is present in the URL,
  // the user shouldn't be here. Send them back to forgot-password.
  if (!email) {
    redirect("/forgot-password");
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm email={email} />
    </div>
  );
};

export default ResetPasswordPage;
