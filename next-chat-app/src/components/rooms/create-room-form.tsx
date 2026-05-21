"use client";

import { useState } from "react";

import { createRoom } from "@/actions/room-actions";

type CreateRoomFormProps = {
  onRoomCreated: (room: {
    id: string;
    name: string;
    token: string;
    isDestructible: boolean;
  }) => void;
};

export function CreateRoomForm({ onRoomCreated }: CreateRoomFormProps) {
  const [name, setName] = useState("");

  const [isDestructible, setIsDestructible] = useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

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

      onRoomCreated(result.room);

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
    <form onSubmit={handleCreateRoom} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">
          Room name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Secret room"
          className="h-12 w-full rounded-xl bg-[#101010] px-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:bg-[#141414]"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-neutral-400">
        <input
          type="checkbox"
          checked={isDestructible}
          onChange={(event) => setIsDestructible(event.target.checked)}
          className="h-4 w-4 rounded border-neutral-700 bg-[#101010]"
        />
        Destructible room
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-medium text-black transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Creating room..." : "Create room"}
      </button>
    </form>
  );
}
