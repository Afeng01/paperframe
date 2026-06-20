import type { Locale } from "@/lib/i18n/locales";

import type { SiteContent } from "@/lib/content/schemas";

type StatsSectionProps = {
  locale: Locale;
  stats: SiteContent["stats"];
};

const STATS_SECTION_COPY = {
  en: "By the numbers",
  zh: "数字速览",
} as const;

export function StatsSection({ locale, stats }: StatsSectionProps) {
  return (
    <section className="border-t border-stone-800 bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12 text-[11px] uppercase tracking-[0.24em] text-stone-500">
          {STATS_SECTION_COPY[locale]}
        </div>
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-6">
          {stats.map((item) => (
            <div key={item.label} className="border-t border-stone-700 pt-6">
              <div className="font-[family-name:var(--font-serif)] text-6xl font-semibold leading-none tracking-tight text-white sm:text-7xl">
                {item.value}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-serif)] text-base text-stone-300">
                  {item.label}
                </span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                  {item.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
