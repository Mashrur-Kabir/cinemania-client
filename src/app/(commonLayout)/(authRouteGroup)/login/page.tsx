import LoginForm from "@/components/modules/auth/LoginForm";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
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
