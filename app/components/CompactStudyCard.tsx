import Link from "next/link";
import Image from "next/image";
import type { StudyMeta } from "@/lib/studies";
import { formatDateSmart, getCtaLabel } from "@/lib/utils";

export default function CompactStudyCard({
  study,
  index = 0,
}: {
  study: StudyMeta;
  index?: number;
}) {
  const dateLabel = formatDateSmart(study.date, "short");
  const ctaLabel = getCtaLabel(study.category);
  const delay = Math.min(index, 10) * 70;

  return (
    <article
      className="mostread-card group border border-gold/10 bg-card transition-colors duration-200 hover:border-gold/25 overflow-hidden"
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex gap-4 p-4">
        {/* Capa */}
        <Link
          href={`/estudos/${study.slug}`}
          className="relative shrink-0 w-[92px] h-[92px] overflow-hidden border border-gold/12 bg-bg"
          tabIndex={-1}
          aria-hidden
        >
          {study.image ? (
            <>
              <Image
                src={study.image}
                alt={study.title}
                fill
                className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="carousel-scan-line" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.10] via-transparent to-ember/[0.06] flex items-center justify-center">
              <span className="font-display text-4xl text-gold/[0.06] select-none">
                ✦
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/55 to-transparent" />
        </Link>

        {/* Texto */}
        <div className="min-w-0 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/estudos?cat=${encodeURIComponent(study.category)}`}
              className="font-label text-[9px] uppercase tracking-[0.22em] text-muted hover:text-gold transition-colors line-clamp-1"
            >
              {study.category}
            </Link>
            {study.readTime && (
              <span className="font-label text-[9px] text-subtle bg-gold/5 border border-gold/10 px-1.5 py-px tracking-wider shrink-0">
                [{study.readTime}]
              </span>
            )}
          </div>

          <Link href={`/estudos/${study.slug}`} className="block mt-2">
            <h3 className="font-display text-sm font-semibold leading-snug text-text group-hover:text-gold transition-colors line-clamp-2">
              {study.title}
            </h3>
          </Link>

          {study.excerpt && (
            <p className="font-body text-xs leading-relaxed text-muted mt-2 line-clamp-2">
              {study.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-gold/8">
            <span className="font-label text-[10px] text-subtle">{dateLabel}</span>
            <Link
              href={`/estudos/${study.slug}`}
              className="font-label text-[10px] uppercase tracking-widest text-gold/70 hover:text-gold transition-colors"
              aria-label={`${ctaLabel.replace(" →", "")} — ${study.title}`}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Barra chamativa no hover */}
      <div className="card-hover-bar" aria-hidden />
    </article>
  );
}
