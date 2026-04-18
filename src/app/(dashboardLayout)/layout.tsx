import BackgroundMain from "@/components/modules/home/BackgroundMain";
import DashboardNavbar from "@/components/shared/CommonLayout/navbar/DashboardNavbar";
import DashboardSidebar from "@/components/shared/CommonLayout/sidebar/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-[#030406]">
      {/* 🌌 Persistent Background for Dashboard Consistency */}
      <BackgroundMain />

      {/* 📱 Mobile Backdrop/Sheet logic will go here in the Navbar */}

      {/* 🖥️ Desktop Sidebar (Locked at 280px) */}
      <aside className="hidden md:flex h-full z-20">
        <DashboardSidebar />
      </aside>

      {/* 🚀 Main Command Center Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden z-10">
        {/* Dynamic Top Header for Search & Actions */}
        <header className="h-20 flex items-center px-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
          {/* Dashboard Navbar */}
          <DashboardNavbar />
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
