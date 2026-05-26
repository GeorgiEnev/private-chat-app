import { prisma } from "@/lib/prisma";

export async function getRoomByToken(token: string) {
  return prisma.room.findUnique({
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
}
