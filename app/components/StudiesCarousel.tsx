"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDateSmart } from "@/lib/utils";

export interface CarouselArticle {
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  date: string;
}

interface Props {
  articles: CarouselArticle[];
  /** Base URL para o link do artigo, ex: "/estudos" ou "/livraria/scriptorium" */
  linkBase: string;
  /** Máximo de artigos exibidos (padrão 5) */
  limit?: number;
}

const AUTO_MS = 5000;

export default function StudiesCarousel({ articles, linkBase, limit = 5 }: Props) {
  const items = articles.slice(0, limit);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));
    }, AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, items.length]);

  if (!items.length) return null;

  const article = items[current];

  return (
    <div
      className="border border-gold/10 bg-card/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="px-5 py-4 flex items-center gap-4 md:gap-6">

        {/* Imagem + Texto (animados juntos na troca de slide) */}
        <div key={article.slug} className="flex-1 min-w-0 flex items-center gap-4 animate-fade-in">

          {/* Imagem em miniatura */}
          {article.image ? (
            <Link
              href={`${linkBase}/${article.slug}`}
              className="relative shrink-0 w-[72px] h-[72px] md:w-20 md:h-20 overflow-hidden border border-gold/15 block group"
              tabIndex={-1}
              aria-hidden
            >
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ) : (
            <div className="relative shrink-0 w-[72px] h-[72px] md:w-20 md:h-20 border border-gold/10 bg-gold/5 flex items-center justify-center">
              <span className="font-display text-2xl text-gold/20 select-none">✦</span>
            </div>
          )}

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <Link href={`${linkBase}/${article.slug}`} className="group block">
              <h3 className="font-display text-base leading-snug text-text group-hover:text-gold transition-colors duration-200 mb-1 md:text-lg line-clamp-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="font-body text-xs leading-relaxed text-muted/60 line-clamp-1 hidden md:block">
                  {article.excerpt}
                </p>
              )}
            </Link>

            <div className="flex items-center gap-3 mt-2">
              <span className="font-label text-[9px] uppercase tracking-widest text-muted/50">
                {formatDateSmart(article.date, "short")}
              </span>
              <Link
                href={`${linkBase}/${article.slug}`}
                className="font-label text-[9px] uppercase tracking-widest text-gold/50 hover:text-gold transition-colors ml-auto"
              >
                Ler →
              </Link>
            </div>
          </div>
        </div>

        {/* Setas + dots */}
        {items.length > 1 && (
          <div className="flex flex-col items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1))}
              aria-label="Artigo anterior"
              className="text-muted/40 hover:text-gold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>

            <div className="flex flex-col gap-1">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPaused(true); }}
                  aria-label={`Artigo ${i + 1}`}
                  className={`transition-all duration-200 rounded-full ${
                    i === current
                      ? "w-1.5 h-4 bg-gold/70"
                      : "w-1.5 h-1.5 bg-gold/20 hover:bg-gold/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1))}
              aria-label="Próximo artigo"
              className="text-muted/40 hover:text-gold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
