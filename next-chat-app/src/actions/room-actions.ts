"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/get-session";

type CreateRoomData = {
  name: string;
  isDestructible: boolean;
};

export async function createRoom({ name, isDestructible }: CreateRoomData) {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const token = crypto.randomBytes(8).toString("hex");

  const room = await prisma.room.create({
    data: {
      name,
      token,
      isDestructible,
      ownerId: session.user.id,

      members: {
        create: {
          userId: session.user.id,
        },
      },
    },
  });

  return {
    success: true,
    room,
  };
}

export async function deleteRoom(roomId: string) {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const result = await prisma.room.deleteMany({
    where: {
      id: roomId,
      ownerId: session.user.id,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      error: "Only the room owner can delete this room.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
  };
}
