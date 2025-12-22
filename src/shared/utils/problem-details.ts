import type { ProblemDetails } from "../api/types";

// Type guard to check if an object conforms to the ProblemDetails structure
export const isProblemDetails = (data: unknown): data is ProblemDetails => {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.type === "string" &&
    typeof obj.title === "string" &&
    typeof obj.status === "number"
  );
};

// Extracts field specific errors from a ProblemDetails object
export const extractFieldErrors = (
  problem: ProblemDetails
): Record<string, string[]> => {
  return problem.errors ?? {};
};

// Retrieves the first error message for a specific field from a ProblemDetails object
export const getFirstFieldError = (
  problem: ProblemDetails,
  fieldName: string
): string | null => {
  const errors = problem.errors?.[fieldName];
  return errors?.[0] ?? null;
};

// Applies Problem Details errors to a form using a setError function
export const applyProblemDetailsToForm = <T extends string>(
  problem: ProblemDetails,
  setError: (name: T, error: { type: string; message: string }) => void
): void => {
  const errors = problem.errors ?? {};

  for (const [field, messages] of Object.entries(errors)) {
    if (messages.length > 0) {
      const camelCaseField = field.charAt(0).toLowerCase() + field.slice(1);
      setError(camelCaseField as T, {
        type: "server",
        message: messages[0],
      });
    }
  }
};

// Retrieves all error messages from a ProblemDetails object
export const getAllErrorMessages = (problem: ProblemDetails): string[] => {
  const errors = problem.errors ?? {};
  return Object.values(errors).flat();
};

// Generates a summary error message from a ProblemDetails object
export const getErrorSummary = (problem: ProblemDetails): string => {
  if (problem.detail) return problem.detail;
  if (problem.title) return problem.title;

  const allErrors = getAllErrorMessages(problem);
  if (allErrors.length > 0) return allErrors[0];

  return "An error occurred";
};
