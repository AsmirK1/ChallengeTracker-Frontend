import { isAxiosError } from "axios";
import { loginUser, registerUser } from "./api";
import { loginSchema, registerSchema, type ActionState } from "./schemas";
import { saveUserToStorage } from "../../shared/auth/userStorage";

export type { ActionState };

// Action to handle user login
export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData);

  // Simple honeypot spam check
  if (data.website) {
    return { success: false, message: "Spam detected" };
  }

  // Validates input data
  const parsed = loginSchema.safeParse(data);

  // Handles validation errors
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
      inputs: data,
    };
  }

  // Attempts to log in user
  try {
    const user = await loginUser(parsed.data);
    saveUserToStorage({
      id: user.userId,
      email: user.email,
      displayName: user.displayName,
      token: user.token,
    });
    // Successful login
    return {
      success: true,
      message: "Login successful",
    };
    // Handles login errors
  } catch (error) {
    let message = "An unexpected error occurred.";
    if (isAxiosError(error)) {
      message = error.response?.data?.detail || error.message;
    }
    // Failed login
    return {
      success: false,
      message,
      inputs: data,
    };
  }
}

// Action to handle user registration
export async function registerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData);

  // Simple honeypot spam check
  if (data.website) {
    return { success: false, message: "Spam detected" };
  }

  // Remove empty displayName to treat as optional
  if (data.displayName === "") {
    delete data.displayName;
  }

  // Validates input data
  const parsed = registerSchema.safeParse(data);

  // Handles validation errors
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
      inputs: data,
    };
  }

  // Attempts to register user
  try {
    const user = await registerUser({
      ...parsed.data,
      displayName: parsed.data.displayName ?? null,
    });
    // Successful registration
    saveUserToStorage({
      id: user.userId,
      email: user.email,
      displayName: user.displayName,
      token: user.token,
    });
    // Successful registration
    return {
      success: true,
      message: "Registration successful",
    };
    // Handles registration errors
  } catch (error) {
    let message = "An unexpected error occurred.";
    // Failed registration
    if (isAxiosError(error)) {
      message = error.response?.data?.detail || error.message;
    }
    // Returns failed registration
    return {
      success: false,
      message,
      inputs: data,
    };
  }
}
