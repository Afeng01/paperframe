import type { Locale } from "@/lib/i18n/locales";

const DATE_LOCALE_BY_LOCALE: Record<Locale, string> = {
  en: "en-US",
  zh: "zh-CN",
};

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDisplayDateValue(value: string): {
  date: Date;
  timeZone?: string;
} {
  const match = DATE_ONLY_PATTERN.exec(value);

  if (!match) {
    return {
      date: new Date(value),
    };
  }

  const [, year, month, day] = match;

  return {
    date: new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))),
    timeZone: "UTC",
  };
}

export function formatDisplayDate(value: string, locale: Locale) {
  const { date, timeZone } = parseDisplayDateValue(value);

  return new Intl.DateTimeFormat(DATE_LOCALE_BY_LOCALE[locale], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(date);
}
