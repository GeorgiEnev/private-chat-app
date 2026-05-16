"use server";

import { auth } from "@/lib/auth";

type SignUpData = {
  username: string;
  email: string;
  password: string;
};

export async function signUpUser({ username, email, password }: SignUpData) {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
      },
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to create account.",
    };
  }
}
