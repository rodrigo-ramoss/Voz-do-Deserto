import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/app/components/NewsletterForm";
import { getAllScriptorium } from "@/lib/scriptorium";

export const metadata: Metadata = {
  title: "Arquivo do Deserto — Voz do Deserto",
  description:
    "Estudos completos, materiais e leituras recomendadas no blog Voz do Deserto.",
};

const placeholders = [
  {
    icon: "✦",
    title: "Coleção Apócrifos",
    description:
      "Guia completo dos textos excluídos do cânon — contexto histórico e análise crítica.",
    category: "Estudos completos",
  },
  {
    icon: "✦",
    title: "Jesus Histórico",
    description:
      "Material de estudo sobre o Jesus do século I fora da narrativa institucional.",
    category: "Estudos completos",
  },
  {
    icon: "✦",
    title: "Exegese do Original",
    description:
      "Dicionário prático de palavras gregas e hebraicas distorcidas pela tradução.",
    category: "Referência",
  },
  {
    icon: "✦",
    title: "História da Igreja",
    description:
      "Linha do tempo dos concílios, disputas e corrupção institucional — fontes primárias.",
    category: "Referência",
  },
  {
    icon: "✦",
    title: "Fé no Deserto",
    description:
      "Guia para quem está fora da instituição e busca profundidade espiritual autêntica.",
    category: "Formação",
  },
  {
    icon: "✦",
    title: "Leituras Recomendadas",
    description:
      "Curadoria de livros acadêmicos e documentários sobre Bíblia, história e teologia.",
    category: "Curadoria",
  },
];

export default function LivrariaPage() {
  // Carrega artigos reais do Scriptorium (vazio até o primeiro artigo ser publicado)
  const articles = getAllScriptorium();
  const hasArticles = articles.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">

      {/* ── Cabeçalho da página ─────────────────────────────────────────── */}
      {!hasArticles && (
        <p className="font-label text-[11px] uppercase tracking-[0.25em] text-gold mb-6">
          Em breve
        </p>
      )}
      <h1 className="font-display text-4xl text-text mb-4 md:text-5xl">
        Arquivo do Deserto
      </h1>
      <div className="h-px w-16 bg-gold/30 mb-5" />
      <p className="font-body text-lg text-text/55 max-w-xl leading-relaxed mb-16">
        Estudos completos, materiais de referência e leituras recomendadas.
        Cada item com curadoria — sem afilhados, sem publicidade.
      </p>

      {/* ── Scriptorium ─────────────────────────────────────────────────── */}
      <section aria-labelledby="scriptorium-heading" className="mb-20">

        {/* Cabeçalho da subsecção */}
        <div className="flex items-center gap-4 mb-8">
          <h2
            id="scriptorium-heading"
            className="font-display text-2xl text-text"
          >
            Scriptorium
          </h2>
          {!hasArticles && (
            <span className="font-label text-[9px] uppercase tracking-[0.25em] text-bg bg-gold/70 px-2 py-1 leading-none">
              Em breve
            </span>
          )}
        </div>

        {hasArticles ? (
          /* ── Artigos reais publicados ─── */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/livraria/scriptorium/${article.slug}`}
                className="group relative border border-gold/15 bg-card p-6 overflow-hidden hover:border-gold/40 transition-colors duration-200"
              >
                {/* Imagem de capa */}
                {article.image && (
                  <div className="relative h-36 -mx-6 -mt-6 mb-5 overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  </div>
                )}

                {/* Badge premium */}
                <p className="font-label text-[8px] uppercase tracking-[0.3em] text-gold mb-3">
                  {article.category}
                </p>

                <h3 className="font-display text-lg text-text mb-2 leading-snug group-hover:text-gold transition-colors duration-200">
                  {article.title}
                </h3>

                <p className="font-body text-sm text-text/50 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>

                {article.readTime && (
                  <p className="mt-4 font-label text-[8px] uppercase tracking-widest text-muted">
                    {article.readTime} de leitura
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          /* ── Placeholders enquanto não há artigos ─── */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {placeholders.map((item) => (
              <div
                key={item.title}
                className="relative border border-gold/10 bg-card p-6 overflow-hidden"
              >
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-bg/50 flex items-center justify-center z-10"
                  aria-label={`${item.title} — em breve`}
                >
                  <div className="text-center">
                    <p className="font-label text-[8px] uppercase tracking-[0.3em] text-gold/30 mb-1">
                      Em breve
                    </p>
                    <div className="w-6 h-6 border border-gold/20 flex items-center justify-center mx-auto">
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

                {/* Conteúdo desfocado */}
                <div className="blur-[2px] select-none" aria-hidden="true">
                  <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ember/50 mb-3">
                    {item.category}
                  </p>
                  <p className="font-display text-[10px] text-gold/20 mb-3">
                    {item.icon}
                  </p>
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
        )}
      </section>

      {/* Separador decorativo */}
      <div className="flex items-center gap-6 mb-14" aria-hidden>
        <div className="h-px flex-1 bg-gold/10" />
        <span className="text-xs text-gold/20">✦</span>
        <div className="h-px flex-1 bg-gold/10" />
      </div>

      {/* ── CTA Newsletter ──────────────────────────────────────────────── */}
      <section aria-labelledby="newsletter-heading" className="max-w-2xl mx-auto">
        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-gold mb-4 text-center">
          Seja o primeiro a saber
        </p>
        <h2
          id="newsletter-heading"
          className="font-display text-3xl text-text mb-3 text-center"
        >
          {hasArticles
            ? "Novos conteúdos no seu e-mail"
            : "Avise-me quando o Arquivo do Deserto abrir"}
        </h2>
        <p className="font-body text-base text-text/50 leading-relaxed mb-8 text-center">
          {hasArticles
            ? "Cadastre seu e-mail e seja notificado quando novos materiais do Scriptorium forem publicados."
            : "Cadastre seu e-mail e você será notificado quando os primeiros materiais estiverem disponíveis. Nenhum spam — apenas o aviso."}
        </p>
        <NewsletterForm context="page" />
      </section>

    </main>
  );
}
