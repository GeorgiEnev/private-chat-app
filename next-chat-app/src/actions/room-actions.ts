"use server";

import crypto from "crypto";

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

  const token = crypto.randomBytes(6).toString("hex");

  const room = await prisma.room.create({
    data: {
      name,
      token,
      isDestructible,
      ownerId: session.user.id,
    },
  });

  return {
    success: true,
    room,
  };
}
