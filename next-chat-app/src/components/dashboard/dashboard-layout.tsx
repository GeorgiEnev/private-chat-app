
import { ReactNode } from "react";

import { DashboardSidebar } from "./dashboard-sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <div className="flex min-h-screen bg-black text-white">
        <DashboardSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
