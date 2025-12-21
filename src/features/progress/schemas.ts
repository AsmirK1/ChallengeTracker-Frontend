import { z } from "zod";
import type { ChallengeDetail } from "../challenges/schemas";
import type { StoredUser } from "@/shared/auth/userStorage";

// Schema for creating a progress entry
export const createProgressEntrySchema = z.object({
  challengeId: z
    .string()
    .min(1, "Challenge ID is required.")
    .uuid("Invalid challenge ID format."),
  amount: z.number().gt(0, "Amount must be greater than zero."),
  note: z
    .string()
    .max(200, "Note must be 200 characters or fewer.")
    .nullable()
    .optional(),
  loggedAt: z.string().nullable().optional(),
});

// Type for creating a progress entry form data
export type CreateProgressEntryFormData = z.infer<
  typeof createProgressEntrySchema
>;

// Schema for updating a progress entry
export const updateProgressEntrySchema = z
  .object({
    amount: z
      .number()
      .gt(0, "Amount must be greater than zero.")
      .nullable()
      .optional(),
    note: z
      .string()
      .max(200, "Note must be 200 characters or fewer.")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      return data.amount !== undefined || data.note !== undefined;
    },
    {
      message: "Provide at least one field to update.",
      path: ["amount"],
    }
  );

// Type for updating a progress entry form data
export type UpdateProgressEntryFormData = z.infer<
  typeof updateProgressEntrySchema
>;

// Schema for progress log form
export const progressLogFormSchema = z.object({
  amount: z
    .number({ message: "Amount must be a valid number." })
    .gt(0, "Amount must be greater than zero."),
  note: z.string().max(200, "Note must be 200 characters or fewer.").optional(),
  loggedAt: z.string().optional(),
});

// Type for progress log form data
export type ProgressLogFormData = z.infer<typeof progressLogFormSchema>;

// Schema for progress edit form
export const progressEditFormSchema = z
  .object({
    amount: z
      .number({ message: "Amount must be a valid number." })
      .gt(0, "Amount must be greater than zero.")
      .optional(),
    note: z
      .string()
      .max(200, "Note must be 200 characters or fewer.")
      .optional(),
  })
  .refine(
    (data) => {
      return data.amount !== undefined || data.note !== undefined;
    },
    {
      message: "Provide at least one field to update.",
      path: ["amount"],
    }
  );

// Type for progress edit form data
export type ProgressEditFormData = z.infer<typeof progressEditFormSchema>;

// Schema for create progress entry request
export const createProgressEntryRequestSchema = z.object({
  challengeId: z.string(),
  amount: z.number(),
  loggedAt: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

// Type for create progress entry request
export type CreateProgressEntryRequest = z.infer<
  typeof createProgressEntryRequestSchema
>;

// Schema for update progress entry request
export const updateProgressEntryRequestSchema = z.object({
  amount: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
});

// Type for action state with optional data
export type ActionState<T = unknown> = {
  success: boolean;
  error?: string | Record<string, string[]>;
  data?: T;
};

// Type for update progress entry request
export type UpdateProgressEntryRequest = z.infer<
  typeof updateProgressEntryRequestSchema
>;

// Schema for create progress entry response
export const createProgressEntryResponseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  loggedAt: z.string(),
  note: z.string().nullable(),
});

// Type for create progress entry response
export type CreateProgressEntryResponse = z.infer<
  typeof createProgressEntryResponseSchema
>;

// Schema for update progress entry response
export const updateProgressEntryResponseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  loggedAt: z.string(),
  note: z.string().nullable(),
});

// Type for update progress entry response
export type UpdateProgressEntryResponse = z.infer<
  typeof updateProgressEntryResponseSchema
>;

// Props for ChallengeRecentLogs component
export interface ChallengeRecentLogsProps {
  challenge: ChallengeDetail;
  user: StoredUser | null;
  onUpdateEntry: (
    entryId: string,
    amount: number,
    note: string | undefined
  ) => Promise<void>;
  onDeleteEntry: (entryId: string) => void;
  isUpdatePending: boolean;
}

// Props for LogProgressForm component
export interface LogProgressFormProps {
  challengeId: string;
  targetMetric: string;
  onSuccess?: () => void;
}

// Props for ProgressLogForm component
export type ProgressLogFormProps = {
  challengeId: string;
  startDate: string;
  endDate: string;
  maxEntriesPerDay: number | null;
  onSuccess?: () => void;
};
