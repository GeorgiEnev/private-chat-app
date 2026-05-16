"use client";

import { useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { InputField } from "@/components/auth/input-field";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
      console.log({
        username,
        email,
        password,
      });
    } catch (error) {
      console.error(error);
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
        <form className="space-y-5" onSubmit={handleSubmit}>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
