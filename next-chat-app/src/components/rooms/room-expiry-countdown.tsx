"use client";

import { useEffect, useMemo, useState } from "react";

type RoomExpiryCountdownProps = {
  expiresAt: string;
};

export function RoomExpiryCountdown({ expiresAt }: RoomExpiryCountdownProps) {
  const expiresAtDate = useMemo(() => new Date(expiresAt), [expiresAt]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const remainingMs = expiresAtDate.getTime() - now;

  return (
    <div className="text-right font-mono text-xs text-red-400">
      deletes in {formatRemainingTime(remainingMs)}
    </div>
  );
}

function formatRemainingTime(remainingMs: number) {
  if (remainingMs <= 0) {
    return "expired";
  }

  const totalSeconds = Math.floor(remainingMs / 1_000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}
