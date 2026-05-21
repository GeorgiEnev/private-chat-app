"use client";

import { useState } from "react";

import { CreateRoomForm } from "./create-room-form";

type CreateRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type CreatedRoom = {
  id: string;
  name: string;
  token: string;
  isDestructible: boolean;
};

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [createdRoom, setCreatedRoom] = useState<CreatedRoom | null>(null);

  if (!isOpen) {
    return null;
  }

  async function handleCopyToken() {
    if (!createdRoom) {
      return;
    }

    await navigator.clipboard.writeText(createdRoom.token);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-[#0b0b0b] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {createdRoom ? "Room created" : "Create room"}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {createdRoom
                ? "Share the invite token with others."
                : "Create a new private chat room."}
            </p>
          </div>

          <button
            onClick={() => {
              setCreatedRoom(null);
              onClose();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-[#141414] hover:text-white"
          >
            ✕
          </button>
        </div>

        {!createdRoom ? (
          <CreateRoomForm onRoomCreated={(room) => setCreatedRoom(room)} />
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl bg-[#101010] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
                Invite token
              </p>

              <p className="mt-3 break-all font-mono text-lg text-white">
                {createdRoom.token}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyToken}
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-white text-sm font-medium text-black transition hover:opacity-85"
              >
                Copy token
              </button>

              <button
                onClick={() => {
                  setCreatedRoom(null);
                  onClose();
                }}
                className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[#141414] text-sm text-neutral-300 transition hover:bg-[#212121]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
