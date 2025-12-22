import { leaveChallenge, updateMembershipStatus } from "./api";
import type { ActionState } from "./schemas";
import { MembershipStatus } from "@/shared/constants";

// Types
export type { ActionState };

// Action to leave a challenge
export async function leaveChallengeAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const membershipId = formData.get("membershipId") as string;
  if (!membershipId) {
    return { success: false, error: "Membership ID is required" };
  }

  // Attempts to leave the challenge
  try {
    await leaveChallenge(membershipId);
    return { success: true };
  } catch (error) {
    console.error("Failed to leave challenge:", error);
    return { success: false, error: "Failed to leave challenge." };
  }
}

// Action to update membership status (approve/reject)
export async function updateMembershipStatusAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const membershipId = formData.get("membershipId") as string;
  const status = formData.get("status") as string;

  // Validates input
  if (!membershipId || !status) {
    return { success: false, error: "Membership ID and status are required" };
  }

  // Attempts to update the membership status
  try {
    await updateMembershipStatus(membershipId, {
      status: status as
        | typeof MembershipStatus.Active
        | typeof MembershipStatus.Rejected,
    });
    return { success: true };
    // Catches and logs errors
  } catch (error) {
    console.error("Failed to update membership status:", error);
    return { success: false, error: "Failed to update membership status." };
  }
}
