import type { SiteContent } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/locales";

import { LocalizedLink } from "@/components/shared/LocalizedLink";

type SiteFooterProps = {
  locale: Locale;
  site: SiteContent;
};

export function SiteFooter({ locale, site }: SiteFooterProps) {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-stone-950">
            {site.siteTitle}
          </div>
          <p className="mt-3 max-w-xl text-sm leading-7 text-stone-600">
            {site.siteSubtitle}
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.24em] text-stone-500">
          {site.footerLinks.map((item) => (
            <LocalizedLink
              key={item.href}
              className="transition-colors hover:text-stone-950"
              locale={locale}
              href={item.href}
            >
              {item.label}
            </LocalizedLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
