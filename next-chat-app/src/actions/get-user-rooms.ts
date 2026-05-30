import { prisma } from "@/lib/prisma";
import { deleteExpiredRooms } from "@/server/rooms/room-expiry";

export async function getUserRooms(userId: string) {
  await deleteExpiredRooms();

  return prisma.room.findMany({
    where: {
      OR: [
        {
          expiresAt: null,
        },
        {
          expiresAt: {
            gt: new Date(),
          },
        },
      ],
      members: {
        some: {
          userId,
        },
      },
    },

    orderBy: {
      updatedAt: "desc",
    },
  });
}
