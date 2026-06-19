export const siteConfig = {
  name: "Paperframe",
  shortName: "Paperframe",
  description:
    "An editorial-style personal site template built with Next.js App Router, Tailwind CSS, and local MDX collections.",
  url: "https://example.com",
  lang: "en",
  locale: "en_US",
  themeColor: "#f5f5f4",
  keywords: [
    "Next.js template",
    "editorial website",
    "MDX blog",
    "portfolio template",
    "content site",
  ],
  author: {
    name: "Your Name",
    email: "hello@example.com",
  },
  social: {
    github: "https://github.com/your-handle",
    x: "https://x.com/your-handle",
    xHandle: "@yourhandle",
  },
  ogImagePath: "/opengraph-image",
  twitterImagePath: "/twitter-image",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function resolveTitle(title?: string) {
  return title ? `${title} | ${siteConfig.name}` : siteConfig.name;
}
