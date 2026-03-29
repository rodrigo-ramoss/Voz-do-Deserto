"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDateSmart } from "@/lib/utils";
import type { CarouselArticle } from "./StudiesCarousel";

interface Props {
  articles: CarouselArticle[];
  linkBase: string;
}

const INITIAL_SHOW = 4;

export default function LibraryGrid({ articles, linkBase }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? articles : articles.slice(0, INITIAL_SHOW);
  const hasMore = articles.length > INITIAL_SHOW;

  if (!articles.length) return null;

  return (
    <div>
      {/* Grade estilo biblioteca digital */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {visible.map((article) => (
          <Link
            key={article.slug}
            href={`${linkBase}/${article.slug}`}
            className="group relative flex flex-col bg-card/60 overflow-hidden border border-gold/10
                       transition-all duration-300 hover:border-gold/35
                       hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          >
            {/* Capa — proporção de livro/documento */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gold/5 shrink-0">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-5xl text-gold/10 select-none">✦</span>
                </div>
              )}

              {/* Overlay escuro na base */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0804]/80 via-transparent to-transparent" />

              {/* Lombada dourada no topo — efeito encadernação */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/70 via-gold/40 to-transparent" />

              {/* Toque de luz no canto superior esquerdo */}
              <div className="absolute top-0 left-0 w-12 h-12 bg-gold/[0.04] blur-md" />
            </div>

            {/* Informações */}
            <div className="flex flex-col flex-1 px-3 pt-3 pb-3">

              {/* Título */}
              <h3 className="font-display text-[13px] leading-snug text-text/90
                             group-hover:text-gold transition-colors duration-200
                             line-clamp-3 flex-1 mb-3">
                {article.title}
              </h3>

              {/* Rodapé do card */}
              <div className="flex items-center justify-between pt-2.5 border-t border-gold/8 mt-auto">
                <span className="font-label text-[8px] uppercase tracking-widest text-muted/40">
                  {formatDateSmart(article.date, "short")}
                </span>
                <span className="font-label text-[8px] uppercase tracking-widest text-gold/45
                                 group-hover:text-gold transition-colors duration-200">
                  Ler →
                </span>
              </div>
            </div>

            {/* Borda lateral esquerda — efeito lombada */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold/20 via-gold/10 to-transparent
                            transition-all duration-300 group-hover:from-gold/50 group-hover:via-gold/25" />
          </Link>
        ))}
      </div>

      {/* Botão Ver Tudo / Recolher */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-2 font-label text-[9px] uppercase tracking-[0.25em]
                       border border-gold/20 text-gold/55 px-7 py-2.5
                       hover:border-gold/45 hover:text-gold transition-all duration-200"
          >
            {expanded ? (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                Ver menos
              </>
            ) : (
              <>
                Ver todos os {articles.length} estudos
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
