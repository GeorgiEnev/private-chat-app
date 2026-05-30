"use client";

import { useEffect, useState } from "react";

type CopyInviteTokenProps = {
  token: string;
};

export function CopyInviteToken({ token }: CopyInviteTokenProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 1_600);

    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(token);
      setIsCopied(true);
    } catch (error) {
      console.error(error);
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
        aria-label={isCopied ? "Invite token copied" : "Copy invite token"}
        title={isCopied ? "Copied" : "Copy invite token"}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-500 transition hover:bg-[#171717] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill="none"
        >
          <path
            d="M7 6H5.5A1.5 1.5 0 0 0 4 7.5v8A1.5 1.5 0 0 0 5.5 17h7A1.5 1.5 0 0 0 14 15.5V14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M8 3.5A1.5 1.5 0 0 1 9.5 2h5A1.5 1.5 0 0 1 16 3.5v7A1.5 1.5 0 0 1 14.5 12h-5A1.5 1.5 0 0 1 8 10.5v-7Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </div>
  );
}
