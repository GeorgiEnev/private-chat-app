import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>

        <p className="text-sm leading-relaxed text-neutral-400">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}
