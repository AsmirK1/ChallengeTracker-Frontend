import {
  createProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
} from "./api";
import {
  createProgressEntryRequestSchema,
  updateProgressEntryRequestSchema,
  type ActionState,
} from "./schemas";

// Types
export type { ActionState };

// Action to log progress entry
export async function logProgressAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  // Processes date and time inputs
  let loggedAt: string | undefined;
  const date = rawData.date as string;
  const time = rawData.time as string;

  // Combines date and time into ISO string
  if (date || time) {
    const datePart = date || new Date().toLocaleDateString("en-CA");
    const timePart = time || "00:00";
    loggedAt = new Date(`${datePart}T${timePart}`).toISOString();
  }

  // Prepares data for validation
  const processedData = {
    ...rawData,
    amount: rawData.amount ? Number(rawData.amount) : 0,
    loggedAt,
  };

  // Validates input data
  const validatedFields =
    createProgressEntryRequestSchema.safeParse(processedData);

  // Handles validation errors
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Attempts to create progress entry
  try {
    await createProgressEntry(validatedFields.data);
    return { success: true };
  } catch (error) {
    console.error("Failed to log progress:", error);
    return {
      success: false,
      error: "Failed to log progress. Please try again.",
    };
  }
}

// Action to update progress entry
export async function updateProgressEntryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const entryId = formData.get("entryId") as string;
  const amount = formData.get("amount")
    ? Number(formData.get("amount"))
    : undefined;
  const note = formData.get("note") as string | undefined;

  // Validates entry ID
  if (!entryId) {
    return { success: false, error: "Entry ID is required" };
  }

  // Validates input fields
  const validatedFields = updateProgressEntryRequestSchema.safeParse({
    amount,
    note,
  });

  // Handles validation errors
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Attempts to update progress entry
  try {
    await updateProgressEntry(entryId, validatedFields.data);
    return { success: true };
  } catch (error) {
    console.error("Failed to update progress entry:", error);
    return { success: false, error: "Failed to update progress entry." };
  }
}

// Action to delete progress entry
export async function deleteProgressEntryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const entryId = formData.get("entryId") as string;

  // Validates entry ID
  if (!entryId) {
    return { success: false, error: "Entry ID is required" };
  }

  // Attempts to delete progress entry
  try {
    await deleteProgressEntry(entryId);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete progress entry:", error);
    return { success: false, error: "Failed to delete progress entry." };
  }
}
