import type { Locale } from "@/lib/i18n/locales";

import { LocalizedLink } from "@/components/shared/LocalizedLink";

type SectionHeadingProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  href?: string;
  ctaLabel?: string;
};

export function SectionHeading({
  locale,
  eyebrow,
  title,
  href,
  ctaLabel,
}: SectionHeadingProps) {
  return (
    <div className="mb-12">
      <div className="mb-4 text-[11px] uppercase tracking-[0.24em] text-stone-500">
        {eyebrow}
      </div>
      <div className="flex items-end justify-between gap-6 border-b border-stone-300 pb-6">
        <h2 className="font-[family-name:var(--font-serif)] text-4xl font-semibold leading-none tracking-tight text-stone-950 sm:text-5xl">
          {title}
        </h2>
        {href && ctaLabel ? (
          <LocalizedLink
            className="pb-1 text-[11px] uppercase tracking-[0.24em] text-stone-500 transition-colors hover:text-stone-950"
            locale={locale}
            href={href}
          >
            {ctaLabel}
          </LocalizedLink>
        ) : null}
      </div>
    </div>
  );
}
