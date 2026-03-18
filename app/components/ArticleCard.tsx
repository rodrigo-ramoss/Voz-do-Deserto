import Link from "next/link";
import Image from "next/image";
import type { StudyMeta } from "@/lib/studies";
import { getCtaLabel, formatDateSmart } from "@/lib/utils";

/*
 * LEGIBILIDADE (T3) + ACESSIBILIDADE + MOBILE (T6)
 * ─────────────────────────────────────────────────────────────────────────
 * Título:    text-base font-semibold (16px) — era text-[1.1rem] sem weight
 * Excerpt:   text-sm text-muted (14px, #B8A98A 8.6:1) — era text-text/45
 * Metadados: text-xs font-medium text-muted — era text-[8px] text-muted/50
 * Tag:       bg-tag-bg text-gold border-tag-border rounded-full text-xs
 *            font-medium — era ember/opacity com 8px e contraste baixo
 * CTA:       text-sm font-medium text-gold — era text-[9px]
 * Padding:   p-5 (20px) ≥ p-4 (16px mínimo mobile T6) ✓
 * ─────────────────────────────────────────────────────────────────────────
 */

const categoryAccent: Record<string, string> = {
  "Apócrifos": "from-gold/[0.12] to-ember/[0.04]",
  "Exegese": "from-gold/[0.09] to-transparent",
  "História da Igreja": "from-ember/[0.08] to-gold/[0.04]",
  "História do Cânon": "from-ember/[0.08] to-gold/[0.04]",
  "Textos Antigos": "from-gold/[0.07] to-ember/[0.06]",
  "Teologia Bíblica": "from-gold/[0.10] to-transparent",
  "Hermenêutica": "from-ember/[0.06] to-gold/[0.08]",
  "Escatologia": "from-ember/[0.09] to-transparent",
  "Profecia": "from-gold/[0.08] to-ember/[0.05]",
  "Profecias": "from-gold/[0.08] to-ember/[0.05]",
  "Patrística": "from-gold/[0.06] to-ember/[0.07]",
  "Desigrejados": "from-ember/[0.10] to-gold/[0.05]",
  "Jesus Histórico": "from-gold/[0.08] to-ember/[0.06]",
  "Fé no Deserto": "from-gold/[0.11] to-transparent",
  "Apologética": "from-gold/[0.09] to-ember/[0.05]",
  "Denúncias": "from-ember/[0.11] to-gold/[0.04]",
};

function ArticleVisual({
  category,
  image,
  title,
}: {
  category: string;
  image?: string;
  title: string;
}) {
  const gradient = categoryAccent[category] ?? "from-gold/[0.07] to-transparent";

  if (image) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden bg-card">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-card">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display text-[6rem] leading-none text-gold/[0.055] select-none pointer-events-none"
          aria-hidden
        >
          ✦
        </span>
      </div>
      <div className="absolute inset-0 flex items-end p-4">
        <span className="font-label text-[9px] uppercase tracking-[0.35em] text-gold/20">
          {category}
        </span>
      </div>
    </div>
  );
}

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

  return (
    <article
      className="group flex flex-col border border-gold/10 bg-card transition-colors duration-300 hover:border-gold/25 animate-fade-in-up"
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {/* Imagem — link auxiliar, oculto para AT (título é o link principal) */}
      <Link href={`/estudos/${study.slug}`} tabIndex={-1} aria-hidden>
        <ArticleVisual
          category={study.category}
          image={study.image}
          title={study.title}
        />
      </Link>

      <div className="flex flex-col flex-1 p-5">

        {/* ── Tag de categoria ──────────────────────────────────────────
            bg-tag-bg (#2A2210) · text-gold (#D4B76A) · border-tag-border (#4A3A20)
            Contraste: #D4B76A sobre #2A2210 → ~8.3:1 (WCAG AAA ✓)
            rounded-full + text-xs font-medium seguem spec T3
            Sem opacity — contraste total garantido                     */}
        <Link
          href={`/estudos?cat=${encodeURIComponent(study.category)}`}
          className="inline-flex mb-3 self-start"
          aria-label={`Ver todos os estudos da categoria ${study.category}`}
        >
          <span className="font-label text-xs font-medium uppercase tracking-[0.2em] rounded-full px-2.5 py-0.5 text-gold bg-tag-bg border border-tag-border hover:bg-[#3A2E14] hover:text-gold-hover transition-colors">
            {study.category}
          </span>
        </Link>

        {/* ── Título ───────────────────────────────────────────────────
            text-base font-semibold (16px) — era text-[1.1rem] sem weight.
            font-semibold melhora legibilidade sem quebrar a identidade serifada. */}
        <Link href={`/estudos/${study.slug}`}>
          <h3 className="font-display text-base font-semibold leading-snug text-text mb-3 group-hover:text-gold transition-colors duration-200">
            {study.title}
          </h3>
        </Link>

        {/* ── Excerpt ──────────────────────────────────────────────────
            text-sm text-muted (14px, #B8A98A) — era text-text/45 (~1.8:1 ✗)
            Agora contraste 8.6:1 sobre fundo do card (#0d0b08)         */}
        {study.excerpt && (
          <p className="font-body text-sm leading-relaxed text-muted flex-1 mb-4 line-clamp-2">
            {study.excerpt}
          </p>
        )}

        {/* ── Rodapé do card ───────────────────────────────────────────*/}
        <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-auto">
          <div className="flex flex-col gap-0.5">
            {/* Metadados: text-xs font-medium (12px) — era text-[8px]
                text-muted (#B8A98A, 8.6:1) — era text-muted/50 (~1:1 ✗) */}
            <span className="font-label text-xs font-medium text-muted">
              {dateLabel}
            </span>
            {study.readTime && (
              /* text-subtle (#8A7A60, 5.1:1) para info de suporte */
              <span className="font-label text-xs text-subtle">
                {study.readTime} de leitura
              </span>
            )}
          </div>

          {/* CTA: text-sm font-medium (14px) — era text-[9px]
              text-gold (#D4B76A, 10.5:1) — sem opacity
              Hover: text-gold-hover (#E0C87A) + underline slide-in    */}
          <Link
            href={`/estudos/${study.slug}`}
            aria-label={`${ctaLabel.replace(" →", "")} — ${study.title}`}
            className="
              relative font-label text-sm font-medium uppercase tracking-widest text-gold
              transition-colors duration-200
              hover:text-gold-hover
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
    </article>
  );
}
