import { NextResponse } from "next/server";

import { deleteExpiredRooms } from "@/server/rooms/room-expiry";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const authorization = request.headers.get("authorization");

    if (authorization !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  const result = await deleteExpiredRooms();

  return NextResponse.json({
    deletedRooms: result.count,
  });
}
