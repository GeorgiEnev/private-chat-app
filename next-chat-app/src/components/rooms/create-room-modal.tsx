"use client";

import { useRouter } from "next/navigation";

import { CreateRoomForm } from "./create-room-form";

type CreateRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router = useRouter();

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
            type="button"
            aria-label="Close create room dialog"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-[#141414] hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <CreateRoomForm
          onRoomCreated={(room) => {
            router.push(`/dashboard/room/${room.token}`);
          }}
        />
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="m5.5 5.5 9 9M14.5 5.5l-9 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
