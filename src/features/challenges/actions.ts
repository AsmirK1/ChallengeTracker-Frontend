import {
  createChallengeSchema,
  joinChallengeSchema,
  type CreateChallengeResponse,
  type ActionState,
} from "./schemas";
import {
  createChallenge,
  joinChallenge,
  startChallenge,
  completeChallenge,
} from "./api";

// Re export ActionState type for external use
export type { ActionState };

// Action to handle creating a new challenge
export async function createChallengeAction(
  _prevState: ActionState<CreateChallengeResponse>,
  formData: FormData
): Promise<ActionState<CreateChallengeResponse>> {
  const rawData = Object.fromEntries(formData.entries());

  // Simple honeypot spam check
  if (rawData.website) {
    console.info("Honeypot triggered");
    return { success: false, error: "Spam detected" };
  }

  // Converts numeric fields
  const processedData = {
    ...rawData,
    targetAmount: rawData.targetAmount ? Number(rawData.targetAmount) : null,
    maxEntriesPerDay: rawData.maxEntriesPerDay
      ? Number(rawData.maxEntriesPerDay)
      : null,
  };

  // Validates input data
  const validatedFields = createChallengeSchema.safeParse(processedData);

  // Handles validation errors
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Attempts to create challenge
  try {
    const result = await createChallenge(validatedFields.data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to create challenge:", error);
    return {
      success: false,
      error: "Failed to create challenge. Please try again.",
    };
  }
}

// Action to handle joining a challenge
export async function joinChallengeAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = joinChallengeSchema.safeParse(rawData);

  // Handles validation errors
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Attempts to join challenge
  try {
    await joinChallenge(validatedFields.data.challengeId);
    return { success: true };
  } catch (error) {
    console.error("Failed to join challenge:", error);
    return {
      success: false,
      error: "Failed to join challenge. Please try again.",
    };
  }
}

// Action to handle starting a challenge
export async function startChallengeAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const challengeId = formData.get("challengeId") as string;

  // Validates challengeId presence
  if (!challengeId) {
    return { success: false, error: "Challenge ID is required" };
  }

  // Attempts to start challenge
  try {
    await startChallenge(challengeId);
    return { success: true };
  } catch (error) {
    console.error("Failed to start challenge:", error);
    return { success: false, error: "Failed to start challenge." };
  }
}

// Action to handle completing a challenge
export async function completeChallengeAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const challengeId = formData.get("challengeId") as string;

  // Validates challengeId presence
  if (!challengeId) {
    return { success: false, error: "Challenge ID is required" };
  }

  // Attempts to complete challenge
  try {
    await completeChallenge(challengeId);
    return { success: true };
  } catch (error) {
    console.error("Failed to complete challenge:", error);
    return { success: false, error: "Failed to complete challenge." };
  }
}
