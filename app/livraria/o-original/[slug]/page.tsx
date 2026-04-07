import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getOOriginalBySlugRecursive, getAllOOriginalSlugs } from "@/lib/o-original";
import Breadcrumb from "@/app/components/Breadcrumb";
import ReadingProgress from "@/app/components/ReadingProgress";
import ScriptoriumContent from "@/app/livraria/scriptorium/ScriptoriumContent";

export async function generateStaticParams() {
  return getAllOOriginalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getOOriginalBySlugRecursive(slug);
  if (!article) return {};

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vozdodeserto.com.br";
  const canonicalUrl = `${baseUrl}/livraria/o-original/${article.slug}`;
  const description = article.description ?? article.excerpt ?? "";

  return {
    title: `${article.title} — O Original · Voz do Deserto`,
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

export default async function OOriginalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getOOriginalBySlugRecursive(slug);
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
  const canonicalUrl = `${baseUrl}/livraria/o-original/${article.slug}`;

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
                { label: "O Original", href: "/livraria/o-original" },
                { label: article.title },
              ]}
            />
          </div>

          {/* Badges de idioma e livro */}
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold">
              O Original · Exegese
            </p>
            {article.language && (
              <>
                <span className="text-gold/20">·</span>
                <span className="font-label text-[9px] uppercase tracking-widest text-gold/60">
                  {article.language}
                </span>
              </>
            )}
            {article.book && (
              <>
                <span className="text-gold/20">·</span>
                <span className="font-label text-[9px] uppercase tracking-widest text-muted/60">
                  {article.book}
                </span>
              </>
            )}
            {article.verse && (
              <>
                <span className="text-gold/20">·</span>
                <span className="font-label text-[9px] uppercase tracking-widest text-muted/50">
                  {article.verse}
                </span>
              </>
            )}
          </div>

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
            {article.premium && (
              <>
                <span className="text-gold/20">·</span>
                <span className="font-label text-[9px] uppercase tracking-widest text-gold">
                  Assinante Premium
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
              {/* Símbolo decorativo — alude a texto antigo */}
              <span className="font-display text-[16rem] leading-none text-gold/[0.04] select-none pointer-events-none">
                ✦
              </span>
            </div>
            {/* Texto hebraico decorativo de fundo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
              <span className="font-display text-8xl text-gold select-none">
                בְּרֵאשִׁית
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Conteúdo ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {article.premium ? (
          /* Artigo premium — usa paywall idêntico ao Scriptorium */
          <ScriptoriumContent
            previewHtml={article.previewHtml}
            contentHtml={article.contentHtml}
            title={article.title}
            canonicalUrl={canonicalUrl}
            slug={article.slug}
          />
        ) : (
          /* Artigo gratuito — exibe diretamente */
          <article
            className="prose-study"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        )}

        {/* Voltar */}
        <div className="mt-10 pt-8 border-t border-gold/10">
          <Link
            href="/livraria/o-original"
            className="font-label text-[9px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
          >
            ← Voltar a O Original
          </Link>
        </div>
      </div>
    </main>
  );
}
