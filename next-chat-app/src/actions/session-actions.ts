"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function signOutUser() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to sign out.",
    };
  }
}
