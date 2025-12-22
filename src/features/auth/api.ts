import { api } from "@/shared/api/api-client";
import {
  authResponseSchema,
  currentUserResponseSchema,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type CurrentUserResponse,
} from "./schemas";

// Base API version for authentication endpoints
const API_VERSION = "/api/v1";

// Logs in a user with provided credentials
export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await api.post(`${API_VERSION}/auth/login`, payload);
  return authResponseSchema.parse(response);
}

// Registers a new user with provided details
export async function registerUser(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const response = await api.post(`${API_VERSION}/auth/register`, payload);
  return authResponseSchema.parse(response);
}

// Retrieves the currently authenticated user's information
export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await api.get(`${API_VERSION}/auth/me`);
  return currentUserResponseSchema.parse(response);
}
