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

// ── Scramble hook: título da notícia "decodifica" na troca de slide ──────────
// Versão mais rápida e agressiva que a do WeeklyCarousel — evoca "breaking news"
function useScrambleText(text: string): string {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%!?";
    let frame = 0;
    const TOTAL = 12; // 12 × 22ms ≈ 264ms — mais veloz que o carrossel de estudos

    if (frameRef.current) clearInterval(frameRef.current);

    frameRef.current = setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / TOTAL) * text.length);
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i <= revealed) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (frame >= TOTAL) {
        setDisplay(text);
        if (frameRef.current) clearInterval(frameRef.current);
      }
    }, 22);

    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [text]);

  return display;
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function NoticiasCarousel({ noticias }: Props) {
  if (!noticias.length) return null;
  return <Inner noticias={noticias} />;
}

function Inner({ noticias }: { noticias: NoticiaMeta[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const noticia = noticias[current];
  const scrambledTitle = useScrambleText(noticia.title);

  useEffect(() => {
    if (paused || noticias.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c === noticias.length - 1 ? 0 : c + 1));
    }, AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, noticias.length]);

  return (
    <section
      className="border-b border-gold/10 bg-card/40"
      aria-label="Fora do Deserto — O que está acontecendo"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-6 py-5">

        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 shrink-0">
            {/*
              Radar ping: ao invés de um simples ponto piscando, dois anéis
              se expandem em ondas defasadas — evoca sinal de satélite / radar.
              O ponto central fica fixo sobre as ondas.
            */}
            <span className="relative flex items-center justify-center w-3 h-3 shrink-0">
              <span className="radar-ring radar-ring-1" />
              <span className="radar-ring radar-ring-2" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-ember/80" />
            </span>
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

        {/* Corpo */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* Label lateral */}
          <div className="hidden md:flex shrink-0 flex-col justify-center border border-ember/20 bg-ember/5 px-4 py-3 min-w-[150px]">
            <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ember/60 leading-tight">O que está</p>
            <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ember/60 leading-tight">acontecendo</p>
            <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ember/60 leading-tight">fora do deserto</p>
          </div>

          {/* Imagem + texto (re-monta no key para reiniciar scramble) */}
          <div key={noticia.slug} className="flex-1 min-w-0 flex items-center gap-4 animate-fade-in">

            {/* Thumbnail */}
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
                {/* Scan line na imagem da notícia */}
                <div className="carousel-scan-line" />
              </Link>
            ) : (
              <div className="relative shrink-0 w-[72px] h-[72px] md:w-24 md:h-24 border border-ember/20 bg-ember/5 flex items-center justify-center">
                <span className="font-display text-2xl text-ember/20 select-none">✦</span>
              </div>
            )}

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <Link href={`/noticias/${noticia.slug}`} className="group block">
                {/*
                  scrambledTitle: título "decodifica" ao vivo quando o slide muda.
                  Usa font-display (serifada) — o contraste com os caracteres
                  aleatórios reforça o efeito de "sinal interceptado".
                */}
                <h2 className="font-display text-lg leading-snug text-text group-hover:text-gold transition-colors duration-200 mb-1.5 md:text-xl line-clamp-2">
                  {scrambledTitle}
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

          {/* Setas + dots verticais */}
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
