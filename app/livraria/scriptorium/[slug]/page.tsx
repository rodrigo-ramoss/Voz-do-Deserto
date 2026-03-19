import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getScriptoriumBySlug, getAllScriptoriumSlugs } from "@/lib/scriptorium";
import Breadcrumb from "@/app/components/Breadcrumb";
import ReadingProgress from "@/app/components/ReadingProgress";
import ScriptoriumContent from "../ScriptoriumContent";

export async function generateStaticParams() {
  return getAllScriptoriumSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getScriptoriumBySlug(slug);
  if (!article) return {};

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vozdodeserto.com.br";
  const canonicalUrl = `${baseUrl}/livraria/scriptorium/${article.slug}`;
  const description = article.description ?? article.excerpt ?? "";

  return {
    title: `${article.title} — Scriptorium · Voz do Deserto`,
    description,
    keywords: article.keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: article.title,
      description,
      url: canonicalUrl,
      siteName: "Voz do Deserto",
      locale: "pt_BR",
      type: "article",
      publishedTime: article.date,
      images: article.image
        ? [{ url: article.image, alt: article.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function ScriptoriumArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getScriptoriumBySlug(slug);
  if (!article) notFound();

  const formattedDate = new Date(
    article.date + "T12:00:00"
  ).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vozdodeserto.com.br";
  const canonicalUrl = `${baseUrl}/livraria/scriptorium/${article.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    headline: article.title,
    description: article.description ?? article.excerpt ?? "",
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Person",
      name: "Rodrigo Ramos",
      url: `${baseUrl}/sobre`,
    },
    publisher: {
      "@type": "Organization",
      name: "Voz do Deserto",
      url: baseUrl,
    },
    url: canonicalUrl,
    ...(article.image
      ? {
          image: {
            "@type": "ImageObject",
            url: article.image.startsWith("http")
              ? article.image
              : `${baseUrl}${article.image}`,
            width: 1200,
            height: 630,
          },
        }
      : {}),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <ReadingProgress />

      {/* ── Cabeçalho ────────────────────────────────────────────────── */}
      <div className="border-b border-gold/10 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Arquivo Secreto", href: "/livraria" },
                { label: "Scriptorium", href: "/livraria" },
                { label: article.title },
              ]}
            />
          </div>

          <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-4">
            Scriptorium · Conteúdo Premium
          </p>

          <h1 className="font-display text-4xl leading-tight text-text mb-6 max-w-4xl md:text-5xl lg:text-6xl">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 flex-wrap text-muted">
            <span className="font-label text-[9px] uppercase tracking-widest">
              {formattedDate}
            </span>
            {article.readTime && (
              <>
                <span className="text-gold/20">·</span>
                <span className="font-label text-[9px] uppercase tracking-widest">
                  {article.readTime} de leitura
                </span>
              </>
            )}
            {article.price && (
              <>
                <span className="text-gold/20">·</span>
                <span className="font-label text-[9px] uppercase tracking-widest text-gold">
                  {article.price}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Imagem de capa ───────────────────────────────────────────── */}
      <div className="relative h-52 overflow-hidden bg-card border-b border-gold/10 md:h-80">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.08] via-transparent to-ember/[0.05]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[16rem] leading-none text-gold/[0.04] select-none pointer-events-none">
                ✦
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Conteúdo (cliente decide preview ou completo) ────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <ScriptoriumContent
          previewHtml={article.previewHtml}
          contentHtml={article.contentHtml}
          price={article.price}
          paymentUrl={article.paymentUrl}
          title={article.title}
          canonicalUrl={canonicalUrl}
        />

        {/* Voltar */}
        <div className="mt-10 pt-8 border-t border-gold/10">
          <Link
            href="/livraria"
            className="font-label text-[9px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
          >
            ← Arquivo Secreto
          </Link>
        </div>
      </div>
    </main>
  );
}
