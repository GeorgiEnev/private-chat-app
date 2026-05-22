"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createMessage } from "@/actions/message-actions";

type MessageInputProps = {
  roomId: string;
};

export function MessageInput({ roomId }: MessageInputProps) {
  const router = useRouter();

  const [content, setContent] = useState("");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!content.trim()) {
      setError("Message cannot be empty.");

      return;
    }

    setIsLoading(true);

    try {
      const result = await createMessage({
        roomId,
        content,
      });

      if (!result.success) {
        setError(result.error ?? "Failed to send message.");

        return;
      }

      setContent("");

      router.refresh();
    } catch (error) {
      console.error(error);

      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSendMessage}
      className="border-t border-[#141414] p-6"
    >
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Type a message..."
          className="h-12 flex-1 rounded-2xl bg-[#101010] px-4 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:bg-[#151515]"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 items-center justify-center rounded-2xl bg-violet-600 px-6 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
