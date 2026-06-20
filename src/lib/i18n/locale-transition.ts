import type { Locale } from "@/lib/i18n/locales";

export const LOCALE_TRANSITION_STORAGE_KEY = "paperframe-locale-transition";
const LOCALE_TRANSITION_MAX_AGE_MS = 4_000;

type LocaleTransitionRecord = {
  next: Locale;
  previous: Locale;
  timestamp: number;
};

function hasWindow() {
  return typeof window !== "undefined";
}

export function savePendingLocaleTransition(previous: Locale, next: Locale) {
  if (!hasWindow()) {
    return;
  }

  const record: LocaleTransitionRecord = {
    next,
    previous,
    timestamp: Date.now(),
  };

  window.sessionStorage.setItem(LOCALE_TRANSITION_STORAGE_KEY, JSON.stringify(record));
}

export function readPendingLocaleTransition(): LocaleTransitionRecord | null {
  if (!hasWindow()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(LOCALE_TRANSITION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LocaleTransitionRecord>;

    if (
      typeof parsed.previous !== "string" ||
      typeof parsed.next !== "string" ||
      typeof parsed.timestamp !== "number"
    ) {
      clearPendingLocaleTransition();
      return null;
    }

    if (Date.now() - parsed.timestamp > LOCALE_TRANSITION_MAX_AGE_MS) {
      clearPendingLocaleTransition();
      return null;
    }

    return parsed as LocaleTransitionRecord;
  } catch {
    clearPendingLocaleTransition();
    return null;
  }
}

export function clearPendingLocaleTransition() {
  if (!hasWindow()) {
    return;
  }

  window.sessionStorage.removeItem(LOCALE_TRANSITION_STORAGE_KEY);
}
