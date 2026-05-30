"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteRoom } from "@/actions/room-actions";

type DeleteRoomButtonProps = {
  roomId: string;
  roomName: string;
};

export function DeleteRoomButton({ roomId, roomName }: DeleteRoomButtonProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteRoom() {
    setError("");

    const confirmed = window.confirm(
      `Delete "${roomName}"? This removes the room and its messages for everyone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteRoom(roomId);

      if (!result.success) {
        setError(result.error ?? "Failed to delete room.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="mt-6 border-t border-[#111111] pt-4">
      <button
        type="button"
        onClick={handleDeleteRoom}
        disabled={isDeleting}
        className="flex h-10 w-full items-center justify-center rounded-xl bg-[#130808] text-sm font-medium text-red-300 transition hover:bg-[#1b0b0b] hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete room"}
      </button>

      {error && (
        <p className="mt-3 text-xs leading-relaxed text-red-400">{error}</p>
      )}
    </div>
  );
}
