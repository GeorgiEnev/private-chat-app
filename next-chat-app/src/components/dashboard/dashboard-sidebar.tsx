import { getSession } from "@/server/auth/get-session";
import { getUserRooms } from "@/actions/get-user-rooms";

import { DashboardSidebarClient } from "./dashboard-sidebar-client";

export async function DashboardSidebar() {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  const rooms = await getUserRooms(session.user.id);

  return <DashboardSidebarClient rooms={rooms} />;
}
