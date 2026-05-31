"use server";

import { getSession } from "@/server/auth/get-session";
import {
  createRoomMessageForMember,
  deleteRoomMessageForSender,
  updateRoomMessageForSender,
} from "@/server/messages/message-service";

type CreateMessageInput = {
  roomId: string;
  content: string;
};

type UpdateMessageInput = {
  messageId: string;
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

  const result = await createRoomMessageForMember({
    roomId,
    content,
    senderId: session.user.id,
  });

  return result.success
    ? {
        success: true,
        message: result.message,
      }
    : {
        success: false,
        error: result.error,
      };
}

export async function updateMessage({
  messageId,
  content,
}: UpdateMessageInput) {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const result = await updateRoomMessageForSender({
    messageId,
    content,
    senderId: session.user.id,
  });

  return result.success
    ? {
        success: true,
        message: result.message,
      }
    : {
        success: false,
        error: result.error,
      };
}

export async function deleteMessage(messageId: string) {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  const result = await deleteRoomMessageForSender({
    messageId,
    senderId: session.user.id,
  });

  return result.success
    ? {
        success: true,
        message: result.message,
      }
    : {
        success: false,
        error: result.error,
      };
}
