import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllStudySlugs, getStudyBySlug } from "@/lib/studies";
import Sidebar from "@/app/components/Sidebar";
import Breadcrumb from "@/app/components/Breadcrumb";
import ReadingProgress from "@/app/components/ReadingProgress";
import ShareButtons from "@/app/components/ShareButtons";
import Newsletter from "@/app/components/Newsletter";
import AuthorCard from "@/app/components/AuthorCard";
import NewsletterPopup from "@/app/components/NewsletterPopup";

export async function generateStaticParams() {
  return getAllStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getStudyBySlug(slug);
  if (!study) return {};

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vozdodeserto.com.br";
  const canonicalUrl = `${baseUrl}/estudos/${study.slug}`;
  const description = study.description ?? study.excerpt ?? "";

  return {
    title: `${study.title} — Voz do Deserto`,
    description,
    keywords: study.keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: study.title,
      description,
      url: canonicalUrl,
      siteName: "Voz do Deserto",
      locale: "pt_BR",
      type: "article",
      publishedTime: study.date,
      images: study.image
        ? [{ url: study.image, alt: study.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description,
      images: study.image ? [study.image] : [],
    },
  };
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getStudyBySlug(slug);
  if (!study) notFound();

  const formattedDate = new Date(study.date + "T12:00:00").toLocaleDateString(
    "pt-BR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  // URL canônica para compartilhamento (usa NEXT_PUBLIC_SITE_URL se definido)
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vozdodeserto.com.br";
  const canonicalUrl = `${baseUrl}/estudos/${study.slug}`;

  // JSON-LD: FAQ Schema (quando existem perguntas no frontmatter)
  const faqJsonLd =
    study.faqItems && study.faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: study.faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  // JSON-LD: BlogPosting Schema
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: study.title,
    description: study.description ?? study.excerpt ?? "",
    datePublished: study.date,
    dateModified: study.date,
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
    ...(study.image
      ? {
          image: {
            "@type": "ImageObject",
            url: study.image.startsWith("http")
              ? study.image
              : `${baseUrl}${study.image}`,
            width: 1200,
            height: 630,
          },
        }
      : {}),
  };

  return (
    <main>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Barra de progresso de leitura (dourada, topo fixo) */}
      <ReadingProgress />
      <NewsletterPopup />

      {/* Cabeçalho do artigo */}
      <div className="border-b border-gold/10 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: "Estudos", href: "/estudos" },
                {
                  label: study.category,
                  href: `/estudos?cat=${encodeURIComponent(study.category)}`,
                },
                { label: study.title },
              ]}
            />
          </div>

          <h1 className="font-display text-4xl leading-tight text-text mb-6 max-w-4xl md:text-5xl lg:text-6xl">
            {study.title}
          </h1>

          <div className="flex items-center gap-3 flex-wrap text-muted">
            <span className="font-label text-[9px] uppercase tracking-widest">
              {formattedDate}
            </span>
            {study.readTime && (
              <>
                <span className="text-gold/20">·</span>
                <span className="font-label text-[9px] uppercase tracking-widest">
                  {study.readTime} de leitura
                </span>
              </>
            )}
            {study.pdf && (
              <>
                <span className="text-gold/20">·</span>
                <a
                  href={study.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label text-[9px] uppercase tracking-widest text-gold/50 hover:text-gold transition-colors"
                >
                  PDF ↓
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Imagem de capa */}
      <div className="relative h-52 overflow-hidden bg-card border-b border-gold/10 md:h-80">
        {study.image ? (
          <Image
            src={study.image}
            alt={study.title}
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

      {/* Corpo do artigo — duas colunas */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Conteúdo */}
          <div>
            {/* Texto do artigo com largura máxima de leitura */}
            <article
              className="prose-study max-w-prose"
              dangerouslySetInnerHTML={{ __html: study.contentHtml }}
            />

            {/* Download PDF */}
            {study.pdf && (
              <div className="mt-14 border-t border-gold/10 pt-10">
                <p className="font-label text-[10px] uppercase tracking-[0.3em] text-gold mb-4">
                  Material complementar
                </p>
                <a
                  href={study.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gold/30 px-6 py-3 font-label text-[10px] uppercase tracking-widest text-gold transition-colors duration-200 hover:bg-gold/5 hover:border-gold/60"
                >
                  Baixar PDF ↓
                </a>
              </div>
            )}

            {/* Newsletter ao final do artigo */}
            <div className="mt-14">
              <Newsletter />
            </div>

            {/* Compartilhar */}
            <ShareButtons
              title={study.title}
              url={canonicalUrl}
            />

            {/* Card do autor — estilo revista */}
            <AuthorCard />

            {/* Voltar */}
            <div className="mt-10 pt-8 border-t border-gold/10">
              <Link
                href="/estudos"
                className="font-label text-[9px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
              >
                ← Todos os estudos
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar excludeSlug={study.slug} />
        </div>
      </div>
    </main>
  );
}
