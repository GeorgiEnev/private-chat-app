"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { joinRoom } from "@/actions/join-room-actions";

export function JoinRoomForm() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleJoinRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    setIsLoading(true);

    try {
      const result = await joinRoom({
        token,
      });

      if (!result.success) {
        setError("Something went wrong");
        return;
      }

      router.refresh();

      router.push(`/dashboard/room/${result.roomToken}`);
    } catch (error) {
      console.error(error);

      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleJoinRoom} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-neutral-400">
          Invite token
        </label>

        <input
          type="text"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste room token..."
          className="h-12 w-full rounded-2xl bg-[#101010] px-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:bg-[#151515]"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-white px-6 text-sm font-medium text-black transition hover:opacity-85 disabled:opacity-50"
      >
        {isLoading ? "Joining..." : "Join Room"}
      </button>
    </form>
  );
}
