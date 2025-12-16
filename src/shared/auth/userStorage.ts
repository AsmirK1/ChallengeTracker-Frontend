export type StoredUser = {
  id: string;
  email: string;
  displayName: string;
  token: string;
};

const STORAGE_KEY = "ct_user";

export const getUserFromStorage = (): StoredUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredUser> & { id?: string | number };

    if (!parsed?.id || !parsed.email || !parsed.token) {
      return null;
    }

    const id = typeof parsed.id === "string" ? parsed.id : String(parsed.id);

    return {
      id,
      email: parsed.email,
      displayName: parsed.displayName ?? parsed.email,
      token: parsed.token,
    };
  } catch {
    return null;
  }
};

export const saveUserToStorage = (user: StoredUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const clearUserFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
