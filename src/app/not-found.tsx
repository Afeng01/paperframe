import { cookies } from "next/headers";
import Link from "next/link";

import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildLocaleUrl } from "@/lib/i18n/locale-url";

const NOT_FOUND_COPY = {
  en: {
    eyebrow: "404",
    title: "This page is missing from the issue.",
    description:
      "The route may have moved, the slug may be wrong, or this template simply does not ship that page yet.",
    suggestedRoutes: [
      { label: "Back home", href: "/" },
      { label: "Browse articles", href: "/articles" },
      { label: "View projects", href: "/projects" },
    ],
  },
  zh: {
    eyebrow: "404",
    title: "这页暂时不在这一期里。",
    description: "可能是路由变了、slug 不对，或者这个模板本来就还没有提供这页内容。",
    suggestedRoutes: [
      { label: "回到首页", href: "/" },
      { label: "查看文章", href: "/articles" },
      { label: "查看项目", href: "/projects" },
    ],
  },
} as const;

export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = resolveLocale({
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const copy = NOT_FOUND_COPY[locale];

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">{copy.eyebrow}</div>
      <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
        {copy.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">{copy.description}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        {copy.suggestedRoutes.map((route) => (
          <Link
            key={route.href}
            className="border border-stone-300 px-4 py-2 text-sm font-medium text-stone-950 transition-colors hover:border-stone-950 hover:bg-stone-950 hover:text-white"
            href={buildLocaleUrl({
              pathname: route.href,
              locale,
            })}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
