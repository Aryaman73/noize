// Theme helpers shared by the no-flash inline script (index.html) and the
// React ThemeToggle. Resolution order: an explicit saved choice wins, otherwise
// we follow the browser/device preference (prefers-color-scheme).
const STORAGE_KEY = "theme";

export function getSystemTheme() {
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch (e) {
    return null;
  }
}

export function getInitialTheme() {
  return getStoredTheme() || getSystemTheme();
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    // Ignore (private mode / storage disabled) — the choice just won't persist.
  }
}
