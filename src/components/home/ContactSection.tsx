import type { Locale } from "@/lib/i18n/locales";

import type { SiteContent } from "@/lib/content/schemas";
import { localizeHref } from "@/lib/i18n/locale-url";

type ContactSectionProps = {
  contact: SiteContent["contact"];
  locale: Locale;
};

const CONTACT_SECTION_COPY = {
  en: "Contact",
  zh: "联系",
} as const;

export function ContactSection({ contact, locale }: ContactSectionProps) {
  return (
    <section className="border-t border-stone-200 bg-white py-20" id="contact">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-4 text-[11px] uppercase tracking-[0.24em] text-stone-500">
              {CONTACT_SECTION_COPY[locale]}
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-4xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-5xl">
              {contact.title}
            </h2>
            <p className="mt-6 text-base leading-8 text-stone-600">{contact.summary}</p>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-6 md:grid-cols-3">
              {contact.links.map((item) => (
                <a
                  key={item.label}
                  className="border-t border-stone-300 pt-4 transition-colors hover:border-stone-950"
                  href={localizeHref(item.href, locale)}
                >
                  <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                    {item.label}
                  </div>
                  <div className="mt-2 font-[family-name:var(--font-serif)] text-lg text-stone-950">
                    {item.value}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
