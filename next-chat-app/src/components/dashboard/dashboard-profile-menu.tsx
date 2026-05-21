"use client";

import { useState } from "react";

import { LogoutButton } from "@/components/auth/logout-button";

type DashboardProfileMenuProps = {
  username: string;
};

export function DashboardProfileMenu({ username }: DashboardProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const initials = username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl bg-[#101010] px-2 py-2 transition hover:bg-[#151515]"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-800 text-xs font-semibold text-white">
          {initials}
        </div>

        <span className="text-sm text-neutral-400">{username}</span>

        <span className="text-xs text-neutral-600">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-64 rounded-2xl bg-[#0b0b0b] p-2 shadow-2xl">


          <div className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-400 transition hover:bg-[#111111] hover:text-white">
              <span>○</span>
              Profile
            </button>

            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-400 transition hover:bg-[#111111] hover:text-white">
              <span>⚙</span>
              Settings
            </button>
          </div>

          <div className="mt-2 border-t border-[#141414] pt-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
