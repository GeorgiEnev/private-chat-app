"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { deleteMessage, updateMessage } from "@/actions/message-actions";
import { MessageInput } from "@/components/messages/message-input";
import { RoomExpiryCountdown } from "@/components/rooms/room-expiry-countdown";
import type { SerializedMessage } from "@/server/messages/message-service";

const POLL_INTERVAL_MS = 2_000;

const emptySubscribe = () => () => {};

type RoomChatProps = {
  currentUserId: string;
  roomId: string;
  roomName: string;
  roomToken: string;
  expiresAt: string | null;
  initialMessages: SerializedMessage[];
};

export function RoomChat({
  currentUserId,
  roomId,
  roomName,
  roomToken,
  expiresAt,
  initialMessages,
}: RoomChatProps) {
  const router = useRouter();

  const [messages, setMessages] = useState(initialMessages);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [messageActionError, setMessageActionError] = useState("");
  const [openMenuMessageId, setOpenMenuMessageId] = useState<string | null>(
    null,
  );
  const [confirmingDeleteMessageId, setConfirmingDeleteMessageId] = useState<
    string | null
  >(null);
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const messageCountLabel = useMemo(() => {
    const visibleMessageCount = messages.filter((message) => {
      return !message.isDeleted;
    }).length;

    return visibleMessageCount === 1
      ? "1 message"
      : `${visibleMessageCount} messages`;
  }, [messages]);

  const mergeMessages = useCallback(
    (incomingMessages: SerializedMessage[]) => {
      if (incomingMessages.length === 0) {
        return;
      }

      setMessages((currentMessages) => {
        const incomingById = new Map(
          incomingMessages.map((message) => [message.id, message]),
        );
        const existingIds = new Set(currentMessages.map(({ id }) => id));
        const updatedMessages = currentMessages.map((message) => {
          return incomingById.get(message.id) ?? message;
        });
        const freshMessages = incomingMessages.filter(({ id }) => {
          return !existingIds.has(id);
        });

        if (freshMessages.length === 0) {
          return updatedMessages;
        }

        return [...updatedMessages, ...freshMessages];
      });
    },
    [],
  );

  function startEditingMessage(message: SerializedMessage) {
    setMessageActionError("");
    setOpenMenuMessageId(null);
    setConfirmingDeleteMessageId(null);
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  }

  function cancelEditingMessage() {
    setEditingMessageId(null);
    setEditingContent("");
    setMessageActionError("");
  }

  async function handleUpdateMessage(messageId: string) {
    setMessageActionError("");

    if (!editingContent.trim()) {
      setMessageActionError("Message cannot be empty.");
      return;
    }

    setPendingMessageId(messageId);

    try {
      const result = await updateMessage({
        messageId,
        content: editingContent,
      });

      if (!result.success || !result.message) {
        setMessageActionError(result.error ?? "Failed to edit message.");
        return;
      }

      mergeMessages([result.message]);
      setEditingMessageId(null);
      setEditingContent("");
    } catch (error) {
      console.error(error);
      setMessageActionError("Something went wrong.");
    } finally {
      setPendingMessageId(null);
    }
  }

  async function handleDeleteMessage(messageId: string) {
    setMessageActionError("");
    setOpenMenuMessageId(null);
    setConfirmingDeleteMessageId(null);

    setPendingMessageId(messageId);

    try {
      const result = await deleteMessage(messageId);

      if (!result.success || !result.message) {
        setMessageActionError(result.error ?? "Failed to delete message.");
        return;
      }

      mergeMessages([result.message]);

      if (editingMessageId === messageId) {
        setEditingMessageId(null);
        setEditingContent("");
      }
    } catch (error) {
      console.error(error);
      setMessageActionError("Something went wrong.");
    } finally {
      setPendingMessageId(null);
    }
  }

  function toggleMessageMenu(messageId: string) {
    setOpenMenuMessageId((currentMessageId) => {
      const nextMessageId = currentMessageId === messageId ? null : messageId;

      if (nextMessageId !== messageId) {
        setConfirmingDeleteMessageId(null);
      }

      return nextMessageId;
    });
  }

  function requestDeleteConfirmation(messageId: string) {
    setMessageActionError("");
    setConfirmingDeleteMessageId(messageId);
  }

  const fetchNewMessages = useCallback(
    async (signal?: AbortSignal) => {
      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;

      try {
        const response = await fetch(
          `/api/rooms/${encodeURIComponent(roomToken)}/messages`,
          {
            cache: "no-store",
            signal,
          },
        );

        if (response.status === 404) {
          router.replace("/dashboard");
          router.refresh();
          return;
        }

        if (response.status === 401) {
          router.replace("/login");
          router.refresh();
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch room messages.");
        }

        const data = (await response.json()) as {
          messages: SerializedMessage[];
        };

        mergeMessages(data.messages);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [mergeMessages, roomToken, router],
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
    <main className="relative flex min-w-0 flex-col border-r border-[#111111]">
      <header className="flex h-16 items-center justify-between border-b border-[#111111] px-6">
        <div>
          <h2 className="text-sm font-medium text-white">{roomName}</h2>

          <p className="text-xs text-neutral-600">{messageCountLabel}</p>
        </div>
      </header>

      {expiresAt && (
        <div className="absolute right-6 top-5">
          <RoomExpiryCountdown expiresAt={expiresAt} />
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-1">
          {messageActionError && (
            <div className="mb-4 rounded-xl border border-red-950 bg-red-950/20 px-3 py-2 text-sm text-red-300">
              {messageActionError}
            </div>
          )}

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
              const isEditing = editingMessageId === message.id;
              const isPending = pendingMessageId === message.id;
              const isMenuOpen = openMenuMessageId === message.id;
              const isConfirmingDelete =
                confirmingDeleteMessageId === message.id;

              return (
                <div
                  key={message.id}
                  className={`group rounded-xl px-3 py-2 transition ${
                    isOwnMessage
                      ? "bg-[#09110b]"
                      : "hover:bg-[#0d0d0d]"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <p
                        className={`truncate text-sm font-medium ${
                          isOwnMessage ? "text-green-500" : "text-green-700"
                        }`}
                      >
                        {isOwnMessage ? "You" : message.sender.name}
                      </p>

                      <time
                        dateTime={message.createdAt}
                        title={formatMessageDateTime(
                          message.createdAt,
                          isClient,
                        )}
                        className="shrink-0 text-xs text-neutral-700"
                      >
                        {formatMessageTime(message.createdAt, isClient)}
                      </time>

                      {message.editedAt && !message.isDeleted && (
                        <span className="shrink-0 text-xs text-neutral-700">
                          edited
                        </span>
                      )}
                    </div>

                    {isOwnMessage && !message.isDeleted && !isEditing && (
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleMessageMenu(message.id)}
                          aria-expanded={isMenuOpen}
                          aria-label="Message options"
                          disabled={isPending}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-neutral-600 opacity-0 transition hover:bg-[#151515] hover:text-white group-hover:opacity-100 data-[open=true]:opacity-100 disabled:opacity-50"
                          data-open={isMenuOpen}
                        >
                          ...
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 top-8 z-10 w-36 overflow-hidden rounded-lg border border-[#1c1c1c] bg-[#0b0b0b] py-1 shadow-2xl shadow-black/50">
                            {isConfirmingDelete ? (
                              <>
                                <p className="px-3 py-2 text-xs text-neutral-500">
                                  Delete message?
                                </p>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="block w-full px-3 py-2 text-left text-xs text-red-300 transition hover:bg-red-950/30 hover:text-red-200"
                                >
                                  Delete
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmingDeleteMessageId(null)
                                  }
                                  className="block w-full px-3 py-2 text-left text-xs text-neutral-400 transition hover:bg-[#151515] hover:text-white"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEditingMessage(message)}
                                  className="block w-full px-3 py-2 text-left text-xs text-neutral-300 transition hover:bg-[#151515] hover:text-white"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    requestDeleteConfirmation(message.id)
                                  }
                                  className="block w-full px-3 py-2 text-left text-xs text-red-300 transition hover:bg-red-950/30 hover:text-red-200"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editingContent}
                        onChange={(event) =>
                          setEditingContent(event.target.value)
                        }
                        disabled={isPending}
                        rows={3}
                        className="min-h-24 w-full resize-y rounded-lg border border-[#1f1f1f] bg-[#050505] px-3 py-2 text-sm leading-relaxed text-white outline-none transition focus:border-neutral-600 disabled:opacity-60"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={cancelEditingMessage}
                          disabled={isPending}
                          className="rounded-lg px-3 py-1.5 text-xs text-neutral-500 transition hover:bg-[#111111] hover:text-white disabled:opacity-50"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateMessage(message.id)}
                          disabled={isPending}
                          className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:opacity-85 disabled:opacity-50"
                        >
                          {isPending ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className={`whitespace-pre-wrap wrap-break-words text-sm leading-relaxed ${
                        message.isDeleted
                          ? "italic text-neutral-700"
                          : isOwnMessage
                            ? "text-neutral-200"
                            : "text-neutral-300"
                      }`}
                    >
                      {message.isDeleted ? "Message deleted" : message.content}
                    </p>
                  )}
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <MessageInput roomId={roomId} onMessageCreated={mergeMessages} />
    </main>
  );
}

function formatMessageTime(createdAt: string, isClient: boolean) {
  const date = new Date(createdAt);

  if (isClient) {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return `${date.getUTCHours().toString().padStart(2, "0")}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")} UTC`;
}

function formatMessageDateTime(createdAt: string, isClient: boolean) {
  const date = new Date(createdAt);

  if (isClient) {
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return date.toISOString();
}
