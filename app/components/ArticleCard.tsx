import Link from "next/link";
import Image from "next/image";
import type { StudyMeta } from "@/lib/studies";
import { getCtaLabel, formatDateSmart } from "@/lib/utils";

/*
 * ARTICLE CARD — estilo terminal / tech
 * ─────────────────────────────────────────────────────────────────────────
 * • Index [01] no topo-esquerdo da borda (badge posicionado sobre ela)
 * • Categoria com prompt › e badge [Xmin] à direita
 * • Barra dourada que expande no rodapé ao hover (CSS em globals.css)
 * • Scan line na imagem ao hover (reusa .carousel-scan-line)
 * ─────────────────────────────────────────────────────────────────────────
 */

export default function ArticleCard({
  study,
  index = 0,
}: {
  study: StudyMeta;
  index?: number;
}) {
  const delay = Math.min(index, 8) * 80;
  const dateLabel = formatDateSmart(study.date, "short");
  const ctaLabel = getCtaLabel(study.category);
  const idx = String(index + 1).padStart(2, "0");

  return (
    <article
      className="group relative flex flex-col border border-gold/10 bg-card transition-colors duration-300 hover:border-gold/25 animate-fade-in-up overflow-hidden"
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {/* ── Index badge ──────────────────────────────────────────────── */}
      <span
        className="absolute top-0 left-4 z-10 -translate-y-1/2 font-label text-[9px] text-gold/30 bg-card px-1.5 border border-gold/10 tracking-widest"
        aria-hidden
      >
        {idx}
      </span>

      {/* ── Imagem + scan line hover ─────────────────────────────────── */}
      <Link href={`/estudos/${study.slug}`} tabIndex={-1} aria-hidden>
        <div className="relative aspect-[2/1] overflow-hidden bg-card">
          {study.image ? (
            <Image
              src={study.image}
              alt={study.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.08] via-transparent to-ember/[0.04]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-[5rem] leading-none text-gold/[0.05] select-none pointer-events-none" aria-hidden>
                  ✦
                </span>
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />

          {/* Scan line que varre a imagem no hover */}
          <div className="card-scan-line" />
        </div>
      </Link>

      {/* ── Conteúdo ─────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">

        {/* Categoria terminal + read-time badge */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/estudos?cat=${encodeURIComponent(study.category)}`}
            className="inline-flex items-center gap-1 group/cat"
            aria-label={`Ver todos da categoria ${study.category}`}
          >
            <span className="text-ember/40 font-label text-[10px]" aria-hidden>›</span>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-muted group-hover/cat:text-gold transition-colors">
              {study.category}
            </span>
          </Link>

          {study.readTime && (
            <span className="font-label text-[9px] text-subtle bg-gold/5 border border-gold/10 px-1.5 py-px tracking-wider shrink-0">
              [{study.readTime}]
            </span>
          )}
        </div>

        {/* Título */}
        <Link href={`/estudos/${study.slug}`}>
          <h3 className="font-display text-base font-semibold leading-snug text-text group-hover:text-gold transition-colors duration-200 line-clamp-2">
            {study.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {study.excerpt && (
          <p className="font-body text-sm leading-relaxed text-muted flex-1 line-clamp-2">
            {study.excerpt}
          </p>
        )}

        {/* Rodapé — data + CTA */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-gold/8">
          <span className="font-label text-xs text-subtle">
            {dateLabel}
          </span>
          <Link
            href={`/estudos/${study.slug}`}
            aria-label={`${ctaLabel.replace(" →", "")} — ${study.title}`}
            className="
              relative font-label text-xs font-medium uppercase tracking-widest text-gold
              transition-colors duration-200 hover:text-gold-hover
              after:absolute after:bottom-0 after:left-0
              after:h-px after:w-0 after:bg-gold
              after:transition-[width] after:duration-300
              hover:after:w-full hover:after:bg-gold-hover
            "
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      {/*
        Barra dourada no rodapé que expande de 0 a 100% no hover,
        evocando uma barra de carregamento / progress bar terminal.
      */}
      <div className="card-hover-bar" aria-hidden />
    </article>
  );
}
