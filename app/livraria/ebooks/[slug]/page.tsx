import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEbookBySlug, getAllEbookSlugs, getAllEbooks } from "@/lib/ebooks";
import EbookReader from "./EbookReader";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllEbookSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ebook = await getEbookBySlug(slug);
  if (!ebook) return {};

  return {
    title: `${ebook.title} — Voz do Deserto`,
    description: ebook.description,
    openGraph: {
      title: ebook.title,
      description: ebook.description,
      images: [{ url: ebook.image }],
      type: "book",
    },
  };
}

export default async function EbookPage({ params }: Props) {
  const { slug } = await params;
  const [ebook, allEbooks] = await Promise.all([
    getEbookBySlug(slug),
    Promise.resolve(getAllEbooks()),
  ]);

  if (!ebook) notFound();

  const allEbooksList = allEbooks.map((e) => ({
    slug: e.slug,
    title: e.title,
    volume: e.volume,
  }));

  return <EbookReader ebook={ebook} allEbooks={allEbooksList} />;
}
