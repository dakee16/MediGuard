import { AppNav } from "../../components/nav/app-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-ink-50">
      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-teal-200/30 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-coral-100/40 blur-[120px]" />
      </div>

      <AppNav />

      <main className="relative lg:pl-32 lg:pr-8 px-4 pt-6 pb-32 lg:py-8 max-w-5xl lg:ml-0 lg:mr-auto">
        {children}
      </main>
    </div>
  );
}
