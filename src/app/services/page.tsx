import type { Metadata } from "next";

import { CollectionPageHeader } from "@/components/list/CollectionPageHeader";
import { CollectionCardGrid } from "@/components/list/CollectionCardGrid";
import { getAllServices } from "@/lib/content/default-locale-loaders";
import { buildPageMetadata } from "@/lib/metadata";
import { selectOrderedServices } from "@/lib/content/selectors";

export const metadata: Metadata = buildPageMetadata({
  title: "Services",
  description: "Sample service cards for the editorial frontsite template.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = selectOrderedServices(await getAllServices());

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <CollectionPageHeader
        eyebrow="Services"
        summary="This route stays intentionally simple so the template can show a clean services section without adding product complexity."
        title="Services"
      />
      <div className="mt-12">
        <CollectionCardGrid entries={services} hrefBase="/services" />
      </div>
    </div>
  );
}
