// Utility functions for date parsing and formatting
export const parseISODate = (isoString: string): Date => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${isoString}`);
  }
  return date;
};

// Converts a Date, string, or number to an ISO string
export const toISOString = (date: Date | string | number): string => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString();
};

// Formats an ISO date string to a readable date format
export const formatDate = (
  isoString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string => {
  return new Intl.DateTimeFormat(undefined, options).format(
    parseISODate(isoString)
  );
};

// Formats an ISO date string to a readable date and time format
export const formatDateTime = (isoString: string): string => {
  return formatDate(isoString, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Formats an ISO date string to a relative time description
export const formatRelativeTime = (isoString: string): string => {
  const date = parseISODate(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return formatDate(isoString);
};

// Converts a date input value (YYYY-MM-DD) to an ISO string
export const dateInputToISO = (dateInputValue: string): string => {
  return new Date(dateInputValue).toISOString();
};

// Converts an ISO string to a date input value (YYYY-MM-DD)
export const isoToDateInput = (isoString: string): string => {
  return parseISODate(isoString).toISOString().slice(0, 10);
};
