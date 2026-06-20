import type { ProjectEntry, ServiceEntry } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/locales";

import { CardImage } from "@/components/shared/CardImage";
import { LocalizedLink } from "@/components/shared/LocalizedLink";

type CollectionCardGridProps = {
  entries: Array<ProjectEntry | ServiceEntry>;
  hrefBase: "/projects" | "/services";
  locale: Locale;
};

export function CollectionCardGrid({ entries, hrefBase, locale }: CollectionCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <LocalizedLink
          key={entry.slug}
          className="group block"
          locale={locale}
          href={`${hrefBase}/${entry.slug}`}
        >
          <CardImage alt={entry.title} src={entry.coverImage} />
          <div className="mt-5 text-[11px] uppercase tracking-[0.18em] text-stone-500">
            {entry.category}
          </div>
          <h2 className="mt-3 font-[family-name:var(--font-serif)] text-2xl font-semibold leading-snug tracking-tight text-stone-950 transition-colors group-hover:text-stone-600">
            {entry.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{entry.summary}</p>
        </LocalizedLink>
      ))}
    </div>
  );
}
