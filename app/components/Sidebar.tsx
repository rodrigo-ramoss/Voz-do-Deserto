import Link from "next/link";
import Image from "next/image";
import { getAllStudies } from "@/lib/studies";
import { formatDateSmart } from "@/lib/utils";

/*
 * LEGIBILIDADE (T4) + MOBILE (T6)
 * ─────────────────────────────────────────────────────────────────────────
 * Títulos de seção: text-xs font-semibold tracking-widest — era text-[9px]
 * Itens de lista:   text-sm (14px) text-muted (#B8A98A) — era text-[9px]
 * Contagens:        text-xs font-medium text-subtle — era text-[8px]
 * Datas e labels:   text-xs (12px) — eram text-[7px] (ilegível)
 * Títulos na lista de recentes: text-sm — era text-[0.78rem]
 * Separadores:      border-t border-gold/20 (dourado sutil, mais visível)
 * Hover:            text-text (sem opacity) — era text-muted/60
 * ─────────────────────────────────────────────────────────────────────────
 */

export default function Sidebar({ excludeSlug }: { excludeSlug?: string }) {
  const studies = getAllStudies();
  const recent = studies.filter((s) => s.slug !== excludeSlug).slice(0, 5);

  const categoryMap = studies.reduce<Record<string, number>>((acc, s) => {
    if (s.category) acc[s.category] = (acc[s.category] ?? 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(categoryMap).sort((a, b) =>
    a[0].localeCompare(b[0], "pt-BR")
  );

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">

      {/* ── Sobre o projeto ─────────────────────────────────────────── */}
      <div className="border border-gold/10 bg-card p-6">
        {/* text-xs font-semibold — era text-[9px] sem weight */}
        <p className="font-label text-xs font-semibold uppercase tracking-widest text-gold mb-4">
          Sobre o projeto
        </p>
        {/* text-sm text-muted (#B8A98A) — era text-text/50 */}
        <p className="font-body text-sm leading-relaxed text-muted mb-5">
          Estudos bíblicos profundos sem filtro institucional — apócrifos,
          exegese do original grego e hebraico, história da Igreja. Para quem
          quer profundidade, não motivacional barato.
        </p>
        <Link
          href="/sobre"
          className="font-label text-sm text-gold border-b border-gold/30 pb-0.5 hover:text-gold-hover hover:border-gold-hover/50 transition-colors"
        >
          Saiba mais →
        </Link>
      </div>

      {/* Separador (dourado sutil, mais visível que antes) */}
      <div className="border-t border-gold/20" />

      {/* ── Categorias ──────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className="border border-gold/10 bg-card p-6">
          <p className="font-label text-xs font-semibold uppercase tracking-widest text-gold mb-4">
            Categorias
          </p>
          <div className="flex flex-col">
            {categories.map(([cat, count]) => (
              <Link
                key={cat}
                href={`/estudos?cat=${encodeURIComponent(cat)}`}
                className="flex items-center justify-between py-2.5 border-b border-gold/8 last:border-0 group min-h-[44px]"
              >
                {/* text-sm (14px) text-muted (#B8A98A) — era text-[9px] */}
                <span className="font-label text-sm uppercase tracking-[0.12em] text-muted group-hover:text-text transition-colors">
                  {cat}
                </span>
                {/* Contagem: text-xs font-medium text-subtle (#8A7A60, 5.1:1) */}
                <span className="font-label text-xs font-medium text-subtle bg-gold/8 px-1.5 py-0.5">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gold/20" />

      {/* ── Estudos recentes ────────────────────────────────────────── */}
      {recent.length > 0 && (
        <div className="border border-gold/10 bg-card p-6">
          <p className="font-label text-xs font-semibold uppercase tracking-widest text-gold mb-4">
            Estudos recentes
          </p>
          <div className="flex flex-col gap-4">
            {recent.map((study) => (
              <Link
                key={study.slug}
                href={`/estudos/${study.slug}`}
                className="group flex items-start gap-3 py-1"
              >
                {/* Thumbnail */}
                <div className="relative w-14 h-10 shrink-0 overflow-hidden bg-card border border-gold/10">
                  {study.image ? (
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/[0.08] to-transparent">
                      <span className="text-[10px] text-gold/20" aria-hidden>✦</span>
                    </div>
                  )}
                </div>

                {/* Título e meta */}
                <div className="flex-1 min-w-0">
                  {/* Categoria: text-xs (#B8A98A) — era text-[7px] (ilegível) */}
                  <span className="font-label text-xs uppercase tracking-[0.15em] text-muted block mb-0.5">
                    {study.category}
                  </span>
                  {/* Título: text-sm (14px) — era text-[0.78rem] */}
                  <span className="font-display text-sm leading-snug text-text/80 group-hover:text-gold transition-colors block line-clamp-2">
                    {study.title}
                  </span>
                  {/* Data: text-xs text-subtle — era text-[7px] text-muted/50 */}
                  <span className="font-label text-xs text-subtle block mt-0.5">
                    {formatDateSmart(study.date, "short")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tagline ornamental */}
      <div className="border border-gold/10 p-5 text-center">
        <div className="flex items-center justify-center gap-4 mb-3" aria-hidden>
          <div className="h-px w-8 bg-gold/15" />
          <span className="text-[10px] text-gold/20">✦</span>
          <div className="h-px w-8 bg-gold/15" />
        </div>
        <p className="font-display text-sm text-gold/35 leading-relaxed italic animate-fade-in">
          “O que o templo nunca te disse.”
        </p>
      </div>

    </aside>
  );
}
