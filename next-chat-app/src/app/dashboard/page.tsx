import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";

import { DEFAULT_AVATAR_COLOR } from "@/lib/avatar-colors";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/get-session";

export default async function DashboardPage() {
  const session = await getSession();

  const username = session?.user?.name ?? "User";
  const email = session?.user?.email ?? null;
  const userProfile = session?.user
    ? await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          avatarColor: true,
        },
      })
    : null;

  return (
    <DashboardLayout>
      <DashboardTopbar
        username={username}
        email={email}
        avatarColor={userProfile?.avatarColor ?? DEFAULT_AVATAR_COLOR}
      />

      <section className="flex h-[calc(100vh-80px)] items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-neutral-900 bg-neutral-950">
            <span className="text-5xl text-neutral-700">#</span>
          </div>

          <h2 className="mt-8 text-3xl font-semibold text-white">
            No room selected
          </h2>

          <p className="mt-4 max-w-md text-neutral-500">
            Create a new private room or select one from the sidebar to start
            chatting.
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}
