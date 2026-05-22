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

      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-5xl text-neutral-800">#</p>

          <p className="mt-6 text-neutral-500">Messaging system coming next.</p>
        </div>
      </div>
    </div>
  );
}
