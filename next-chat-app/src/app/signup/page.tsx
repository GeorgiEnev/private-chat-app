"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signUpUser } from "@/actions/auth-actions";
import { AuthCard } from "@/components/auth/auth-card";
import { InputField } from "@/components/auth/input-field";
import { validateSignupInput } from "@/lib/validators/auth-validator";

export default function SignUpPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const validationResult = validateSignupInput({
      username,
      email,
      password,
    });

    if (!validationResult.success) {
      setError(validationResult.error ?? "Invalid form data.");

      return;
    }

    setIsLoading(true);

    try {
      const result = await signUpUser({
        username,
        email,
        password,
      });

      if (!result.success) {
        setError(result.error ?? "Failed to create account.");

        return;
      }

      setUsername("");
      setEmail("");
      setPassword("");

      router.push("/login");
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
        title="Create account"
        description="Create a secure private chat account."
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={setUsername}
          />

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
            {isLoading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Login
            </Link>
          </p>
        </form>
      </AuthCard>
    </main>
  );
}
