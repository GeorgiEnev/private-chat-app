import { prisma } from "@/lib/prisma";

type ExpirableRoom = {
  id: string;
  expiresAt: Date | null;
};

export function isRoomExpired(room: ExpirableRoom, now = new Date()) {
  return room.expiresAt !== null && room.expiresAt <= now;
}

export async function deleteExpiredRoom(room: ExpirableRoom, now = new Date()) {
  if (!isRoomExpired(room, now)) {
    return false;
  }

  const result = await prisma.room.deleteMany({
    where: {
      id: room.id,
      expiresAt: {
        lte: now,
      },
    },
  });

  return result.count > 0;
}

export async function deleteExpiredRooms(now = new Date()) {
  return prisma.room.deleteMany({
    where: {
      expiresAt: {
        lte: now,
      },
    },
  });
}
