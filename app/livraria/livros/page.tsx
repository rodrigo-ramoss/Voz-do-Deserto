import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/app/components/NewsletterForm";
import NonMonthlyOnly from "@/app/components/NonMonthlyOnly";

export const metadata: Metadata = {
  title: "Livraria — Arquivo Secreto · Voz do Deserto",
  description:
    "Acervo digital em preparação — livros, guias e recursos selecionados para quem leva a sério o estudo da Palavra e da história.",
};

const TEASER_ITEMS = [
  "Livros raramente publicados em português sobre exegese e história bíblica",
  "Guias digitais sobre preparação, resistência e discernimento cristão",
  "Recursos de estudo para quem quer ir além do que o mainstream oferece",
];

export default function LivrariaPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* ── Estilo de animações ───────────────────────────────────── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 0.4; }
          50%  { transform: scale(1.08); opacity: 0.15; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        .anim-1 { animation: fadeInUp 0.6s ease both; }
        .anim-2 { animation: fadeInUp 0.6s ease 0.12s both; }
        .anim-3 { animation: fadeInUp 0.6s ease 0.22s both; }
        .anim-4 { animation: fadeInUp 0.6s ease 0.34s both; }
        .pulse-ring { animation: pulseRing 3s ease-in-out infinite; }
      `}</style>

      {/* ── Fundo decorativo ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.025] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-28 flex flex-col items-center text-center">

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 mb-16 anim-1" aria-label="Navegação">
          <Link
            href="/livraria"
            className="font-label text-[9px] uppercase tracking-widest text-gold/40 hover:text-gold transition-colors"
          >
            Arquivo Secreto
          </Link>
          <span className="text-gold/20 text-[10px]" aria-hidden>›</span>
          <span className="font-label text-[9px] uppercase tracking-widest text-gold/70">
            Livraria
          </span>
        </nav>

        {/* ── Ícone de cadeado com anel pulsante ────────────────── */}
        <div className="relative mb-10 anim-1">
          <div
            className="pulse-ring absolute inset-0 w-20 h-20 border border-gold/20 rounded-sm"
            aria-hidden
            style={{ top: "-4px", left: "-4px", right: "-4px", bottom: "-4px", width: "calc(100% + 8px)", height: "calc(100% + 8px)" }}
          />
          <div className="w-16 h-16 border border-gold/25 flex items-center justify-center bg-gold/[0.03]">
            <svg className="w-7 h-7 text-gold/50" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* ── Badge ─────────────────────────────────────────────── */}
        <p className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/55 mb-6 anim-2">
          ✦ &nbsp; 02 · Em Preparação &nbsp; ✦
        </p>

        {/* ── Headline ──────────────────────────────────────────── */}
        <h1 className="font-display text-4xl md:text-5xl text-text leading-tight mb-5 anim-2">
          A Livraria<br />ainda está sendo montada.
        </h1>

        <div className="h-px w-12 bg-gold/30 mb-7 anim-2" />

        {/* ── Corpo ─────────────────────────────────────────────── */}
        <p className="font-body text-base text-text/50 leading-relaxed mb-4 max-w-lg anim-3">
          Estamos selecionando os recursos com cuidado — livros, guias e materiais
          que valem o seu tempo e não estão disponíveis em qualquer lugar.
        </p>
        <p className="font-body text-base text-text/35 leading-relaxed mb-12 max-w-lg anim-3">
          Quando abrir, você vai encontrar aqui o que dificilmente se acha reunido num só lugar.
        </p>

        {/* ── Teasers ───────────────────────────────────────────── */}
        <ul className="space-y-3 mb-14 text-left w-full max-w-md anim-3">
          {TEASER_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="text-gold/35 mt-[4px] text-[10px] shrink-0">◆</span>
              <span className="font-body text-sm text-text/45 leading-relaxed">{item}.</span>
            </li>
          ))}
        </ul>

        {/* ── Newsletter ────────────────────────────────────────── */}
        <NonMonthlyOnly>
          <section
            id="newsletter"
            aria-labelledby="newsletter-heading"
            className="w-full max-w-md border border-gold/15 bg-card/40 px-8 py-10 anim-4"
          >
            <p className="font-label text-[9px] uppercase tracking-[0.35em] text-gold/70 mb-3">
              Seja avisado primeiro
            </p>
            <h2
              id="newsletter-heading"
              className="font-display text-xl text-text mb-2"
            >
              Quero entrar quando abrir
            </h2>
            <p className="font-body text-sm text-text/40 leading-relaxed mb-7">
              Cadastre seu e-mail. Quando a Livraria abrir, você será um dos primeiros a saber —
              antes de qualquer anúncio público.
            </p>
            <NewsletterForm context="page" />
          </section>
        </NonMonthlyOnly>

        {/* ── Voltar ────────────────────────────────────────────── */}
        <div className="mt-12 anim-4">
          <Link
            href="/livraria"
            className="font-label text-[9px] uppercase tracking-widest text-gold/35 hover:text-gold transition-colors"
          >
            ← Voltar ao Arquivo Secreto
          </Link>
        </div>
      </div>
    </main>
  );
}
