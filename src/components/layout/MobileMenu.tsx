"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n/locales";

import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { LocalizedLink } from "@/components/shared/LocalizedLink";

type MobileMenuProps = {
  locale: Locale;
  navigation: Array<{
    label: string;
    href: string;
  }>;
};

const MENU_COPY = {
  en: {
    ariaLabel: "Open menu",
    label: "Menu",
    action: "Open",
  },
  zh: {
    ariaLabel: "打开菜单",
    label: "菜单",
    action: "进入",
  },
} as const;

export function MobileMenu({ locale, navigation }: MobileMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const copy = MENU_COPY[locale];
  const serializedSearchParams = searchParams.toString();

  useEffect(() => {
    setOpen(false);
  }, [pathname, serializedSearchParams]);

  return (
    <>
      <button
        aria-label={copy.ariaLabel}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className={`h-0.5 w-6 bg-stone-950 transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`h-0.5 w-6 bg-stone-950 transition-all ${open ? "opacity-0" : ""}`} />
        <span className={`h-0.5 w-6 bg-stone-950 transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>
      <div
        className={`fixed inset-0 z-30 bg-stone-950 transition-all duration-300 md:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="flex h-full flex-col px-6 pb-12 pt-24">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              {copy.label}
            </div>
            <LanguageToggle locale={locale} />
          </div>
          <ul className="flex-1 space-y-6">
            {navigation.map((item) => (
              <li key={item.href}>
                <LocalizedLink
                  className="group flex items-baseline justify-between border-b border-stone-800 pb-4 transition-colors hover:border-stone-500"
                  locale={locale}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <span className="font-[family-name:var(--font-serif)] text-3xl text-stone-200 transition-colors group-hover:text-white">
                    {item.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                    {copy.action}
                  </span>
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
