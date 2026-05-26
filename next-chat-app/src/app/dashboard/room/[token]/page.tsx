import Link from "next/link";
import { redirect } from "next/navigation";

import { MessageInput } from "@/components/messages/message-input";
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

      <main className="flex min-w-0 flex-col border-r border-[#111111]">
        <header className="flex h-16 items-center justify-between border-b border-[#111111] px-6">
          <div>
            <h2 className="text-sm font-medium text-white">{room.name}</h2>

            <p className="text-xs text-neutral-600">
              {room.messages.length} messages
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-1">
            {room.messages.length === 0 ? (
              <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl text-neutral-800">#</p>

                  <p className="mt-5 text-sm text-neutral-600">
                    No messages yet.
                  </p>
                </div>
              </div>
            ) : (
              room.messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-xl px-3 py-2 transition hover:bg-[#0d0d0d]"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-medium text-green-700">
                      {message.sender.name}
                    </p>

                    <p className="text-xs text-neutral-700">
                      {message.createdAt.toLocaleTimeString()}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-neutral-300">
                    {message.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <MessageInput roomId={room.id} />
      </main>

      <aside className="bg-[#070707] px-5 py-5">
        <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
          Members
        </p>

        <div className="mt-5 space-y-2">
          {room.members.map((member) => (
            <div key={member.id}>
              {room.members.map((member) => (
                <MemberListItem
                  key={member.id}
                  member={member}
                  isOwner={member.userId === room.ownerId}
                />
              ))}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
