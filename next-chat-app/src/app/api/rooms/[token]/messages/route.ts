import { NextResponse } from "next/server";

import { getSession } from "@/server/auth/get-session";
import { getRoomMessagesForMember } from "@/server/messages/message-service";

type MessagesRouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(request: Request, context: MessagesRouteContext) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { token } = await context.params;
  const { searchParams } = new URL(request.url);
  const afterMessageId = searchParams.get("after");

  const result = await getRoomMessagesForMember({
    roomToken: token,
    userId: session.user.id,
    afterMessageId,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    messages: result.messages,
  });
}
