import { DashboardProfileMenu } from "./dashboard-profile-menu";

type DashboardTopbarProps = {
  username: string;
};

export function DashboardTopbar({ username }: DashboardTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-end px-2">
      <DashboardProfileMenu username={username} />
    </header>
  );
}
