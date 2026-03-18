import Link from "next/link";
import type { StudyMeta } from "@/lib/studies";
import { getCtaLabel, formatDateSmart } from "@/lib/utils";

export default function FeaturedStudy({ study }: { study: StudyMeta | null }) {
  if (!study) return null;

  const dateLabel = formatDateSmart(study.date, "short");
  const ctaLabel = getCtaLabel(study.category);

  return (
    <section className="border-t border-gold/10 px-6 py-20" id="estudos">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-4">
          <span className="font-label text-[11px] uppercase tracking-[0.25em] text-gold">
            Estudo em destaque
          </span>
          <div className="h-px flex-1 bg-gold/15" />
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Decorative panel */}
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-gold/10 bg-card">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
            <div className="relative p-8 text-center">
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-gold/35 mb-6">
                {study.category}
              </p>
              <p className="font-display text-3xl leading-relaxed text-gold/20">
                {study.title}
              </p>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="font-label text-[10px] uppercase tracking-[0.25em] text-gold/70 border border-gold/25 px-3 py-1 mb-6 inline-block">
              {study.category}
            </span>

            <h2 className="font-display text-3xl leading-snug text-text mb-6 md:text-4xl">
              {study.title}
            </h2>

            {study.excerpt && (
              <p className="font-body text-lg leading-relaxed text-text/60 mb-8">
                {study.excerpt}
              </p>
            )}

            <div className="flex items-center gap-6">
              {/*
                T1: CTA dinâmico por categoria
                T2: text-gold (WCAG AA) + underline slide-in no hover
                T3: dateLabel exibe "Em breve" para datas futuras
              */}
              <Link
                href={`/estudos/${study.slug}`}
                className="
                  relative font-label text-[11px] uppercase tracking-widest text-gold
                  transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0
                  after:h-px after:w-0 after:bg-gold
                  after:transition-[width] after:duration-300
                  hover:after:w-full
                "
              >
                {ctaLabel}
              </Link>
              <span className="font-label text-[10px] text-muted">
                {dateLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
