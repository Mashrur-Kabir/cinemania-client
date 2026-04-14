import LoginForm from "@/components/modules/auth/LoginForm";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const userInfo = await getUserInfo();

// 🎯 If the server confirms we have a VALID user, don't show the login form
if (userInfo) {
  redirect("/dashboard");
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm redirectPath={params.redirect} />
    </div>
  );
};

export default LoginPage;
