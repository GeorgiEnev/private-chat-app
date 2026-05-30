"use client";

import { JoinRoomForm } from "./join-room-form";

type JoinRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-[#0b0b0b] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Join room</h2>

            <p className="mt-1 text-sm text-neutral-500">
              Enter an invite token to join a room.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-[#141414] hover:text-white"
          >
            ✕
          </button>
        </div>

        <JoinRoomForm />
      </div>
    </div>
  );
}
