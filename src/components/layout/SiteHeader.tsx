import type { SiteContent } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/locales";

import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { LocalizedLink } from "@/components/shared/LocalizedLink";

type SiteHeaderProps = {
  locale: Locale;
  site: SiteContent;
};

export function SiteHeader({ locale, site }: SiteHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <LocalizedLink
          className="z-50 font-[family-name:var(--font-serif)] text-lg font-semibold tracking-tight text-stone-950 transition-colors hover:text-stone-600"
          locale={locale}
          href="/"
        >
          {site.siteTitle}
        </LocalizedLink>
        <nav className="hidden items-center gap-5 md:flex">
          {site.navigation.map((item) => (
            <LocalizedLink
              key={item.href}
              className="border-b border-transparent pb-1 text-[11px] uppercase tracking-[0.18em] text-stone-500 transition-colors hover:border-stone-300 hover:text-stone-950"
              locale={locale}
              href={item.href}
            >
              {item.label}
            </LocalizedLink>
          ))}
          <LanguageToggle locale={locale} />
        </nav>
        <MobileMenu locale={locale} navigation={site.navigation} />
      </div>
    </header>
  );
}
