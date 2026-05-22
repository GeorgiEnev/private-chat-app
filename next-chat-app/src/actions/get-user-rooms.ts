import { prisma } from "@/lib/prisma";

export async function getUserRooms(userId: string) {
  return prisma.room.findMany({
    where: {
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
