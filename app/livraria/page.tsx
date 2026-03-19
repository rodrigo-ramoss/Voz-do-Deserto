import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/app/components/NewsletterForm";
import { getScriptoriumByCategory } from "@/lib/scriptorium";

export const metadata: Metadata = {
  title: "Arquivo Secreto — Voz do Deserto",
  description:
    "Estudos premium aprofundados sobre profecias, tecnologia, controle global e escatologia — Voz do Deserto.",
};

// Todas as categorias do Arquivo Secreto (ordem editorial)
const ALL_CATEGORIES = [
  {
    name: "Tecnologia & Teologia",
    description:
      "Quando a máquina começa a fazer perguntas que a teologia deveria ter respondido primeiro.",
    icon: "⚙",
  },
  {
    name: "Escatologia Digital 2.0 - IA e Controle",
    description:
      "O fim dos tempos reimaginado para uma era de algoritmos, deep fakes e vigilância total.",
    icon: "◈",
  },
  {
    name: "Hollywood Profetizou",
    description:
      "O que o cinema sabia décadas antes — e o que ainda está por vir nas telas e na realidade.",
    icon: "✦",
  },
  {
    name: "Pandemias",
    description:
      "Origens, narrativas construídas e o que as pandemias revelam sobre poder e controle social.",
    icon: "◉",
  },
  {
    name: "Profecias & Poder",
    description:
      "A interseção entre textos proféticos antigos e as estruturas de poder que moldam o presente.",
    icon: "◎",
  },
  {
    name: "Reset Mundial & Nova Ordem",
    description:
      "O grande reinício que não foi anunciado — como o sistema se reorganiza sem pedir permissão.",
    icon: "◐",
  },
  {
    name: "Como Não Ser Escravo da IA",
    description:
      "Guia prático de resistência cognitiva numa era em que a IA decide o que você pensa ser real.",
    icon: "◑",
  },
  {
    name: "Preparação & Novo Mundo",
    description:
      "O que fazer quando o sistema falha — e como se posicionar antes que o mapa mude de novo.",
    icon: "◌",
  },
  {
    name: "Previsões & Padrões do Sistema",
    description:
      "Padrões que se repetem na história, nos mercados e nas Escrituras — e o que eles apontam.",
    icon: "◇",
  },
  {
    name: "Igreja & CIA",
    description:
      "Conteúdo digno de excomunhão instantânea em pelo menos seis denominações. A engrenagem oculta do poder eclesiástico, o mercado da fé e tudo que o Banco Espiritual nunca deveria ter se tornado.",
    icon: "✝",
  },
];

export default function ArquivoSecretoPage() {
  // Artigos reais agrupados por categoria
  const byCategory = getScriptoriumByCategory();

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">

      {/* ── Cabeçalho ────────────────────────────────────────────────── */}
      <p className="font-label text-[11px] uppercase tracking-[0.25em] text-gold mb-6">
        Acesso Premium
      </p>
      <h1 className="font-display text-4xl text-text mb-4 md:text-5xl">
        Arquivo Secreto
      </h1>
      <div className="h-px w-16 bg-gold/30 mb-5" />
      <p className="font-body text-lg text-text/55 max-w-xl leading-relaxed mb-16">
        Estudos que não cabem no blog. Análises aprofundadas sobre os temas
        que o mainstream prefere ignorar — com fontes, exegese e argumento.
      </p>

      {/* ── Grade de categorias ──────────────────────────────────────── */}
      <div className="space-y-16">
        {ALL_CATEGORIES.map((cat) => {
          const articles = byCategory[cat.name] ?? [];
          const hasArticles = articles.length > 0;

          return (
            <section key={cat.name} aria-labelledby={`cat-${cat.name}`}>

              {/* Cabeçalho da categoria */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gold/10">
                <span className="font-display text-xl text-gold/40" aria-hidden>
                  {cat.icon}
                </span>
                <h2
                  id={`cat-${cat.name}`}
                  className="font-display text-xl text-text"
                >
                  {cat.name}
                </h2>
                {!hasArticles && (
                  <span className="ml-auto font-label text-[8px] uppercase tracking-[0.25em] text-bg bg-gold/40 px-2 py-1 leading-none">
                    Em breve
                  </span>
                )}
                {hasArticles && (
                  <span className="ml-auto font-label text-[8px] uppercase tracking-[0.25em] text-gold">
                    {articles.length} {articles.length === 1 ? "estudo" : "estudos"}
                  </span>
                )}
              </div>

              {/* Descrição da categoria */}
              <p className="font-body text-sm text-text/45 leading-relaxed mb-6 max-w-2xl">
                {cat.description}
              </p>

              {hasArticles ? (
                /* ── Artigos disponíveis ── */
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/livraria/scriptorium/${article.slug}`}
                      className="group border border-gold/15 bg-card overflow-hidden hover:border-gold/40 transition-colors duration-200"
                    >
                      {/* Imagem */}
                      {article.image && (
                        <div className="relative h-32 overflow-hidden">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                        </div>
                      )}

                      <div className="p-5">
                        {/* Preço */}
                        {article.price && (
                          <p className="font-label text-[8px] uppercase tracking-[0.3em] text-gold mb-2">
                            {article.price}
                          </p>
                        )}

                        <h3 className="font-display text-base text-text mb-2 leading-snug group-hover:text-gold transition-colors duration-200">
                          {article.title}
                        </h3>

                        <p className="font-body text-xs text-text/45 leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>

                        <p className="mt-4 font-label text-[8px] uppercase tracking-widest text-gold/60">
                          Ler estudo →
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* ── Placeholder vazio ── */
                <div className="border border-gold/8 bg-card/40 px-6 py-8 flex items-center gap-4">
                  <div className="w-8 h-8 border border-gold/15 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-gold/25"
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
                  <p className="font-body text-sm text-text/30 italic">
                    Estudos desta categoria em preparação. Cadastre-se abaixo para ser avisado.
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Separador */}
      <div className="flex items-center gap-6 my-20" aria-hidden>
        <div className="h-px flex-1 bg-gold/10" />
        <span className="text-xs text-gold/20">✦</span>
        <div className="h-px flex-1 bg-gold/10" />
      </div>

      {/* ── Newsletter ───────────────────────────────────────────────── */}
      <section aria-labelledby="newsletter-heading" className="max-w-2xl mx-auto">
        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-gold mb-4 text-center">
          Seja o primeiro a saber
        </p>
        <h2
          id="newsletter-heading"
          className="font-display text-3xl text-text mb-3 text-center"
        >
          Novos estudos no Arquivo Secreto
        </h2>
        <p className="font-body text-base text-text/50 leading-relaxed mb-8 text-center">
          Cadastre seu e-mail e seja avisado quando novos estudos forem
          publicados — antes de qualquer outra pessoa.
        </p>
        <NewsletterForm context="page" />
      </section>

    </main>
  );
}
