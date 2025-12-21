import { api } from "@/shared/api/api-client";
import type {
  CreateChallengeRequest,
  CreateChallengeResponse,
  ChallengeListItemResponse,
  ChallengeDetail,
  GetChallengesRequest,
  GetDiscoverableChallengesRequest,
  DiscoverChallengeItem,
  DiscoverChallengesResponse,
} from "./schemas";
import { ChallengeVisibility, UserMembershipStatus } from "@/shared/constants";

// Base API version for challenge endpoints
const API_VERSION = "/api/v1";

// Creates a new challenge with provided details
export async function createChallenge(
  payload: CreateChallengeRequest
): Promise<CreateChallengeResponse> {
  return api.post(`${API_VERSION}/challenges`, payload);
}

// Retrieves a list of challenges with optional filtering
export async function getChallenges(
  params?: GetChallengesRequest
): Promise<ChallengeListItemResponse[]> {
  return api.get(`${API_VERSION}/challenges`, { params });
}

// Retrieves a list of discoverable challenges
export async function getDiscoverableChallenges(
  params?: GetDiscoverableChallengesRequest
): Promise<ChallengeListItemResponse[]> {
  const response: DiscoverChallengesResponse = await api.get(
    `${API_VERSION}/challenges/discover`,
    { params }
  );
  // Maps discoverable challenges to standard challenge list item format
  return response.challenges.map(
    (c: DiscoverChallengeItem): ChallengeListItemResponse => ({
      ...c,
      visibility: ChallengeVisibility.Public, // Default visibility for discoverable challenges
      userStatus: UserMembershipStatus.NotJoined, // Default user status for discoverable challenges
    })
  );
}

// Retrieves detailed information about a specific challenge
export async function getChallengeDetail(id: string): Promise<ChallengeDetail> {
  return api.get(`${API_VERSION}/challenges/${id}`);
}

// Starts a challenge for user
export async function startChallenge(
  challengeId: string
): Promise<{ challengeId: string; status: string }> {
  return api.post(`${API_VERSION}/challenges/${challengeId}/start`);
}

// Completes a challenge for user
export async function completeChallenge(
  challengeId: string
): Promise<{ challengeId: string; status: string }> {
  return api.post(`${API_VERSION}/challenges/${challengeId}/complete`);
}

// Joins a challenge for user
export async function joinChallenge(challengeId: string): Promise<void> {
  return api.post(`${API_VERSION}/memberships`, { challengeId });
}
