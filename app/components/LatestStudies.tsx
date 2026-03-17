import Link from "next/link";
import type { StudyMeta } from "@/lib/studies";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

export default function LatestStudies({ studies }: { studies: StudyMeta[] }) {
  if (!studies || studies.length === 0) return null;

  return (
    <section className="border-t border-gold/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-4">
          <span className="font-label text-[11px] uppercase tracking-[0.25em] text-gold">
            Estudos recentes
          </span>
          <div className="h-px flex-1 bg-gold/15" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {studies.map((study) => (
            <article
              key={study.slug}
              className="group flex flex-col border border-gold/10 bg-card p-6 transition-colors duration-300 hover:border-gold/25"
            >
              <span className="font-label text-[10px] uppercase tracking-[0.25em] text-gold/55 mb-4">
                {study.category}
              </span>

              <h3 className="font-display text-xl leading-snug text-text mb-3 transition-colors duration-200 group-hover:text-gold">
                {study.title}
              </h3>

              {study.excerpt && (
                <p className="font-body text-sm leading-relaxed text-text/50 flex-1 mb-6">
                  {study.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-auto">
                <Link
                  href={`/estudos/${study.slug}`}
                  className="font-label text-[10px] uppercase tracking-widest text-gold/55 transition-colors hover:text-gold"
                >
                  Ler →
                </Link>
                <span className="font-label text-[10px] text-muted">
                  {formatDate(study.date)}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/estudos"
            className="font-label text-[11px] uppercase tracking-widest text-muted border-b border-muted/30 pb-0.5 hover:text-gold hover:border-gold/40 transition-colors duration-200"
          >
            Ver todos os estudos
          </Link>
        </div>
      </div>
    </section>
  );
}
