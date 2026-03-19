"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { StudyMeta } from "@/lib/studies";
import { getCtaLabel, formatDateSmart } from "@/lib/utils";

interface Props {
  studies: StudyMeta[];
}

const AUTO_PLAY_MS = 6000;

export default function WeeklyCarousel({ studies }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!studies.length) return null;

  const study = studies[current];
  const ctaLabel = getCtaLabel(study.category);
  const dateLabel = formatDateSmart(study.date, "long");

  const prev = () => setCurrent((c) => (c === 0 ? studies.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === studies.length - 1 ? 0 : c + 1));

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c === studies.length - 1 ? 0 : c + 1));
    }, AUTO_PLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, studies.length]);

  return (
    <section
      className="border-b border-gold/10"
      aria-label="Publicações da semana"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-6 pt-6 pb-2 flex items-center justify-between">
        {/* Label */}
        <div className="flex items-center gap-3">
          <span className="font-label text-[9px] uppercase tracking-[0.3em] text-ember/80 border border-ember/20 px-2.5 py-1">
            Destaque
          </span>
          <span className="font-label text-[9px] uppercase tracking-[0.2em] text-muted/45">
            {current + 1} / {studies.length}
          </span>
        </div>

        {/* Setas */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Publicação anterior"
            className="flex items-center justify-center w-8 h-8 border border-gold/20 text-muted hover:text-gold hover:border-gold/50 transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Próxima publicação"
            className="flex items-center justify-center w-8 h-8 border border-gold/20 text-muted hover:text-gold hover:border-gold/50 transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Conteúdo do slide */}
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="grid items-center gap-10 md:grid-cols-2">

          {/* Visual */}
          <div className="relative aspect-[4/3] overflow-hidden border border-gold/10 bg-card group">
            {study.image ? (
              <Image
                src={study.image}
                alt={study.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority={current === 0}
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.10] via-transparent to-ember/[0.06]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-[8rem] leading-none text-gold/[0.055] select-none pointer-events-none">
                    ✦
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Texto */}
          <div key={study.slug} className="animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <Link
                href={`/estudos?cat=${encodeURIComponent(study.category)}`}
                className="font-label text-[9px] uppercase tracking-[0.25em] text-muted hover:text-gold transition-colors"
              >
                {study.category}
              </Link>
            </div>

            <h1 className="font-display text-4xl leading-tight text-text mb-5 md:text-5xl">
              {study.title}
            </h1>

            {study.excerpt && (
              <p className="font-body text-lg leading-relaxed text-muted mb-7">
                {study.excerpt}
              </p>
            )}

            <div className="flex items-center gap-6 flex-wrap">
              <Link
                href={`/estudos/${study.slug}`}
                className="font-label text-sm uppercase tracking-widest border border-gold px-7 min-h-[44px] flex items-center text-gold hover:bg-gold hover:text-bg transition-all duration-200"
              >
                {ctaLabel}
              </Link>
              <span className="font-label text-xs font-medium text-muted">
                {dateLabel}
                {study.readTime && (
                  <span className="text-subtle"> · {study.readTime}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dots + indicador */}
      <div className="flex items-center gap-3 justify-center pb-6" role="tablist" aria-label="Slides">
        {studies.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            onClick={() => { setCurrent(i); setPaused(true); }}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-1.5 bg-gold"
                : "w-1.5 h-1.5 bg-gold/25 hover:bg-gold/50"
            }`}
          />
        ))}
        {/* Ícone pause/play */}
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Retomar auto-play" : "Pausar auto-play"}
          className="ml-1 text-muted/40 hover:text-gold transition-colors"
        >
          {paused ? (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z"/></svg>
          ) : (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          )}
        </button>
      </div>
    </section>
  );
}
