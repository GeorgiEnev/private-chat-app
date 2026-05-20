"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOutUser } from "@/actions/session-actions";

export default function LogoutButton() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      const result = await signOutUser();

      if (!result.success) {
        return;
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "Signing out..." : "Logout"}
    </button>
  );
}
