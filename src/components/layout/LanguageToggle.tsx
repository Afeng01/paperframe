"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { serializeLocaleCookie } from "@/lib/i18n/locale-cookie";
import { type Locale } from "@/lib/i18n/locales";
import { savePendingLocaleTransition } from "@/lib/i18n/locale-transition";
import { buildLocaleUrl } from "@/lib/i18n/locale-url";

type LanguageToggleProps = {
  locale: Locale;
};

const TOGGLE_COPY = {
  en: {
    label: "Language",
  },
  zh: {
    label: "语言",
  },
} as const;

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);
  const optimisticLocale =
    pendingLocale != null && pendingLocale !== locale ? pendingLocale : locale;

  function handleSwitch(nextLocale: Locale) {
    if (nextLocale === optimisticLocale) {
      return;
    }

    const nextHref = buildLocaleUrl({
      pathname: pathname ?? "/",
      search: searchParams.toString(),
      hash: typeof window === "undefined" ? undefined : window.location.hash,
      locale: nextLocale,
    });

    document.cookie = serializeLocaleCookie(nextLocale);
    savePendingLocaleTransition(locale, nextLocale);
    setPendingLocale(nextLocale);

    startTransition(() => {
      router.replace(nextHref, { scroll: false });
    });
  }

  const copy = TOGGLE_COPY[optimisticLocale];
  const indicatorTransform =
    optimisticLocale === "zh" ? "translateX(calc(100% + 0.125rem))" : "translateX(0)";

  return (
    <div
      aria-label={copy.label}
      className="relative inline-grid grid-cols-2 items-center rounded-full border border-stone-300 bg-white/85 p-0.5 text-[10px] uppercase tracking-[0.22em] text-stone-500"
      role="group"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0.5 left-0.5 rounded-full bg-stone-950 transition-transform duration-300 ease-out"
        style={{
          width: "calc(50% - 0.25rem)",
          transform: indicatorTransform,
        }}
      />
      <button
        aria-label="Switch to English"
        aria-pressed={optimisticLocale === "en"}
        className={`relative z-10 min-w-9 px-2.5 py-1 transition-colors ${
          optimisticLocale === "en" ? "text-white" : "text-stone-500 hover:text-stone-950"
        }`}
        disabled={isPending}
        onClick={() => handleSwitch("en")}
        type="button"
      >
        EN
      </button>
      <button
        aria-label="切换到中文"
        aria-pressed={optimisticLocale === "zh"}
        className={`relative z-10 min-w-9 px-2.5 py-1 transition-colors ${
          optimisticLocale === "zh" ? "text-white" : "text-stone-500 hover:text-stone-950"
        }`}
        disabled={isPending}
        onClick={() => handleSwitch("zh")}
        type="button"
      >
        中
      </button>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-[9px] tracking-normal text-stone-400"
      >
        /
      </span>
    </div>
  );
}
