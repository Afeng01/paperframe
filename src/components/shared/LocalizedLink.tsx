import Link from "next/link";
import type { ComponentProps } from "react";

import type { Locale } from "@/lib/i18n/locales";
import { localizeHref } from "@/lib/i18n/locale-url";

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  locale: Locale;
};

export function LocalizedLink({ href, locale, ...props }: LocalizedLinkProps) {
  return <Link {...props} href={localizeHref(href, locale)} />;
}
