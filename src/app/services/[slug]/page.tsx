import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetailTemplate } from "@/components/detail/ServiceDetailTemplate";
import { getAllServices, getServiceBySlug } from "@/lib/content/default-locale-loaders";
import { buildPageMetadata } from "@/lib/metadata";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const services = await getAllServices();

  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return buildPageMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
    imagePath: service.coverImage,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailTemplate service={service} />;
}
