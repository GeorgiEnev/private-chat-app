"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signInUser } from "@/actions/auth-actions";
import { AuthCard } from "@/components/auth/auth-card";
import { InputField } from "@/components/auth/input-field";
import { validateLoginInput } from "@/lib/validators/auth-validator";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const validationResult = validateLoginInput({
      email,
      password,
    });

    if (!validationResult.success) {
      setError(validationResult.error ?? "Invalid form data.");

      return;
    }

    setIsLoading(true);

    try {
      const result = await signInUser({
        email,
        password,
      });

      if (!result.success) {
        setError(result.error ?? "Failed to login.");

        return;
      }

      setEmail("");
      setPassword("");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <AuthCard
        title="Welcome back"
        description="Login to continue your private conversations."
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
          />

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-white hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </AuthCard>
    </main>
  );
}
