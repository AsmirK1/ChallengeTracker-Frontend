import axios, { AxiosError, type AxiosResponse } from "axios";
import { queryClient } from "./query-client";
import {
  clearUserFromStorage,
  getUserFromStorage,
} from "@/shared/auth/userStorage";
import { isProblemDetails } from "@/shared/utils/problem-details";
import type { ProblemDetails } from "./types";

// Axios instance for API calls
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = getUserFromStorage();
    const token = user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    const status = error.response?.status;

    // Handles unauthorized errors
    if (status === 401) {
      handleAuthError();
      return Promise.reject(
        new ApiError("Session expired. Please log in again.", 401)
      );
    }

    // Checks for Problem Details in the response
    const contentType = error.response?.headers["content-type"];
    if (
      contentType?.includes("application/problem+json") ||
      contentType?.includes("application/json")
    ) {
      // Attempts to parse Problem Details
      const data = error.response?.data;
      if (isProblemDetails(data)) {
        return Promise.reject(new ProblemDetailsError(data));
      }
    }

    // Extracts and returns a general error message
    const message = extractErrorMessage(error);
    return Promise.reject(new ApiError(message, status ?? 500));
  }
);

// Custom error class for API errors
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  // Constructs an ApiError instance
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// Custom error class for Problem Details errors
export class ProblemDetailsError extends Error {
  public readonly problemDetails: ProblemDetails;

  // Constructs a ProblemDetailsError instance
  constructor(problemDetails: ProblemDetails) {
    super(problemDetails.title || "An error occurred");
    this.name = "ProblemDetailsError";
    this.problemDetails = problemDetails;
  }

  // Returns field specific errors
  get fieldErrors(): Record<string, string[]> {
    return this.problemDetails.errors ?? {};
  }

  // Retrieves first error for a specific field
  getFieldError(fieldName: string): string | null {
    const errors = this.fieldErrors[fieldName];
    return errors?.[0] ?? null;
  }

  // Checks if error is a validation error (HTTP 400)
  get isValidationError(): boolean {
    return this.problemDetails.status === 400;
  }
}

// Handles authentication errors by clearing user data and redirecting to login
function handleAuthError(): void {
  clearUserFromStorage();

  // Clear all cached queries
  queryClient.clear();

  // Redirect to login page if not already there
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/login")
  ) {
    window.location.href = "/login";
  }
}

// Extracts a user friendly error message from an AxiosError
function extractErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data;

    // Checks if data is a string message
    if (typeof data === "string" && data.length > 0) {
      return data;
    }

    // Checks if data is an object with common message fields
    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;
      if (typeof obj.message === "string") return obj.message;
      if (typeof obj.title === "string") return obj.title;
      if (typeof obj.detail === "string") return obj.detail;
    }
  }

  // Handles network errors
  if (error.code === "ERR_NETWORK") {
    return "Network error. Please check your connection.";
  }

  // Handles timeout errors
  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  // Fallback generic error message
  return error.message || "An unexpected error occurred";
}

// Type guard to check if error is ProblemDetailsError
export function isProblemDetailsError(
  error: unknown
): error is ProblemDetailsError {
  return error instanceof ProblemDetailsError;
}

// Type guard to check if error is ApiError
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
