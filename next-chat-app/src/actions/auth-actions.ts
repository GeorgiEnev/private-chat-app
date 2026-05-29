"use server";

import { auth } from "@/lib/auth";
import { validateSignupInput } from "@/lib/validators/auth-validator";

type SignUpData = {
  username: string;
  email: string;
  password: string;
};

export async function signUpUser({ username, email, password }: SignUpData) {
  const validationResult = validateSignupInput({
    username,
    email,
    password,
  });

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error ?? "Invalid signup data.",
    };
  }

  try {
    const response = await auth.api.signUpEmail({
      body: {
        email: email.trim(),
        password,
        name: username.trim(),
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

type SignInData = {
  email: string;
  password: string;
};

export async function signInUser({ email, password }: SignInData) {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Something went wrong.",
    };
  }
}
