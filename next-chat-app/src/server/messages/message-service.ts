import { prisma } from "@/lib/prisma";
import { deleteExpiredRoom } from "@/server/rooms/room-expiry";

export const MESSAGE_MAX_LENGTH = 2_000;
export const MESSAGE_PAGE_SIZE = 50;

export type SerializedMessage = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
};

type MessageResult =
  | {
      success: true;
      message: SerializedMessage;
    }
  | {
      success: false;
      error: string;
      status: 400 | 401 | 404;
    };

export function validateMessageContent(content: string) {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return {
      success: false as const,
      error: "Message cannot be empty.",
    };
  }

  if (trimmedContent.length > MESSAGE_MAX_LENGTH) {
    return {
      success: false as const,
      error: `Message cannot be longer than ${MESSAGE_MAX_LENGTH} characters.`,
    };
  }

  return {
    success: true as const,
    content: trimmedContent,
  };
}

export async function createRoomMessageForMember({
  roomId,
  senderId,
  content,
}: {
  roomId: string;
  senderId: string;
  content: string;
}): Promise<MessageResult> {
  const validation = validateMessageContent(content);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error,
      status: 400,
    };
  }

  const membership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId: senderId,
      },
    },
    select: {
      id: true,
      room: {
        select: {
          id: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!membership || (await deleteExpiredRoom(membership.room))) {
    return {
      success: false,
      error: "Room not found.",
      status: 404,
    };
  }

  const message = await prisma.message.create({
    data: {
      content: validation.content,
      roomId,
      senderId,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return {
    success: true,
    message: serializeMessage(message),
  };
}

export async function getRoomMessagesForMember({
  roomToken,
  userId,
  afterMessageId,
}: {
  roomToken: string;
  userId: string;
  afterMessageId?: string | null;
}) {
  const room = await prisma.room.findUnique({
    where: {
      token: roomToken,
    },
    select: {
      id: true,
      expiresAt: true,
      members: {
        where: {
          userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!room || room.members.length === 0 || (await deleteExpiredRoom(room))) {
    return {
      success: false as const,
      error: "Room not found.",
      status: 404 as const,
    };
  }

  const afterMessage = afterMessageId
    ? await prisma.message.findFirst({
        where: {
          id: afterMessageId,
          roomId: room.id,
        },
        select: {
          createdAt: true,
        },
      })
    : null;

  const messages = afterMessage
    ? await prisma.message.findMany({
        where: {
          roomId: room.id,
          createdAt: {
            gt: afterMessage.createdAt,
          },
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: MESSAGE_PAGE_SIZE,
      })
    : (
        await prisma.message.findMany({
          where: {
            roomId: room.id,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: MESSAGE_PAGE_SIZE,
        })
      ).reverse();

  return {
    success: true as const,
    messages: messages.map(serializeMessage),
  };
}

function serializeMessage(message: {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
}): SerializedMessage {
  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    sender: message.sender,
  };
}
