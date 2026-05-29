type ValidationResult = {
  success: boolean;
  error?: string;
};

export const USERNAME_MAX_LENGTH = 30;

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

export function validateSignupInput({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): ValidationResult {
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();

  if (!trimmedUsername) {
    return {
      success: false,
      error: "Username is required.",
    };
  }

  if (trimmedUsername.length < 3) {
    return {
      success: false,
      error: "Username must be at least 3 characters.",
    };
  }

  if (trimmedUsername.length > USERNAME_MAX_LENGTH) {
    return {
      success: false,
      error: `Username must be ${USERNAME_MAX_LENGTH} characters or less.`,
    };
  }

  if (!trimmedEmail) {
    return {
      success: false,
      error: "Email is required.",
    };
  }

  if (!isValidEmail(trimmedEmail)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    };
  }

  if (!password) {
    return {
      success: false,
      error: "Password is required.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters.",
    };
  }

  return {
    success: true,
  };
}

export function validateLoginInput({
  email,
  password,
}: {
  email: string;
  password: string;
}): ValidationResult {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      success: false,
      error: "Email is required.",
    };
  }

  if (!isValidEmail(trimmedEmail)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    };
  }

  if (!password) {
    return {
      success: false,
      error: "Password is required.",
    };
  }

  return {
    success: true,
  };
}
