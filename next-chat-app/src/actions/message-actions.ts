"use server";

import { getSession } from "@/server/auth/get-session";
import { createRoomMessageForMember } from "@/server/messages/message-service";

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
