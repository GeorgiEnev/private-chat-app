"use client";

import React, { useState } from "react";

import { createRoom } from "@/actions/room-actions";

export function CreateRoomForm() {
  const [name, setName] = useState("");

  const [isDestructible, setIsDestructible] = useState(false);

  const [token, setToken] = useState("");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateRoom(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setToken("");

    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createRoom({
        name,
        isDestructible,
      });

      if (!result.success) {
        setError(result.error ?? "Failed to create room.");

        return;
      }

      if (!result.room) {
        setError("Room was created, but no room data was returned.");
        return;
      }

      setToken(result.room.token);

      setName("");
      setIsDestructible(false);
    } catch (error) {
      console.error(error);

      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleCreateRoom}
      className="space-y-6 rounded-2xl border border-neutral-900 bg-neutral-950 p-6"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">
          Room name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Secret room"
          className="w-full rounded-xl border border-neutral-800 bg-black px-4 py-3 text-white outline-none transition focus:border-neutral-700"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={isDestructible}
          onChange={(event) => setIsDestructible(event.target.checked)}
        />
        Destructible room
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {token && (
        <div className="rounded-xl border border-green-900 bg-green-950/40 p-4">
          <p className="text-sm text-green-300">Invite token:</p>

          <p className="mt-2 break-all font-mono text-white">{token}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Creating room..." : "Create room"}
      </button>
    </form>
  );
}
