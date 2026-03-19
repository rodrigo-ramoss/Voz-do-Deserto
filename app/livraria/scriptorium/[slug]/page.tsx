import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getAllScriptoriumSlugs,
  getScriptoriumBySlug,
} from "@/lib/scriptorium";
import Breadcrumb from "@/app/components/Breadcrumb";
import ReadingProgress from "@/app/components/ReadingProgress";
import NewsletterForm from "@/app/components/NewsletterForm";

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

  // Link de pagamento: frontmatter > placeholder
  const paymentUrl = article.paymentUrl ?? "#";
  const price = article.price ?? "Acesso único";

  // JSON-LD: BlogPosting
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

          {/* Badge */}
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
                  {price}
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

      {/* ── Corpo: preview + paywall ─────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* Preview do artigo com fade no rodapé */}
        <div className="relative">
          <article
            className="prose-study"
            dangerouslySetInnerHTML={{ __html: article.previewHtml }}
          />

          {/* Gradiente de fade: começa transparente e vai até a cor de fundo */}
          <div
            className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, var(--color-bg, #0a0804) 100%)",
            }}
            aria-hidden
          />
        </div>

        {/* ── Paywall ──────────────────────────────────────────────────── */}
        <div className="mt-0 border border-gold/20 bg-card px-8 py-10 text-center">

          {/* Ícone cadeado */}
          <div className="flex justify-center mb-5">
            <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gold/60"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-3">
            Scriptorium · Conteúdo exclusivo
          </p>

          <h2 className="font-display text-2xl text-text mb-3 max-w-md mx-auto leading-snug">
            Continue lendo este estudo
          </h2>

          <p className="font-body text-sm text-text/50 leading-relaxed mb-6 max-w-sm mx-auto">
            Este artigo faz parte do Scriptorium — estudos aprofundados
            disponíveis mediante acesso único, sem assinatura recorrente.
          </p>

          {/* Preço */}
          {article.price && (
            <p className="font-display text-3xl text-gold mb-6">
              {article.price}
            </p>
          )}

          {/* Botão de compra */}
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold text-bg font-label text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold/90 transition-colors duration-200"
          >
            Acessar estudo completo →
          </a>

          {/* Separador */}
          <div className="mt-8 pt-6 border-t border-gold/10">
            <p className="font-label text-[8px] uppercase tracking-widest text-muted/60">
              Pagamento seguro · Acesso imediato após confirmação
            </p>
          </div>
        </div>

        {/* ── Newsletter ───────────────────────────────────────────────── */}
        <div className="mt-14">
          <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-4 text-center">
            Ou fique de graça por enquanto
          </p>
          <NewsletterForm context="article" />
        </div>

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
