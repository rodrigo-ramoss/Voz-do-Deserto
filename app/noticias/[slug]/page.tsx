import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllNoticiasSlugs, getNoticiaBySlug } from "@/lib/noticias";
import ReadingProgress from "@/app/components/ReadingProgress";
import ShareButtons from "@/app/components/ShareButtons";
import NewsletterForm from "@/app/components/NewsletterForm";
import NewsletterPopup from "@/app/components/NewsletterPopup";

export async function generateStaticParams() {
  return getAllNoticiasSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) return {};

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vozdodeserto.com.br";
  const canonicalUrl = `${baseUrl}/noticias/${noticia.slug}`;
  const description = noticia.description ?? noticia.excerpt ?? "";

  return {
    title: `${noticia.title} — Voz do Deserto`,
    description,
    keywords: noticia.keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: noticia.title,
      description,
      url: canonicalUrl,
      siteName: "Voz do Deserto",
      locale: "pt_BR",
      type: "article",
    },
  };
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) notFound();

  return (
    <>
      <ReadingProgress />
      <NewsletterPopup />

      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Breadcrumb manual */}
        <nav aria-label="Navegação" className="flex items-center gap-2 mb-10">
          <Link href="/" className="font-label text-[9px] uppercase tracking-widest text-muted/50 hover:text-gold transition-colors">Início</Link>
          <span className="text-muted/30 text-[9px]">/</span>
          <Link href="/noticias" className="font-label text-[9px] uppercase tracking-widest text-muted/50 hover:text-gold transition-colors">Fora do Deserto</Link>
          <span className="text-muted/30 text-[9px]">/</span>
          <span className="font-label text-[9px] uppercase tracking-widest text-muted/30 line-clamp-1">{noticia.title}</span>
        </nav>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-label text-[9px] uppercase tracking-[0.3em] text-ember/80 border border-ember/20 px-2.5 py-1">
            Fora do Deserto
          </span>
          {noticia.source && (
            <span className="font-label text-[9px] uppercase tracking-widest text-muted/50">
              {noticia.source}
            </span>
          )}
          <span className="font-label text-[9px] text-muted/40">{noticia.date}</span>
          {noticia.readTime && (
            <span className="font-label text-[9px] text-muted/40">· {noticia.readTime}</span>
          )}
        </div>

        {/* Título */}
        <h1 className="font-display text-4xl leading-tight text-text mb-6 md:text-5xl">
          {noticia.title}
        </h1>

        {noticia.excerpt && (
          <p className="font-body text-xl leading-relaxed text-muted mb-10 border-l-2 border-gold/25 pl-5">
            {noticia.excerpt}
          </p>
        )}

        <div className="h-px w-16 bg-gold/25 mb-10" />

        {/* Conteúdo — injeta NewsletterForm inline se artigo contém {{NEWSLETTER}} */}
        {(() => {
          const MARKER = "<p>{{NEWSLETTER}}</p>";
          const idx = noticia.contentHtml.indexOf(MARKER);
          if (idx === -1) {
            return (
              <>
                <article
                  className="prose-study max-w-prose"
                  dangerouslySetInnerHTML={{ __html: noticia.contentHtml }}
                />
                <div className="mt-14">
                  <NewsletterForm context="article" />
                </div>
              </>
            );
          }
          const before = noticia.contentHtml.slice(0, idx);
          const after = noticia.contentHtml.slice(idx + MARKER.length);
          return (
            <>
              <article
                className="prose-study max-w-prose"
                dangerouslySetInnerHTML={{ __html: before }}
              />
              <div className="mt-10 mb-10">
                <NewsletterForm context="article" />
              </div>
              <article
                className="prose-study max-w-prose"
                dangerouslySetInnerHTML={{ __html: after }}
              />
            </>
          );
        })()}

        {/* Compartilhar */}
        <div className="mt-12 pt-8 border-t border-gold/10">
          <ShareButtons title={noticia.title} url={`/noticias/${noticia.slug}`} />
        </div>

        <div className="mt-10">
          <Link
            href="/noticias"
            className="font-label text-[10px] uppercase tracking-widest text-muted hover:text-gold transition-colors border-b border-muted/20 pb-0.5"
          >
            ← Voltar para Fora do Deserto
          </Link>
        </div>
      </main>
    </>
  );
}
