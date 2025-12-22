import { z } from "zod";

// Schema for login form validation
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
  password: z.string().min(1, "Password is required."),
});

// Type for login form data
export type LoginFormData = z.infer<typeof loginSchema>;

// Schema for registration form validation
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email format.")
      .max(200, "Email cannot exceed 200 characters."),
    password: z
      .string()
      .min(1, "Password is required.")
      .min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    displayName: z
      .string()
      .max(50, "Display name cannot exceed 50 characters.")
      .nullable()
      .optional(),
  })
  // Ensures password and confirmPassword match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Type for registration form data
export type RegisterFormData = z.infer<typeof registerSchema>;

// Schema for login request payload
export const loginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

// Type for login request payload
export type LoginRequest = z.infer<typeof loginRequestSchema>;

// Schema for registration request payload
export const registerRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
  displayName: z.string().nullable().optional(),
});

// Type for registration request payload
export type RegisterRequest = z.infer<typeof registerRequestSchema>;

// Schema for authentication response
export const authResponseSchema = z.object({
  userId: z.string(),
  email: z.string(),
  displayName: z.string().nullable().optional(),
  token: z.string(),
});

// Type for authentication response
export type AuthResponse = z.infer<typeof authResponseSchema>;
// Login response type alias
export type LoginResponse = AuthResponse;
// Register response type alias
export type RegisterResponse = AuthResponse;

// Schema for current user response
export const currentUserResponseSchema = z.object({
  userId: z.string(),
  email: z.string(),
  displayName: z.string().nullable().optional(),
});

// Type for current user response
export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;

// Type for action state used in login and registration actions
export type ActionState = {
  success: boolean;
  message?: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
  inputs?: Record<string, unknown>;
};
