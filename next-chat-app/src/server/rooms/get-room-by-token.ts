import { prisma } from "@/lib/prisma";

export async function getRoomByToken(token: string) {
  return prisma.room.findUnique({
    where: {
      token,
    },

    include: {
      members: true,
    },
  });
}
