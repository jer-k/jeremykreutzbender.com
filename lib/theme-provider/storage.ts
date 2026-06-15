const isServer = typeof window === "undefined";

export function getStoredTheme(storageKey: string, fallback: string) {
  if (isServer) {
    return undefined;
  }

  try {
    return localStorage.getItem(storageKey) || fallback;
  } catch {
    return fallback;
  }
}

export function saveTheme(storageKey: string, themeName: string) {
  try {
    localStorage.setItem(storageKey, themeName);
  } catch {
    // Ignore unavailable storage.
  }
}
