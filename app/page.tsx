import Link from "next/link";
import Image from "next/image";
import { getAllStudies } from "@/lib/studies";
import type { StudyMeta } from "@/lib/studies";
import { getCtaLabel, formatDateSmart } from "@/lib/utils";
import ArticleCard from "./components/ArticleCard";
import Sidebar from "./components/Sidebar";

function HeroArticle({ study }: { study: StudyMeta }) {
  /*
    T1: CTA dinâmico pelo campo category
    T2: botão mantém identidade visual dourada (border + fill no hover)
    T3: data exibe "Em breve" para artigos com data futura
  */
  const ctaLabel = getCtaLabel(study.category);
  const dateLabel = formatDateSmart(study.date, "long");

  return (
    <section className="border-b border-gold/10">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Visual */}
          <div className="relative aspect-[4/3] overflow-hidden border border-gold/10 bg-card group">
            {study.image ? (
              <Image
                src={study.image}
                alt={study.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.10] via-transparent to-ember/[0.06]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-[10rem] leading-none text-gold/[0.055] select-none pointer-events-none">
                    ✦
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="animate-fade-in-up" style={{ "--delay": "100ms" } as React.CSSProperties}>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-label text-[9px] uppercase tracking-[0.3em] text-ember/80 border border-ember/20 px-2.5 py-1">
                Destaque
              </span>
              <Link
                href={`/estudos?cat=${encodeURIComponent(study.category)}`}
                className="font-label text-[9px] uppercase tracking-[0.25em] text-muted hover:text-gold transition-colors"
              >
                {study.category}
              </Link>
            </div>

            <h1 className="font-display text-4xl leading-tight text-text mb-5 md:text-5xl">
              {study.title}
            </h1>

            {study.excerpt && (
              /* text-muted (#B8A98A, 8.6:1) — era text-text/55 */
              <p className="font-body text-lg leading-relaxed text-muted mb-7">
                {study.excerpt}
              </p>
            )}

            <div className="flex items-center gap-6 flex-wrap">
              {/* Botão CTA: text-sm (14px) min-h-[44px] — touch target T6
                  text-gold (#D4B76A, 10.5:1) sobre fundo escuro ✓          */}
              <Link
                href={`/estudos/${study.slug}`}
                className="font-label text-sm uppercase tracking-widest border border-gold px-7 min-h-[44px] flex items-center text-gold hover:bg-gold hover:text-bg transition-all duration-200"
              >
                {ctaLabel}
              </Link>
              {/* Metadados: text-xs font-medium text-muted — era text-[9px] */}
              <span className="font-label text-xs font-medium text-muted">
                {dateLabel}
                {study.readTime && (
                  <span className="text-subtle"> · {study.readTime}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const studies = getAllStudies();
  const featured = studies[0] ?? null;
  const rest = studies.slice(1, 7);

  return (
    <>
      {featured && <HeroArticle study={featured} />}

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Article grid */}
          <div>
            <div className="mb-8 flex items-center gap-4">
              <h2 className="font-label text-[10px] uppercase tracking-[0.25em] text-gold">
                Estudos recentes
              </h2>
              <div className="h-px flex-1 bg-gold/15" />
              <Link
                href="/estudos"
                className="font-label text-[9px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
              >
                Ver todos →
              </Link>
            </div>

            {rest.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((study, i) => (
                  <ArticleCard key={study.slug} study={study} index={i} />
                ))}
              </div>
            ) : (
              <div className="border border-gold/10 bg-card p-10 text-center">
                <p className="font-display text-xl text-gold/25 mb-3">✦</p>
                <p className="font-body text-text/30 text-sm">
                  Novos estudos em breve.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar excludeSlug={featured?.slug} />
        </div>
      </div>
    </>
  );
}
