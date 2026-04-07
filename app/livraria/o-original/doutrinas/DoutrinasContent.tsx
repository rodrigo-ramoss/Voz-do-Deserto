"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { OOriginalMeta } from "@/lib/o-original";

// ─── Agrupa por tema ──────────────────────────────────────────
function groupByTheme(articles: OOriginalMeta[]): Record<string, OOriginalMeta[]> {
  return articles.reduce<Record<string, OOriginalMeta[]>>((acc, a) => {
    const theme = a.title.split(":")[0].split("—")[0].trim();
    if (!acc[theme]) acc[theme] = [];
    acc[theme].push(a);
    return acc;
  }, {});
}

// Pega a imagem representativa do tema (primeira disponível)
function themeImage(articles: OOriginalMeta[]): string | undefined {
  return articles.find((a) => a.image)?.image;
}

// ─── Modal de Camadas ────────────────────────────────────────
function DoctrineModal({
  theme,
  articles,
  onClose,
}: {
  theme: string;
  articles: OOriginalMeta[];
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      onClick={onClose}
    >
      {/* Fundo escuro */}
      <div className="absolute inset-0 bg-bg/90 backdrop-blur-sm" aria-hidden />

      {/* Painel */}
      <div
        className="relative z-10 w-full md:max-w-lg bg-[#0d0b08] border border-gold/20
                   shadow-[0_0_60px_rgba(0,0,0,0.8)]
                   rounded-none md:rounded-sm
                   max-h-[92vh] md:max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Linha topo dourada */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent shrink-0" />

        {/* Header do modal */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-4">
            {themeImage(articles) && (
              <div className="w-12 h-12 shrink-0 overflow-hidden border border-gold/15">
                <Image
                  src={themeImage(articles)!}
                  alt={theme}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div>
              <p className="font-label text-[8px] uppercase tracking-[0.4em] text-gold/50 mb-1">
                Doutrina · {articles.length} camadas
              </p>
              <h2 className="font-display text-xl text-text leading-tight">{theme}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 w-8 h-8 border border-gold/15 flex items-center justify-center
                       text-muted hover:text-gold hover:border-gold/40 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Separador */}
        <div className="h-px mx-6 bg-gold/10 shrink-0" />

        {/* Descrição do primeiro artigo (contexto) */}
        {articles[0]?.excerpt && (
          <p className="font-body text-sm text-text/40 leading-relaxed px-6 pt-4 pb-2 shrink-0">
            {articles[0].excerpt.slice(0, 160)}…
          </p>
        )}

        {/* Lista de camadas — scrollável */}
        <ul className="flex flex-col overflow-y-auto px-6 pb-6 pt-2 gap-3">
          {articles.map((article, index) => (
            <li key={article.slug}>
              <button
                onClick={() => router.push(`/livraria/o-original/${article.slug}`)}
                className="group w-full text-left border border-gold/10 bg-card/40
                           hover:border-gold/35 hover:bg-gold/[0.03]
                           transition-all duration-200 p-4 flex items-start gap-4"
              >
                {/* Número da camada */}
                <div className="w-7 h-7 border border-gold/20 bg-gold/5 flex items-center
                                justify-center shrink-0 mt-0.5
                                group-hover:border-gold/50 group-hover:bg-gold/10 transition-all duration-200">
                  <span className="font-label text-[9px] text-gold/60 group-hover:text-gold transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <p className="font-label text-[8px] uppercase tracking-widest text-gold/40 mb-1">
                    Camada {index + 1}
                    {article.verse && ` · ${article.verse}`}
                  </p>
                  <h3 className="font-display text-sm leading-snug text-text group-hover:text-gold transition-colors line-clamp-2">
                    {/* Remove o prefixo "Nome: Camada X —" para mostrar só o subtítulo */}
                    {article.title.includes("—")
                      ? article.title.split("—").slice(1).join("—").trim()
                      : article.title}
                  </h3>
                </div>

                {/* Seta */}
                <svg
                  className="w-3.5 h-3.5 text-gold/30 group-hover:text-gold shrink-0 mt-1
                             transition-all duration-200 group-hover:translate-x-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="border-t border-gold/10 px-6 py-4 shrink-0 flex items-center justify-between">
          <span className="font-label text-[8px] uppercase tracking-widest text-gold/25">
            O Original · Voz do Deserto
          </span>
          <button
            onClick={onClose}
            className="font-label text-[8px] uppercase tracking-widest text-gold/40
                       hover:text-gold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card de doutrina (lista compacta) ───────────────────────
function DoctrineRow({
  theme,
  articles,
  onOpen,
}: {
  theme: string;
  articles: OOriginalMeta[];
  onOpen: () => void;
}) {
  const img = themeImage(articles);

  return (
    <button
      onClick={onOpen}
      className="group w-full text-left border border-gold/10 bg-card/50
                 hover:border-gold/35 hover:bg-gold/[0.02]
                 transition-all duration-300 flex items-center gap-0 overflow-hidden
                 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      {/* Lombada esquerda */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b
                      from-gold/0 via-gold/0 to-gold/0
                      group-hover:from-gold/50 group-hover:via-gold/25 group-hover:to-transparent
                      transition-all duration-300" />

      {/* Thumbnail */}
      <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 overflow-hidden bg-gold/5 relative">
        {img ? (
          <Image
            src={img}
            alt={theme}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-2xl text-gold/10 select-none">◈</span>
          </div>
        )}
        {/* Overlay escuro na imagem */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0b08]/60" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 px-5 py-4">
        <p className="font-label text-[8px] uppercase tracking-[0.3em] text-gold/45 mb-1">
          {articles.length} camadas · {articles[0]?.language ?? "Grego / Hebraico"}
        </p>
        <h3 className={`font-display text-base md:text-lg leading-snug mb-1.5
                        text-text group-hover:text-gold transition-colors duration-200`}>
          {theme}
        </h3>
        {articles[0]?.description && (
          <p className="font-body text-xs text-text/35 leading-relaxed line-clamp-2">
            {articles[0].description.slice(0, 110)}…
          </p>
        )}
      </div>

      {/* CTA direita */}
      <div className="shrink-0 pr-5 flex flex-col items-center gap-1.5">
        <div className="w-8 h-8 border border-gold/20 flex items-center justify-center
                        group-hover:border-gold/50 group-hover:bg-gold/8 transition-all duration-200">
          <svg className="w-3.5 h-3.5 text-gold/40 group-hover:text-gold transition-colors" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        <span className="font-label text-[7px] uppercase tracking-widest text-gold/30
                         group-hover:text-gold/60 transition-colors hidden md:block">
          Ver
        </span>
      </div>
    </button>
  );
}

// ─── Página principal ────────────────────────────────────────
export default function DoutrinasContent({ articles }: { articles: OOriginalMeta[] }) {
  const byTheme = groupByTheme(articles);
  const themes = Object.entries(byTheme);

  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const activeArticles = activeTheme ? byTheme[activeTheme] : [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 relative">

      {/* Modal */}
      {activeTheme && (
        <DoctrineModal
          theme={activeTheme}
          articles={activeArticles}
          onClose={() => setActiveTheme(null)}
        />
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-12" aria-label="Navegação">
        <Link href="/livraria" className="font-label text-[9px] uppercase tracking-widest text-gold/40 hover:text-gold transition-colors">
          Arquivo Secreto
        </Link>
        <span className="text-gold/20 text-[10px]" aria-hidden>›</span>
        <Link href="/livraria/o-original" className="font-label text-[9px] uppercase tracking-widest text-gold/40 hover:text-gold transition-colors">
          O Original
        </Link>
        <span className="text-gold/20 text-[10px]" aria-hidden>›</span>
        <span className="font-label text-[9px] uppercase tracking-widest text-gold/70">Doutrinas</span>
      </nav>

      {/* Header */}
      <p className="font-label text-[10px] uppercase tracking-[0.4em] text-gold/60 mb-4">
        Exegese · Refutação com Texto
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-text mb-4">Doutrinas</h1>
      <div className="h-px w-16 bg-gold/30 mb-5" />
      <p className="font-body text-base text-text/50 leading-relaxed max-w-xl mb-3">
        Cada doutrina analisada em 4 camadas — texto original, desenvolvimento histórico,
        debate acadêmico e posição fundamentada.
      </p>
      <p className="font-label text-[9px] uppercase tracking-widest text-gold/40 mb-14">
        ↻ Atualizado semanalmente · Clique em uma doutrina para ver as camadas
      </p>

      {/* Lista de doutrinas */}
      {themes.length === 0 ? (
        <div className="border border-gold/10 bg-card/40 px-8 py-14 text-center">
          <p className="font-body text-sm text-text/35 italic">
            Os primeiros estudos estão sendo preparados.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 relative">
          {themes.map(([theme, themeArticles]) => (
            <DoctrineRow
              key={theme}
              theme={theme}
              articles={themeArticles}
              onOpen={() => setActiveTheme(theme)}
            />
          ))}
        </div>
      )}

      {/* Mais doutrinas em breve */}
      <div className="mt-10 border border-gold/8 bg-card/30 px-6 py-5 flex items-center gap-4">
        <span className="text-gold/20 text-lg" aria-hidden>◇</span>
        <p className="font-body text-sm text-text/35 italic">
          Novas doutrinas sendo preparadas — Trindade, Dízimo, Batismo, Predestinação e outras.
        </p>
      </div>

      <div className="mt-14 pt-8 border-t border-gold/8">
        <Link href="/livraria/o-original"
          className="font-label text-[9px] uppercase tracking-widest text-gold/35 hover:text-gold transition-colors">
          ← Voltar a O Original
        </Link>
      </div>

    </main>
  );
}
