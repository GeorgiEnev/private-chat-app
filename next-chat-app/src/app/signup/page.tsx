import { AuthCard } from "@/components/auth/auth-card";
import { InputField } from "@/components/auth/input-field";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <AuthCard
        title="Create account"
        description="Create a secure private chat account."
      >
        <form className="space-y-5">
          <InputField label="Username" placeholder="Enter your username" />

          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            Create account
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
