import type { Metadata } from "next";

import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { buildLocaleUrl } from "@/lib/i18n/locale-url";
import { absoluteUrl, resolveTitle, siteConfig } from "@/lib/site-config";

type PageMetadataInput = {
  title?: string;
  description: string;
  path?: string;
  imagePath?: string;
  keywords?: string[];
  locale?: Locale;
  type?: "website" | "article";
  publishedTime?: string;
};

const OPEN_GRAPH_LOCALE_BY_LOCALE: Record<Locale, string> = {
  en: "en_US",
  zh: "zh_CN",
};

export function buildPageMetadata({
  title,
  description,
  path = "/",
  imagePath = siteConfig.ogImagePath,
  keywords,
  locale = DEFAULT_LOCALE,
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  const canonicalPath = buildLocaleUrl({
    pathname: path,
    locale,
  });
  const canonicalUrl = absoluteUrl(canonicalPath);
  const imageUrl = absoluteUrl(imagePath);

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: resolveTitle(title),
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: OPEN_GRAPH_LOCALE_BY_LOCALE[locale],
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title ? `${title} preview` : `${siteConfig.name} preview`,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolveTitle(title),
      description,
      creator: siteConfig.social.xHandle,
      images: [imageUrl],
    },
  };
}
