"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { NoticiaMeta } from "@/lib/noticias";
import { formatDateSmart } from "@/lib/utils";

interface Props {
  noticias: NoticiaMeta[];
}

const AUTO_MS = 5000;

export default function NoticiasCarousel({ noticias }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || noticias.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c === noticias.length - 1 ? 0 : c + 1));
    }, AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, noticias.length]);

  if (!noticias.length) return null;

  const noticia = noticias[current];

  return (
    <section
      className="border-b border-gold/10 bg-card/40"
      aria-label="Fora do Deserto — O que está acontecendo"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-6 py-5">

        {/* Cabeçalho da seção */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 shrink-0">
            {/* Ponto piscando — indica "ao vivo" / atualizado */}
            <span className="animate-blink w-1.5 h-1.5 rounded-full bg-ember/70 shrink-0" />
            <span className="font-label text-[9px] uppercase tracking-[0.3em] text-ember/80">
              Fora do Deserto
            </span>
          </div>
          <div className="h-px flex-1 bg-gold/10" />
          <Link
            href="/noticias"
            className="font-label text-[8px] uppercase tracking-widest text-muted/50 hover:text-gold transition-colors shrink-0"
          >
            Ver tudo →
          </Link>
        </div>

        {/* Corpo do carrossel */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* Caixa "O que está acontecendo fora do deserto" */}
          <div className="hidden md:flex shrink-0 flex-col justify-center border border-ember/20 bg-ember/5 px-4 py-3 min-w-[150px]">
            <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ember/60 leading-tight">
              O que está
            </p>
            <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ember/60 leading-tight">
              acontecendo
            </p>
            <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ember/60 leading-tight">
              fora do deserto
            </p>
          </div>

          {/* Imagem + Texto (animados juntos na troca de slide) */}
          <div key={noticia.slug} className="flex-1 min-w-0 flex items-center gap-4 animate-fade-in">

            {/* Imagem em miniatura */}
            {noticia.image ? (
              <Link
                href={`/noticias/${noticia.slug}`}
                className="relative shrink-0 w-[72px] h-[72px] md:w-24 md:h-24 overflow-hidden border border-ember/20 block group"
                tabIndex={-1}
                aria-hidden
              >
                <Image
                  src={noticia.image}
                  alt={noticia.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ) : (
              <div className="relative shrink-0 w-[72px] h-[72px] md:w-24 md:h-24 border border-ember/20 bg-ember/5 flex items-center justify-center">
                <span className="font-display text-2xl text-ember/20 select-none">✦</span>
              </div>
            )}

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/noticias/${noticia.slug}`}
                className="group block"
              >
                <h2 className="font-display text-lg leading-snug text-text group-hover:text-gold transition-colors duration-200 mb-1.5 md:text-xl line-clamp-2">
                  {noticia.title}
                </h2>
                {noticia.excerpt && (
                  <p className="font-body text-sm leading-relaxed text-muted line-clamp-1 hidden md:block">
                    {noticia.excerpt}
                  </p>
                )}
              </Link>

              <div className="flex items-center gap-3 mt-2">
                <span className="font-label text-[9px] uppercase tracking-widest text-muted/50">
                  {formatDateSmart(noticia.date, "short")}
                </span>
                {noticia.source && (
                  <>
                    <span className="text-gold/15">·</span>
                    <span className="font-label text-[9px] uppercase tracking-widest text-muted/40 hidden sm:inline">
                      {noticia.source}
                    </span>
                  </>
                )}
                <Link
                  href={`/noticias/${noticia.slug}`}
                  className="font-label text-[9px] uppercase tracking-widest text-gold/50 hover:text-gold transition-colors ml-auto"
                >
                  Ler →
                </Link>
              </div>
            </div>
          </div>

          {/* Setas + dots */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrent((c) => (c === 0 ? noticias.length - 1 : c - 1))}
              aria-label="Notícia anterior"
              className="text-muted/40 hover:text-gold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <div className="flex flex-col gap-1">
              {noticias.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPaused(true); }}
                  aria-label={`Notícia ${i + 1}`}
                  className={`transition-all duration-200 rounded-full ${
                    i === current
                      ? "w-1.5 h-4 bg-ember/70"
                      : "w-1.5 h-1.5 bg-gold/20 hover:bg-gold/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((c) => (c === noticias.length - 1 ? 0 : c + 1))}
              aria-label="Próxima notícia"
              className="text-muted/40 hover:text-gold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
