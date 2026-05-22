"use server";

import { prisma } from "@/lib/prisma";

import { getSession } from "@/server/auth/get-session";

type CreateMessageInput = {
  roomId: string;
  content: string;
};

export async function createMessage({ roomId, content }: CreateMessageInput) {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return {
      success: false,
      error: "Message cannot be empty.",
    };
  }

  await prisma.message.create({
    data: {
      content: trimmedContent,

      roomId,

      senderId: session.user.id,
    },
  });

  return {
    success: true,
  };
}
