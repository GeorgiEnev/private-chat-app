"use client";

import { useState } from "react";

import { createRoom } from "@/actions/room-actions";
import {
  MAX_ROOM_EXPIRY_MINUTES,
  MIN_ROOM_EXPIRY_MINUTES,
  ROOM_EXPIRY_UNITS,
  formatRoomExpiryDuration,
  getRoomExpiryMinutes,
  type RoomExpiryUnit,
} from "@/lib/rooms/room-expiry";

type CreateRoomFormProps = {
  onRoomCreated: (room: {
    id: string;
    name: string;
    token: string;
    isDestructible: boolean;
    expiresAt: Date | string | null;
  }) => void;
};

export function CreateRoomForm({ onRoomCreated }: CreateRoomFormProps) {
  const [name, setName] = useState("");

  const [roomLifetime, setRoomLifetime] = useState<
    "persistent" | "destructible"
  >("persistent");
  const [expiryAmount, setExpiryAmount] = useState("24");
  const [expiryUnit, setExpiryUnit] = useState<RoomExpiryUnit>("hours");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const minimumExpiryAmount = expiryUnit === "minutes" ? 5 : 1;

  async function handleCreateRoom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }

    const parsedExpiryAmount = Number(expiryAmount);
    const expiresIn =
      roomLifetime === "destructible"
        ? {
            amount: parsedExpiryAmount,
            unit: expiryUnit,
          }
        : null;

    const expiresInMinutes = getRoomExpiryMinutes(expiresIn);

    if (
      roomLifetime === "destructible" &&
      (expiresInMinutes === null ||
        expiresInMinutes < MIN_ROOM_EXPIRY_MINUTES ||
        expiresInMinutes > MAX_ROOM_EXPIRY_MINUTES)
    ) {
      setError("Room lifetime must be between 5 minutes and 30 days.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createRoom({
        name,
        expiresIn,
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
      setRoomLifetime("persistent");
      setExpiryAmount("24");
      setExpiryUnit("hours");
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

      <div className="space-y-3">
        <label className="text-sm font-medium text-neutral-300">
          Room lifetime
        </label>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#101010] p-1">
          <button
            type="button"
            onClick={() => setRoomLifetime("persistent")}
            className={`h-10 rounded-lg text-sm transition ${
              roomLifetime === "persistent"
                ? "bg-white text-black"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Persistent
          </button>

          <button
            type="button"
            onClick={() => setRoomLifetime("destructible")}
            className={`h-10 rounded-lg text-sm transition ${
              roomLifetime === "destructible"
                ? "bg-white text-black"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Destructible
          </button>
        </div>

        {roomLifetime === "destructible" && (
          <div className="space-y-2 rounded-xl border border-[#161616] bg-[#0d0d0d] p-3">
            <div className="grid grid-cols-[1fr_120px] gap-2">
              <input
                type="number"
                min={minimumExpiryAmount}
                step={1}
                value={expiryAmount}
                onChange={(event) => setExpiryAmount(event.target.value)}
                className="h-11 rounded-lg bg-[#101010] px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:bg-[#141414]"
              />

              <select
                value={expiryUnit}
                onChange={(event) =>
                  setExpiryUnit(event.target.value as RoomExpiryUnit)
                }
                className="h-11 rounded-lg bg-[#101010] px-3 text-sm text-white outline-none transition focus:bg-[#141414]"
              >
                {ROOM_EXPIRY_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs leading-relaxed text-neutral-600">
              The room will be permanently deleted after{" "}
              {formatRoomExpiryDuration({
                amount: Number(expiryAmount) || 0,
                unit: expiryUnit,
              })}
              . Minimum 5 minutes, maximum 30 days.
            </p>
          </div>
        )}
      </div>

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
