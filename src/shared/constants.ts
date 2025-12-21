// Challenge status constants
export const ChallengeStatus = {
  Open: "Open",
  Running: "Running",
  Completed: "Completed",
} as const;
// Type for challenge status
export type ChallengeStatus =
  (typeof ChallengeStatus)[keyof typeof ChallengeStatus];

// Challenge visibility constants
export const ChallengeVisibility = {
  Public: "Public",
  Private: "Private",
} as const;
// Type for challenge visibility
export type ChallengeVisibility =
  (typeof ChallengeVisibility)[keyof typeof ChallengeVisibility];

// Membership status constants
export const MembershipStatus = {
  Pending: "Pending",
  Active: "Active",
  Rejected: "Rejected",
} as const;
// Type for membership status
export type MembershipStatus =
  (typeof MembershipStatus)[keyof typeof MembershipStatus];

// User membership status constants
export const UserMembershipStatus = {
  NotJoined: "NotJoined",
  Member: "Member",
  Owner: "Owner",
} as const;
// Type for user membership status
export type UserMembershipStatus =
  (typeof UserMembershipStatus)[keyof typeof UserMembershipStatus];

// Error type constants
export const ErrorType = {
  NotFound: "NotFound",
  Unauthorized: "Unauthorized",
  Forbidden: "Forbidden",
  Validation: "Validation",
  Conflict: "Conflict",
  BadRequest: "BadRequest",
} as const;
// Type for error types
export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];
