type DashboardSidebarProps = {
  onCreateRoom: () => void;
};

export function DashboardSidebar({ onCreateRoom }: DashboardSidebarProps) {
  return (
    <aside className="flex h-screen w-65 flex-col bg-[#070707]">
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111]">
            <span className="text-sm font-semibold text-violet-400">P</span>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-tight text-white">
              PrivateChat
            </p>

            <p className="text-xs text-neutral-600">Secure workspace</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6">
        <button
          onClick={onCreateRoom}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#111111] text-sm font-medium text-neutral-200 transition hover:bg-[#171717]"
        >
          <span className="text-base">+</span>
          Create room
        </button>
      </div>

      <div className="px-5 pt-10">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-700">
          Navigation
        </p>

        <nav className="space-y-1">
          <button className="flex h-11 w-full items-center gap-3 rounded-xl bg-[#111111] px-3 text-sm font-medium text-white">
            <span className="text-neutral-400">⌂</span>
            Dashboard
          </button>

          <button className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-neutral-500 transition hover:bg-[#111111] hover:text-white">
            <span>✦</span>
            Invitations
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-700">
            Rooms
          </p>

          <button className="text-lg text-neutral-700 transition hover:text-white">
            +
          </button>
        </div>

        <div className="rounded-2xl bg-[#0d0d0d] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141414] text-neutral-500">
              #
            </div>

            <div>
              <p className="text-sm font-medium text-white">No rooms yet</p>

              <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                Create a private room to start chatting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
