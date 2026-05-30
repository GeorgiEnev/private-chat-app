"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { DEFAULT_AVATAR_COLOR, getAvatarColorClass } from "@/lib/avatar-colors";

type DashboardProfileMenuProps = {
  username: string;
  email?: string | null;
  avatarColor?: string | null;
};

export function DashboardProfileMenu({
  username,
  email,
  avatarColor = DEFAULT_AVATAR_COLOR,
}: DashboardProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-xl bg-[#101010] px-2 py-2 transition hover:bg-[#151515] focus:outline-none focus:ring-2 focus:ring-white/15"
      >
        <Avatar avatarColor={avatarColor} initials={initials} size="sm" />

        <span className="max-w-40 truncate text-sm text-neutral-400">
          {username}
        </span>

        <ChevronDownIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-[#161616] bg-[#0b0b0b] p-2 shadow-2xl"
        >
          <div className="flex items-center gap-3 rounded-xl bg-[#111111] px-3 py-3">
            <Avatar avatarColor={avatarColor} initials={initials} size="md" />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {username}
              </p>

              {email && (
                <p className="mt-0.5 truncate text-xs text-neutral-600">
                  {email}
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <Link
              href="/dashboard/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-400 transition hover:bg-[#111111] hover:text-white"
            >
              <ProfileIcon />
              <span>Profile</span>
            </Link>
          </div>

          <div className="mt-2 border-t border-[#141414] pt-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}

function Avatar({
  avatarColor,
  initials,
  size,
}: {
  avatarColor?: string | null;
  initials: string;
  size: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "h-9 w-9" : "h-10 w-10";

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white ${getAvatarColorClass(
        avatarColor,
      )}`}
    >
      {initials}
    </div>
  );
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 text-neutral-600 transition ${
        isOpen ? "rotate-180" : ""
      }`}
      fill="none"
    >
      <path
        d="m6 8 4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.5 16.5a5.5 5.5 0 0 1 11 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
