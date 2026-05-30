import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ProfileForm } from "@/components/profile/profile-form";
import { DEFAULT_AVATAR_COLOR } from "@/lib/avatar-colors";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/server/auth/get-session";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      avatarColor: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <DashboardTopbar
        username={user.name}
        email={user.email}
        avatarColor={user.avatarColor}
      />

      <section className="px-8 py-8">
        <div className="mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-700">
            Account
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Profile</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">
            Manage your profile.
          </p>
        </div>

        <ProfileForm
          user={{
            name: user.name,
            email: user.email,
            avatarColor: user.avatarColor ?? DEFAULT_AVATAR_COLOR,
          }}
        />
      </section>
    </DashboardLayout>
  );
}
