import { getSiteContent } from "@/content/site";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LocaleTransitionProvider } from "@/components/transition/LocaleTransitionProvider";
import type { Locale } from "@/lib/i18n/locales";

type PublicSiteShellProps = {
  children: React.ReactNode;
  locale: Locale;
};

export function PublicSiteShell({ children, locale }: PublicSiteShellProps) {
  const site = getSiteContent(locale);

  return (
    <LocaleTransitionProvider locale={locale}>
      <div className="flex min-h-full flex-col">
        <div data-locale-region="header" data-locale-stagger="0">
          <SiteHeader locale={locale} site={site} />
        </div>
        <main className="flex-1 pt-14" data-locale-region="main" data-locale-stagger="1">
          {children}
        </main>
        <div data-locale-region="footer" data-locale-stagger="9">
          <SiteFooter locale={locale} site={site} />
        </div>
      </div>
    </LocaleTransitionProvider>
  );
}
