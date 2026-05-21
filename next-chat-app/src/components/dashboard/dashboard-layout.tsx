"use client";

import { ReactNode, useState } from "react";

import { CreateRoomModal } from "@/components/rooms/create-room-modal";

import { DashboardSidebar } from "./dashboard-sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  return (
    <>
      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
      />

      <div className="flex min-h-screen bg-black text-white">
        <DashboardSidebar onCreateRoom={() => setIsCreateRoomOpen(true)} />

        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
