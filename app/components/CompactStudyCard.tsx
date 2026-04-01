import Link from "next/link";
import type { StudyMeta } from "@/lib/studies";
import { formatDateSmart, getCtaLabel } from "@/lib/utils";

export default function CompactStudyCard({ study }: { study: StudyMeta }) {
  const dateLabel = formatDateSmart(study.date, "short");
  const ctaLabel = getCtaLabel(study.category);

  return (
    <article className="group border border-gold/10 bg-card p-4 transition-colors duration-200 hover:border-gold/25">
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

      <Link href={`/estudos/${study.slug}`} className="block mt-2.5">
        <h3 className="font-display text-sm font-semibold leading-snug text-text group-hover:text-gold transition-colors line-clamp-2">
          {study.title}
        </h3>
      </Link>

      {study.excerpt && (
        <p className="font-body text-xs leading-relaxed text-muted mt-2 line-clamp-2">
          {study.excerpt}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gold/8">
        <span className="font-label text-[10px] text-subtle">{dateLabel}</span>
        <Link
          href={`/estudos/${study.slug}`}
          className="font-label text-[10px] uppercase tracking-widest text-gold/70 hover:text-gold transition-colors"
          aria-label={`${ctaLabel.replace(" →", "")} — ${study.title}`}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}

