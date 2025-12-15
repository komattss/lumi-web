"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>

      <BottomNav />
    </div>
  );
}
