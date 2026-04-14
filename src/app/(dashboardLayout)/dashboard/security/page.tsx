// src/app/(dashboard)/dashboard/security/page.tsx
import ChangePasswordForm from "@/components/modules/dashboard/user-dashboard/change-password/ChangePasswordForm";
import { HomeSection } from "@/components/modules/home/HomeSection";

export default function SecurityPage() {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-10 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 🎯 Wrap HomeSection in a centered flex container to "middle" the text */}
      <div className="w-full text-center">
        <HomeSection
          title="SECURITY COMMAND"
          subtitle="Manage your authentication keys and session integrity."
        >
          {/* This empty space helps HomeSection stay balanced if it expects children */}
          <div className="hidden" />
        </HomeSection>
      </div>

      {/* 🎯 The Form Container */}
      <div className="mt-12 w-full mr-44">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
