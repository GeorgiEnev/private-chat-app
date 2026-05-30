"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { DEFAULT_AVATAR_COLOR, isAvatarColor } from "@/lib/avatar-colors";
import { prisma } from "@/lib/prisma";

type UpdateProfileInput = {
  name: string;
  avatarColor: string;
};

export async function updateProfile({ name, avatarColor }: UpdateProfileInput) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      success: false,
      error: "Name is required.",
    };
  }

  if (trimmedName.length > 80) {
    return {
      success: false,
      error: "Name cannot be longer than 80 characters.",
    };
  }

  if (!isAvatarColor(avatarColor)) {
    return {
      success: false,
      error: "Choose a valid avatar color.",
    };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized.",
      };
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: trimmedName,
        avatarColor: avatarColor || DEFAULT_AVATAR_COLOR,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to update profile.",
    };
  }
}
