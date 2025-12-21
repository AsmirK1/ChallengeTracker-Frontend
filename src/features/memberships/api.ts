import { api } from "@/shared/api/api-client";
import {
  joinChallengeResponseSchema,
  updateMembershipStatusResponseSchema,
  type JoinChallengeRequest,
  type JoinChallengeResponse,
  type UpdateMembershipStatusRequest,
  type UpdateMembershipStatusResponse,
} from "./schemas";

// Base API version for membership endpoints
const API_VERSION = "/api/v1";

// Joins a challenge with provided membership details
export async function joinChallenge(
  payload: JoinChallengeRequest
): Promise<JoinChallengeResponse> {
  const response = await api.post(`${API_VERSION}/memberships`, payload);
  return joinChallengeResponseSchema.parse(response);
}

// Leaves a challenge by membership ID
export async function leaveChallenge(membershipId: string): Promise<void> {
  return api.delete(`${API_VERSION}/memberships/${membershipId}`);
}

// Updates status of a membership (approve/reject)
export async function updateMembershipStatus(
  membershipId: string,
  payload: UpdateMembershipStatusRequest
): Promise<UpdateMembershipStatusResponse> {
  const response = await api.patch(
    `${API_VERSION}/memberships/${membershipId}/status`,
    payload
  );
  return updateMembershipStatusResponseSchema.parse(response);
}
