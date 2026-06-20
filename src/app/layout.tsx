import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono, Noto_Serif_SC } from "next/font/google";

import { getSiteContent } from "@/content/site";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildLocaleUrl } from "@/lib/i18n/locale-url";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const OPEN_GRAPH_LOCALE_BY_LOCALE = {
  en: "en_US",
  zh: "zh_CN",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = resolveLocale({
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const site = getSiteContent(locale);
  const canonicalPath = buildLocaleUrl({
    pathname: "/",
    locale,
  });

  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: site.siteSubtitle,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: siteConfig.name,
      description: site.siteSubtitle,
      url: canonicalPath,
      siteName: siteConfig.name,
      locale: OPEN_GRAPH_LOCALE_BY_LOCALE[locale],
      type: "website",
      images: [
        {
          url: siteConfig.ogImagePath,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: site.siteSubtitle,
      creator: siteConfig.social.xHandle,
      images: [siteConfig.twitterImagePath],
    },
  };
}

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = resolveLocale({
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const site = getSiteContent(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-stone-950">
        <div className="flex min-h-full flex-col">
          <SiteHeader locale={locale} site={site} />
          <main className="flex-1 pt-14">{children}</main>
          <SiteFooter locale={locale} site={site} />
        </div>
      </body>
    </html>
  );
}
