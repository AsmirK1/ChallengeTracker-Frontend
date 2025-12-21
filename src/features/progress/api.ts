import { api } from "@/shared/api/api-client";
import {
  createProgressEntryResponseSchema,
  updateProgressEntryResponseSchema,
  type CreateProgressEntryRequest,
  type CreateProgressEntryResponse,
  type UpdateProgressEntryRequest,
  type UpdateProgressEntryResponse,
} from "./schemas";

// Base API version for progress endpoints
const API_VERSION = "/api/v1";

// Creates a new progress entry
export async function createProgressEntry(
  payload: CreateProgressEntryRequest
): Promise<CreateProgressEntryResponse> {
  const response = await api.post(`${API_VERSION}/progress-entries`, payload);
  return createProgressEntryResponseSchema.parse(response);
}

// Updates an existing progress entry
export async function updateProgressEntry(
  entryId: string,
  payload: UpdateProgressEntryRequest
): Promise<UpdateProgressEntryResponse> {
  const response = await api.patch(
    `${API_VERSION}/progress-entries/${entryId}`,
    payload
  );
  // Parses and returns the updated progress entry response
  return updateProgressEntryResponseSchema.parse(response);
}

// Deletes a progress entry by ID
export async function deleteProgressEntry(entryId: string): Promise<void> {
  return api.delete(`${API_VERSION}/progress-entries/${entryId}`);
}
