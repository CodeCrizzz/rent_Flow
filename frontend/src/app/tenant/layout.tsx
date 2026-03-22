import TenantSidebar from "@/components/TenantSidebar";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <TenantSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}