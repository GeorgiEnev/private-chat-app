"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/get-session";
import { deleteExpiredRoom } from "@/server/rooms/room-expiry";

type JoinRoomInput = {
  token: string;
};

export async function joinRoom({ token }: JoinRoomInput) {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const trimmedToken = token.trim();

  if (!trimmedToken) {
    return {
      success: false,
      error: "Invite token is required.",
    };
  }

  const room = await prisma.room.findUnique({
    where: {
      token: trimmedToken,
    },
    include: {
      members: true,
    },
  });

  if (!room) {
    return {
      success: false,
      error: "Room not found.",
    };
  }

  const wasDeleted = await deleteExpiredRoom(room);

  if (wasDeleted) {
    return {
      success: false,
      error: "Room not found.",
    };
  }

  const isAlreadyMember = room.members.some(
    (member) => member.userId === session.user.id,
  );

  if (isAlreadyMember) {
    return {
      success: true,
      roomToken: room.token,
    };
  }

  await prisma.roomMember.create({
    data: {
      roomId: room.id,
      userId: session.user.id,
    },
  });

  return {
    success: true,
    roomToken: room.token,
  };
}
