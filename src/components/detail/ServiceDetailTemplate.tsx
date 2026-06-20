import type { Locale } from "@/lib/i18n/locales";

import type { ServiceEntry } from "@/lib/content/schemas";
import { localizeHref } from "@/lib/i18n/locale-url";
import { CardImage } from "@/components/shared/CardImage";
import { RichContentRenderer } from "@/components/shared/RichContentRenderer";
import { formatDisplayDate } from "@/lib/utils/format";

type ServiceDetailTemplateProps = {
  locale: Locale;
  service: ServiceEntry;
};

export async function ServiceDetailTemplate({ locale, service }: ServiceDetailTemplateProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
          {service.category}
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-6xl">
          {service.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">{service.summary}</p>
        {service.date ? (
          <div className="mt-6 text-sm text-stone-500">{formatDisplayDate(service.date, locale)}</div>
        ) : null}
      </header>
      <div className="mb-10">
        <CardImage alt={service.title} ratio="feature" src={service.coverImage} />
      </div>
      {service.ctaHref && service.ctaLabel ? (
        <a
          className="mb-10 inline-flex items-center gap-2 border-b border-stone-300 pb-1 text-[11px] uppercase tracking-[0.24em] text-stone-500 transition-colors hover:border-stone-950 hover:text-stone-950"
          href={localizeHref(service.ctaHref, locale)}
        >
          {service.ctaLabel}
        </a>
      ) : null}
      <RichContentRenderer source={service.body} />
    </article>
  );
}
