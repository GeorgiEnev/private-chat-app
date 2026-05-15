import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
              Private Chat Platform
            </p>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Temporary private conversations.
            </h1>

            <p className="mx-auto max-w-xl text-lg leading-relaxed text-neutral-400">
              Create secure private chat rooms with real-time messaging,
              anonymous aliases, and destructible sessions.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/signup"
              className="w-full rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 sm:w-auto"
            >
              Create account
            </Link>

            <Link
              href="/login"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:border-neutral-700 hover:bg-neutral-800 sm:w-auto"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
