 "use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(76,124,255,0.14),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(32,214,156,0.10),transparent_28%)]" />
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 border-white/10 bg-background/95 p-0 backdrop-blur-xl">
          <Sidebar onNavigate={() => setMobileNavOpen(false)} mobile />
        </SheetContent>
      </Sheet>
      <div className="relative flex min-h-screen flex-col lg:ml-64">
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
