"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MessageInput } from "@/components/messages/message-input";
import type { SerializedMessage } from "@/server/messages/message-service";

const POLL_INTERVAL_MS = 2_000;

type RoomChatProps = {
  currentUserId: string;
  roomId: string;
  roomName: string;
  roomToken: string;
  initialMessages: SerializedMessage[];
};

export function RoomChat({
  currentUserId,
  roomId,
  roomName,
  roomToken,
  initialMessages,
}: RoomChatProps) {
  const [messages, setMessages] = useState(initialMessages);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const latestMessageId = messages.at(-1)?.id;
  const messageCountLabel = useMemo(() => {
    return messages.length === 1 ? "1 message" : `${messages.length} messages`;
  }, [messages.length]);

  const appendMessages = useCallback(
    (incomingMessages: SerializedMessage[]) => {
      if (incomingMessages.length === 0) {
        return;
      }

      setMessages((currentMessages) => {
        const existingIds = new Set(
          currentMessages.map((message) => message.id),
        );
        const freshMessages = incomingMessages.filter(
          (message) => !existingIds.has(message.id),
        );

        if (freshMessages.length === 0) {
          return currentMessages;
        }

        return [...currentMessages, ...freshMessages];
      });
    },
    [],
  );

  const fetchNewMessages = useCallback(
    async (signal?: AbortSignal) => {
      if (isFetchingRef.current) {
        return;
      }

      const params = latestMessageId
        ? `?after=${encodeURIComponent(latestMessageId)}`
        : "";

      isFetchingRef.current = true;

      try {
        const response = await fetch(
          `/api/rooms/${encodeURIComponent(roomToken)}/messages${params}`,
          {
            cache: "no-store",
            signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch room messages.");
        }

        const data = (await response.json()) as {
          messages: SerializedMessage[];
        };

        appendMessages(data.messages);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [appendMessages, latestMessageId, roomToken],
  );

  useEffect(() => {
    const abortController = new AbortController();

    const intervalId = window.setInterval(() => {
      fetchNewMessages(abortController.signal).catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error(error);
      });
    }, POLL_INTERVAL_MS);

    return () => {
      abortController.abort();
      window.clearInterval(intervalId);
    };
  }, [fetchNewMessages]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const distanceFromBottom =
      scrollContainer.scrollHeight -
      scrollContainer.scrollTop -
      scrollContainer.clientHeight;

    if (distanceFromBottom < 160) {
      bottomRef.current?.scrollIntoView({ block: "end" });
    }
  }, [messages]);

  return (
    <main className="flex min-w-0 flex-col border-r border-[#111111]">
      <header className="flex h-16 items-center justify-between border-b border-[#111111] px-6">
        <div>
          <h2 className="text-sm font-medium text-white">{roomName}</h2>

          <p className="text-xs text-neutral-600">{messageCountLabel}</p>
        </div>
      </header>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-1">
          {messages.length === 0 ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="text-center">
                <p className="text-5xl text-neutral-800">#</p>

                <p className="mt-5 text-sm text-neutral-600">
                  No messages yet.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender.id === currentUserId;

              return (
                <div
                  key={message.id}
                  className={`rounded-xl px-3 py-2 transition ${
                    isOwnMessage
                      ? "bg-[#09110b]"
                      : "hover:bg-[#0d0d0d]"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <p
                      className={`text-sm font-medium ${
                        isOwnMessage ? "text-green-500" : "text-green-700"
                      }`}
                    >
                      {isOwnMessage ? "You" : message.sender.name}
                    </p>

                    <p className="text-xs text-neutral-700">
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>

                  <p
                    className={`whitespace-pre-wrap break-words text-sm leading-relaxed ${
                      isOwnMessage ? "text-neutral-200" : "text-neutral-300"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <MessageInput roomId={roomId} onMessageCreated={appendMessages} />
    </main>
  );
}

function formatMessageTime(createdAt: string) {
  const date = new Date(createdAt);

  return `${date.getUTCHours().toString().padStart(2, "0")}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")} UTC`;
}
