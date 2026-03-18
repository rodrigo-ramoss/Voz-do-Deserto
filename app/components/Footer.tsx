import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

/*
 * LEGIBILIDADE (T5)
 * ─────────────────────────────────────────────────────────────────────────
 * Problema anterior: praticamente todo o rodapé usava text-muted (#5C4F35)
 * com opacity reduzida — contraste efetivo < 1.5:1, quase invisível.
 *
 * Correções:
 * "Voz do Deserto":    text-sm font-semibold text-gold (#D4B76A, 10.5:1 ✓)
 * Subtítulo:           text-xs tracking-widest text-subtle (#8A7A60, 5.1:1 ✓)
 * Links de nav:        text-xs text-muted (#B8A98A, 8.6:1) — era text-muted/50
 * Copyright:           text-xs text-subtle (#8A7A60, 5.1:1) — era text-muted/45
 * Newsletter label:    text-xs text-gold (sem opacity) — era text-[9px]
 * Newsletter desc:     text-sm text-muted — era text-text/45
 * Background rodapé:   bg-[#050403] (levemente diferente do bg principal)
 *                      para delimitar visualmente o rodapé sem quebrar o tema
 * Links de nav:        min-h-[44px] flex items-center (touch target T6 ✓)
 * ─────────────────────────────────────────────────────────────────────────
 */

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-gold/15 bg-[#050403]">

      {/* ── Newsletter ──────────────────────────────────────────────── */}
      <div className="border-b border-gold/10 px-6 py-12">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            {/* text-xs text-gold sem opacity — era text-[9px] */}
            <p className="font-label text-xs uppercase tracking-[0.3em] text-gold mb-3">
              Newsletter
            </p>
            <p className="font-display text-xl text-text mb-2">
              Novos estudos no seu e-mail
            </p>
            {/* text-sm text-muted (#B8A98A) — era text-text/45 */}
            <p className="font-body text-sm text-muted leading-relaxed">
              Sem spam. Apenas os estudos publicados — apócrifos, exegese,
              história da Igreja.
            </p>
          </div>
          <NewsletterForm context="footer" />
        </div>
      </div>

      {/* ── Base do rodapé ──────────────────────────────────────────── */}
      <div className="px-6 py-10">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-6 md:flex-row">

          {/* Marca */}
          <div>
            {/* text-sm font-semibold text-gold (#D4B76A, 10.5:1) — era text-lg text-gold (#C9A84C) */}
            <p className="font-display text-sm font-semibold text-gold mb-1">
              Voz do Deserto
            </p>
            {/* text-xs text-subtle (#8A7A60, 5.1:1) — era text-[10px] text-muted (#5C4F35 = 1.9:1 ✗) */}
            <p className="font-label text-xs uppercase tracking-[0.2em] text-subtle">
              Estudos bíblicos profundos
            </p>
          </div>

          {/* Links de navegação do rodapé
              text-xs text-muted (#B8A98A) — era text-[9px] text-muted/50 (contraste ~1:1 ✗)
              min-h-[44px] flex items-center — toque mínimo WCAG T6         */}
          <nav className="flex items-center gap-2 flex-wrap justify-center" aria-label="Links do rodapé">
            {[
              { label: "Estudos", href: "/estudos" },
              { label: "Categorias", href: "/categorias" },
              { label: "Livraria", href: "/livraria" },
              { label: "Sobre", href: "/sobre" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="font-label text-xs uppercase tracking-widest text-muted hover:text-gold min-h-[44px] flex items-center px-2 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Copyright: text-xs text-subtle (#8A7A60) — era text-[10px] text-muted/45 */}
          <p className="font-label text-xs uppercase tracking-widest text-subtle">
            © 2026 — Todos os direitos reservados
          </p>
        </div>

        {/* Ornamento dourado */}
        <div className="mt-8 flex items-center justify-center gap-6" aria-hidden>
          <div className="h-px w-16 bg-gold/15" />
          <span className="text-xs text-gold/25">✦</span>
          <div className="h-px w-16 bg-gold/15" />
        </div>
      </div>

    </footer>
  );
}
