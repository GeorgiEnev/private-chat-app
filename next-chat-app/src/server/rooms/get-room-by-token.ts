import { prisma } from "@/lib/prisma";
import { deleteExpiredRoom } from "@/server/rooms/room-expiry";

export async function getRoomByToken(token: string) {
  const room = await prisma.room.findUnique({
    where: {
      token,
    },

    include: {
      members: {
        include: {
          user: true,
        },
      },

      messages: {
        include: {
          sender: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!room) {
    return null;
  }

  const wasDeleted = await deleteExpiredRoom(room);

  return wasDeleted ? null : room;
}
