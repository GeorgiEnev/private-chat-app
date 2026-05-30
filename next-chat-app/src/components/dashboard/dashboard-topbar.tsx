import { DashboardProfileMenu } from "./dashboard-profile-menu";

type DashboardTopbarProps = {
  username: string;
  email?: string | null;
};

export function DashboardTopbar({ username, email }: DashboardTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-end px-2">
      <DashboardProfileMenu username={username} email={email} />
    </header>
  );
}
