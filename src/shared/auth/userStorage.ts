export type StoredUser = {
  id: string;
  email: string;
  displayName?: string | null;
  token: string;
};

// Key used for storing user data in localStorage
const STORAGE_KEY = "ct_user";

// Cache for last retrieved user to optimize repeated access
let lastRaw: string | null = null; // Cache for last raw string from localStorage
let lastUser: StoredUser | null = null; // Cache for last parsed user

// Retrieves the stored user from localStorage, utilizing a cache for efficiency
export const getUserFromStorage = (): StoredUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY);

  // Return cached user if the raw data hasn't changed
  if (raw === lastRaw) {
    return lastUser;
  }

  // Update cache with new raw data
  lastRaw = raw;

  // If no data found, clear cached user and return null
  if (!raw) {
    lastUser = null;
    return null;
  }

  // Attempt to parse the stored JSON string
  try {
    const parsed = JSON.parse(raw) as Partial<StoredUser> & {
      id?: string | number;
    };

    // Validate required fields
    if (!parsed?.id || !parsed.email || !parsed.token) {
      lastUser = null;
      return null;
    }

    // Ensure id is a string
    const id = typeof parsed.id === "string" ? parsed.id : String(parsed.id);

    // Construct and cache the StoredUser object
    lastUser = {
      id,
      email: parsed.email,
      displayName: parsed.displayName ?? parsed.email,
      token: parsed.token,
    };
    return lastUser;
    // If parsing fails, clear cached user and return null
  } catch {
    lastUser = null;
    return null;
  }
};

// Saves the user data to localStorage and dispatches an event to notify other components
export const saveUserToStorage = (user: StoredUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  // Dispatch custom event to notify components in the same window
  window.dispatchEvent(new Event("ct-auth-change"));
};

// Clears the stored user data from localStorage and notifies other components
export const clearUserFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  // Dispatch custom event to notify components in the same window
  window.dispatchEvent(new Event("ct-auth-change"));
};

// Subscribes to authentication changes by listening to storage events and custom events
export const subscribeToAuthChanges = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("ct-auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ct-auth-change", callback);
  };
};
