"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { updateProfile } from "@/actions/profile-actions";
import {
  AVATAR_COLORS,
  DEFAULT_AVATAR_COLOR,
  getAvatarColorClass,
} from "@/lib/avatar-colors";

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    avatarColor: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [avatarColor, setAvatarColor] = useState(
    user.avatarColor ?? DEFAULT_AVATAR_COLOR,
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const initials = useMemo(() => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [name]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const result = await updateProfile({
        name,
        avatarColor,
      });

      if (!result.success) {
        setError(result.error ?? "Failed to update profile.");
        return;
      }

      setSuccess("Profile updated.");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="flex items-center gap-5 border-b border-[#111111] pb-8">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-2xl text-xl font-semibold text-white ${getAvatarColorClass(
            avatarColor,
          )}`}
        >
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-white">{name}</p>
          <p className="mt-1 truncate text-sm text-neutral-600">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Name</label>
          <input
            type="text"
            value={name}
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
            className="h-12 w-full rounded-xl bg-[#101010] px-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:bg-[#141414]"
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-neutral-300">Avatar color</p>

          <div className="flex flex-wrap gap-3">
            {AVATAR_COLORS.map((color) => {
              const isSelected = avatarColor === color.value;

              return (
                <button
                  key={color.value}
                  type="button"
                  aria-label={color.label}
                  aria-pressed={isSelected}
                  onClick={() => setAvatarColor(color.value)}
                  className={`h-9 w-9 rounded-full ${color.className} transition hover:scale-105 ${
                    isSelected
                      ? `ring-2 ring-offset-2 ring-offset-black ${color.ringClassName}`
                      : "ring-1 ring-white/10"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {(error || success) && (
        <p
          className={`mt-5 text-sm ${
            error ? "text-red-400" : "text-green-500"
          }`}
        >
          {error || success}
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-medium text-black transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
