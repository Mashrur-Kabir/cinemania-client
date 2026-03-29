import CommonNavbar from "@/components/shared/CommonLayout/CommonNavbar";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <CommonNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
