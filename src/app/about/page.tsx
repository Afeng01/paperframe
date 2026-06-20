import type { Metadata } from "next";

import { RichContentRenderer } from "@/components/shared/RichContentRenderer";
import { getAboutEntry } from "@/lib/content/default-locale-loaders";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutEntry();

  return buildPageMetadata({
    title: about.title,
    description: about.summary,
    path: "/about",
  });
}

export default async function AboutPage() {
  const about = await getAboutEntry();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b border-stone-200 pb-8">
        <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">About</div>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-6xl">
          {about.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">{about.summary}</p>
      </div>
      <div className="mt-10">
        <RichContentRenderer source={about.body} />
      </div>
    </div>
  );
}
