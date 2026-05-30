import Link from "next/link";
import { redirect } from "next/navigation";

import { RoomChat } from "@/components/messages/room-chat";
import { getSession } from "@/server/auth/get-session";
import { getRoomByToken } from "@/server/rooms/get-room-by-token";
import { MemberListItem } from "@/components/rooms/member-list-item";

type RoomPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { token } = await params;

  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const room = await getRoomByToken(token);

  if (!room) {
    redirect("/dashboard");
  }

  const isMember = room.members.some(
    (member) => member.userId === session.user.id,
  );

  if (!isMember) {
    redirect("/dashboard");
  }

  return (
    <div className="grid h-screen grid-cols-[240px_1fr_220px] bg-black text-white">
      <aside className="border-r border-[#111111] bg-[#070707] px-5 py-5">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-white"
        >
          <span>←</span>
          Dashboard
        </Link>

        <div className="mt-8 rounded-2xl bg-[#0d0d0d] p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-600">
            Invite token
          </p>

          <p className="mt-3 break-all font-mono text-sm text-neutral-400">
            {room.token}
          </p>
        </div>
      </aside>

      <RoomChat
        roomId={room.id}
        roomName={room.name}
        roomToken={room.token}
        initialMessages={room.messages.map((message) => ({
          id: message.id,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          sender: {
            id: message.sender.id,
            name: message.sender.name,
            image: message.sender.image,
          },
        }))}
      />

      <aside className="bg-[#070707] px-5 py-5">
        <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
          Members
        </p>

        <div className="mt-5 space-y-2">
          {room.members.map((member) => (
            <MemberListItem
              key={member.id}
              member={member}
              isOwner={member.userId === room.ownerId}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}
