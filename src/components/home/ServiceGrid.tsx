import type { ServiceEntry } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/locales";

import { CardImage } from "@/components/shared/CardImage";
import { LocalizedLink } from "@/components/shared/LocalizedLink";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { formatDisplayDate } from "@/lib/utils/format";

type ServiceGridProps = {
  locale: Locale;
  services: ServiceEntry[];
};

const SERVICE_GRID_COPY = {
  en: {
    eyebrow: "Services",
    title: "Ways to work together",
    ctaLabel: "View all",
  },
  zh: {
    eyebrow: "服务",
    title: "可以一起合作的方式",
    ctaLabel: "查看全部",
  },
} as const;

export function ServiceGrid({ locale, services }: ServiceGridProps) {
  const copy = SERVICE_GRID_COPY[locale];

  return (
    <section className="border-t border-stone-200 bg-white" id="services">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          locale={locale}
          eyebrow={copy.eyebrow}
          href="/services"
          ctaLabel={copy.ctaLabel}
          title={copy.title}
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          {services.map((service) => (
            <LocalizedLink
              key={service.slug}
              className="group block"
              locale={locale}
              href={`/services/${service.slug}`}
            >
              <CardImage alt={service.title} src={service.coverImage} />
              <div className="mt-5 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                {service.date ? formatDisplayDate(service.date, locale) : service.category}
              </div>
              <h3 className="mt-3 font-[family-name:var(--font-serif)] text-xl font-semibold leading-snug tracking-tight text-stone-950 transition-colors group-hover:text-stone-600">
                {service.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-stone-600">{service.summary}</p>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
