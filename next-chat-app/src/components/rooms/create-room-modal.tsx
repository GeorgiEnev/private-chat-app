"use client";

import { CreateRoomForm } from "./create-room-form";

type CreateRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-[#0b0b0b] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Create room</h2>

            <p className="mt-1 text-sm text-neutral-500">
              Create a new private chat room.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-[#141414] hover:text-white"
          >
            ✕
          </button>
        </div>
        <CreateRoomForm />
      </div>
    </div>
  );
}
