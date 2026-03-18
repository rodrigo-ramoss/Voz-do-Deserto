/*
 * ACESSIBILIDADE — Hierarquia de Headings (T2)
 * ─────────────────────────────────────────────────────────────────────────
 * Problema anterior: H1 → H3 (itens do grid) → H2 (newsletter).
 * Isso viola WCAG 1.3.1 — um H3 não pode preceder seu H2 pai no DOM.
 *
 * Estrutura corrigida:
 *
 *  <h1> Livraria
 *    <h2> Materiais em preparação    ← novo, introduce o grid
 *      <h3> Coleção Apócrifos        ← dentro de aria-hidden (conteúdo bloqueado)
 *      <h3> Jesus Histórico          ← idem
 *      ...
 *    <h2> Avise-me quando a Livraria abrir ← newsletter
 *
 * Os itens do grid estão numa camada visual bloqueada (overlay "Em breve").
 * O conteúdo interno (título, descrição) é inacessível pelo design — portanto
 * o div com blur recebe aria-hidden="true" para evitar que leitores de tela
 * leiam itens que o usuário não pode acessar ou interagir.
 * O overlay "Em breve" permanece visível para AT (informa o estado correto).
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { Metadata } from "next";
import NewsletterForm from "@/app/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Livraria — Voz do Deserto",
  description:
    "Em breve — estudos completos, materiais e leituras recomendadas no blog Voz do Deserto.",
};

const placeholders = [
  {
    icon: "✦",
    title: "Coleção Apócrifos",
    description: "Guia completo dos textos excluídos do cânon — contexto histórico e análise crítica.",
    category: "Estudos completos",
  },
  {
    icon: "✦",
    title: "Jesus Histórico",
    description: "Material de estudo sobre o Jesus do século I fora da narrativa institucional.",
    category: "Estudos completos",
  },
  {
    icon: "✦",
    title: "Exegese do Original",
    description: "Dicionário prático de palavras gregas e hebraicas distorcidas pela tradução.",
    category: "Referência",
  },
  {
    icon: "✦",
    title: "História da Igreja",
    description: "Linha do tempo dos concílios, disputas e corrupção institucional — fontes primárias.",
    category: "Referência",
  },
  {
    icon: "✦",
    title: "Fé no Deserto",
    description: "Guia para quem está fora da instituição e busca profundidade espiritual autêntica.",
    category: "Formação",
  },
  {
    icon: "✦",
    title: "Leituras Recomendadas",
    description: "Curadoria de livros acadêmicos e documentários sobre Bíblia, história e teologia.",
    category: "Curadoria",
  },
];

export default function LivrariaPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">

      {/* ── Cabeçalho da página ─────────────────────────────────────────── */}
      {/* <p> visual: "Em breve" é label decorativo, não heading de seção */}
      <p className="font-label text-[11px] uppercase tracking-[0.25em] text-gold mb-6">
        Em breve
      </p>
      {/* H1 único da página */}
      <h1 className="font-display text-4xl text-text mb-4 md:text-5xl">
        Livraria
      </h1>
      <div className="h-px w-16 bg-gold/30 mb-5" />
      <p className="font-body text-lg text-text/55 max-w-xl leading-relaxed mb-16">
        Estudos completos, materiais de referência e leituras recomendadas.
        Cada item com curadoria — sem afilhados, sem publicidade.
      </p>

      {/* ── Grid de materiais ───────────────────────────────────────────── */}
      {/*
        aria-labelledby="materials-heading": associa o <section> ao H2,
        assim leitores de tela anunciam "seção: Materiais em preparação".
      */}
      <section aria-labelledby="materials-heading" className="mb-20">
        {/*
          H2 "Materiais em preparação": corrige a hierarquia.
          Antes havia H3 sem H2 pai — inválido para WCAG 1.3.1.
          O H2 é oculto visualmente (sr-only) para não duplicar a
          descrição que já existe no parágrafo acima, mas permanece
          disponível para leitores de tela.
        */}
        <h2 id="materials-heading" className="sr-only">
          Materiais em preparação
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholders.map((item) => (
            <div
              key={item.title}
              className="relative border border-gold/10 bg-card p-6 overflow-hidden"
            >
              {/*
                Overlay de bloqueio — visível para AT.
                Comunica corretamente que o item não está disponível.
              */}
              <div
                className="absolute inset-0 bg-bg/50 flex items-center justify-center z-10"
                aria-label={`${item.title} — em breve`}
              >
                <div className="text-center">
                  <p className="font-label text-[8px] uppercase tracking-[0.3em] text-gold/30 mb-1">
                    Em breve
                  </p>
                  <div className="w-6 h-6 border border-gold/20 flex items-center justify-center mx-auto">
                    {/* Ícone de cadeado — decorativo, overlay já tem aria-label */}
                    <svg
                      className="w-3 h-3 text-gold/30"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/*
                Conteúdo bloqueado/desfocado.
                aria-hidden="true": oculta este bloco de leitores de tela.
                Justificativa: o conteúdo está visualmente bloqueado e
                indisponível — expô-lo via AT seria enganoso (o usuário
                não pode interagir com ele). O overlay acima já comunica
                o estado corretamente ("{título} — em breve").
              */}
              <div className="blur-[2px] select-none" aria-hidden="true">
                <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ember/50 mb-3">
                  {item.category}
                </p>
                <p className="font-display text-[10px] text-gold/20 mb-3">
                  {item.icon}
                </p>
                {/*
                  H3 dentro de aria-hidden — não conta na árvore de
                  acessibilidade, resolvendo o problema H1→H3 sem H2.
                  Hierarquia visível para AT: H1 → H2 → H2 (newsletter).
                */}
                <h3 className="font-display text-lg text-text/30 mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-text/20 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Separador decorativo */}
      <div className="flex items-center gap-6 mb-14" aria-hidden>
        <div className="h-px flex-1 bg-gold/10" />
        <span className="text-xs text-gold/20">✦</span>
        <div className="h-px flex-1 bg-gold/10" />
      </div>

      {/* ── CTA Newsletter ──────────────────────────────────────────────── */}
      {/*
        H2 "Avise-me quando a Livraria abrir": segundo H2 da página,
        irmão de "Materiais em preparação". Hierarquia final:
          H1 Livraria
            H2 Materiais em preparação (sr-only)
            H2 Avise-me quando a Livraria abrir
        Dois H2 irmãos é correto — representam seções distintas do mesmo nível.
      */}
      <section aria-labelledby="newsletter-heading" className="max-w-2xl mx-auto">
        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-gold mb-4 text-center">
          Seja o primeiro a saber
        </p>
        <h2
          id="newsletter-heading"
          className="font-display text-3xl text-text mb-3 text-center"
        >
          Avise-me quando a Livraria abrir
        </h2>
        <p className="font-body text-base text-text/50 leading-relaxed mb-8 text-center">
          Cadastre seu e-mail e você será notificado quando os primeiros
          materiais estiverem disponíveis. Nenhum spam — apenas o aviso.
        </p>
        <NewsletterForm context="page" />
      </section>

    </main>
  );
}
