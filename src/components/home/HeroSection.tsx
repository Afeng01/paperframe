import type { Locale } from "@/lib/i18n/locales";

import type { SiteContent } from "@/lib/content/schemas";
import { localizeHref } from "@/lib/i18n/locale-url";

type HeroSectionProps = {
  locale: Locale;
  site: SiteContent;
};

export function HeroSection({ locale, site }: HeroSectionProps) {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-baseline gap-4 text-[11px] uppercase tracking-[0.24em] text-stone-500">
          <span>{site.heroMeta[0].value}</span>
          <span className="h-px flex-1 bg-stone-300" />
          <span>{site.heroMeta[2].value}</span>
        </div>
        <h1 className="font-[family-name:var(--font-serif)] text-6xl font-semibold leading-[1.05] tracking-tight text-stone-950 sm:text-7xl lg:text-8xl">
          {site.siteTitle}
        </h1>
        <p className="mt-6 max-w-2xl font-[family-name:var(--font-serif)] text-2xl leading-snug text-stone-700 sm:text-3xl">
          {site.siteSubtitle}
        </p>
        <div className="mt-16 grid grid-cols-3 gap-6 border-t border-stone-300 pt-6">
          {site.heroMeta.map((item) => (
            <div key={item.label} className="font-[family-name:var(--font-geist-mono)]">
              <div className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                {item.label}
              </div>
              <div className="mt-1 text-sm text-stone-950">
                {item.href ? (
                  <a
                    className="border-b border-stone-300 transition-colors hover:border-stone-950"
                    href={localizeHref(item.href, locale)}
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
