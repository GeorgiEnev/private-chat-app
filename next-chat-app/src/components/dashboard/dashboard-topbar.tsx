import { DashboardProfileMenu } from "./dashboard-profile-menu";

type DashboardTopbarProps = {
  username: string;
  email?: string | null;
  avatarColor?: string | null;
};

export function DashboardTopbar({
  username,
  email,
  avatarColor,
}: DashboardTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-end px-2">
      <DashboardProfileMenu
        username={username}
        email={email}
        avatarColor={avatarColor}
      />
    </header>
  );
}
