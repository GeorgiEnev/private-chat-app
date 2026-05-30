"use client";

import { useEffect, useState } from "react";

type CopyInviteTokenProps = {
  token: string;
};

export function CopyInviteToken({ token }: CopyInviteTokenProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  useEffect(() => {
    if (copyState === "idle") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState("idle");
    }, 1_600);

    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(token);
      setCopyState("copied");
    } catch (error) {
      console.error(error);
      setCopyState("failed");
    }
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <p className="min-w-0 flex-1 truncate font-mono text-sm text-neutral-400">
        {token}
      </p>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copyState === "copied" ? "Invite token copied" : "Copy invite token"}
        title={copyState === "copied" ? "Copied" : "Copy invite token"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#202020] bg-[#151515] text-neutral-400 transition hover:border-[#2f2f2f] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        {copyState === "copied" ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-4 w-4 text-green-500"
            fill="none"
          >
            <path
              d="m5 10 3 3 7-7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={
              copyState === "failed" ? "h-4 w-4 text-red-400" : "h-4 w-4"
            }
            fill="none"
          >
            {copyState === "failed" ? (
              <path
                d="M10 6v5m0 3h.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            ) : (
              <>
                <path
                  d="M7 5h6m-5 2h5m-5 3h5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M6 3h8a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </>
            )}
          </svg>
        )}
      </button>
    </div>
  );
}
