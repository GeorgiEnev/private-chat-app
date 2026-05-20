import LogoutButton from "@/components/auth/logout-button";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="border-b border-neutral-900">
        <div className="flex items-center justify-end px-6 py-5">
          <LogoutButton />
        </div>
      </div>

      <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-6">
        <div className="space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-neutral-500">
            Dashboard
          </p>

          <h1 className="max-w-5xl text-5xl font-bold leading-tight tracking-tight">
            Welcome to your private chat workspace.
          </h1>
        </div>
      </section>
    </main>
  );
}
