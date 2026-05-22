import { redirect } from "next/navigation";

import { getSession } from "@/server/auth/get-session";
import { getRoomByToken } from "@/server/rooms/get-room-by-token";
import Link from "next/link";

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
    <div className="flex h-[calc(100vh-64px)] flex-col p-8">
      <div className="border-b border-[#141414] pb-6">
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 rounded-lg px-0 py-1 text-sm font-medium text-neutral-500 transition-all hover:text-white"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            ←
          </span>
          <span>Back to dashboard</span>
        </Link>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-600">
          Active room
        </p>

        <h1 className="mt-4 text-3xl font-semibold text-white">{room.name}</h1>

        <p className="mt-2 text-sm text-neutral-500">
          {room.isDestructible ? "Destructible room" : "Persistent room"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          {room.messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-20">
              <div className="text-center">
                <p className="text-5xl text-neutral-800">#</p>

                <p className="mt-6 text-neutral-500">No messages yet.</p>
              </div>
            </div>
          ) : (
            room.messages.map((message) => (
              <div
                key={message.id}
                className="rounded-2xl border border-[#141414] bg-[#0a0a0a] p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <p className="text-sm font-medium text-white">
                    {message.sender.name}
                  </p>

                  <p className="text-xs text-neutral-600">
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
    </div>
  );
}
