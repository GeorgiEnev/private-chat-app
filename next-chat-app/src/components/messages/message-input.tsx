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
    <form onSubmit={handleSendMessage} className="px-6 pb-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3 rounded-2xl bg-[#0d0d0d] p-2">
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Send a message..."
            className="h-11 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-neutral-600"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 items-center justify-center rounded-2xl bg-white px-6 text-sm font-medium text-black transition hover:opacity-85 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </form>
  );
}
