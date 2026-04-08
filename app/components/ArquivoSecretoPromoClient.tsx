"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { OOriginalMeta } from "@/lib/o-original";

function formatPtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ArquivoSecretoPromoClient({ latest }: { latest: OOriginalMeta[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const chips = useMemo(
    () => [
      { label: "O Original", href: "/livraria/o-original" },
      { label: "Doutrinas", href: "/livraria/o-original/doutrinas" },
      { label: "Livros", href: "/livraria/o-original/livros-biblicos" },
      { label: "Scriptorium", href: "/livraria/scriptorium" },
    ],
    []
  );

  const getStep = () => {
    const el = carouselRef.current;
    if (!el) return 320;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return 320;
    const style = window.getComputedStyle(el);
    const gapRaw = style.getPropertyValue("column-gap") || style.getPropertyValue("gap") || "0";
    const gap = Number.parseFloat(gapRaw) || 0;
    return Math.round(first.getBoundingClientRect().width + gap);
  };

  const scrollByStep = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const step = getStep();
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  useEffect(() => {
    if (latest.length <= 1) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const id = window.setInterval(() => {
      if (paused) return;
      if (document.hidden) return;

      const el = carouselRef.current;
      if (!el) return;

      const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 1;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      const step = getStep();
      el.scrollBy({ left: step, behavior: "smooth" });
    }, 4200);

    return () => window.clearInterval(id);
  }, [latest.length, paused]);

  if (!latest.length) return null;

  return (
    <section className="border-t border-gold/10">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="relative overflow-hidden border border-gold/15 bg-[#070604]">
          <style>{`
            @keyframes promoPop {
              0% { opacity: 0; transform: translateY(10px) scale(0.98); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes promoFloat {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .promo-chip { animation: promoPop 550ms ease both; }
            .promo-card { animation: promoPop 650ms ease both; }
            .promo-glow { animation: promoFloat 6s ease-in-out infinite; }
            .promo-hide-scrollbar::-webkit-scrollbar { display: none; }
            .promo-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          {/* brilho sutil */}
          <div
            className="absolute inset-0 opacity-[0.12] promo-glow pointer-events-none"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 15% 20%, rgba(212,183,106,0.18) 0%, transparent 60%)",
            }}
          />

          {/* “Anúncio” */}
          <div className="absolute left-4 top-4 z-10 font-label text-[9px] uppercase tracking-widest text-gold/70 border border-gold/25 bg-bg/40 px-2 py-1">
            Anúncio
          </div>

          <div className="px-6 pt-12 pb-8 md:px-10">
            <div className="flex items-start justify-between gap-8 flex-wrap">
              <div className="max-w-2xl">
                <p className="font-label text-[9px] uppercase tracking-[0.45em] text-gold/55 mb-3">
                  Arquivo Secreto
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-text leading-tight">
                  Tem mais coisa além do blog.
                </h2>
                <p className="font-body text-sm md:text-base leading-relaxed text-muted mt-3">
                  Estudos em camadas, doutrinas sob exame, livros bíblicos capítulo por capítulo e análises que não
                  cabem no feed.
                </p>

                <div className="mt-5 flex items-center gap-2 flex-wrap">
                  {chips.map((c, i) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="promo-chip font-label text-[9px] uppercase tracking-widest border border-gold/15 bg-gold/5 px-2.5 py-1 text-gold/70 hover:border-gold/35 hover:text-gold transition-colors"
                      style={{ animationDelay: `${120 + i * 90}ms` }}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/livraria"
                className="promo-card font-label text-[10px] uppercase tracking-widest border border-gold/45 px-6 min-h-[44px] inline-flex items-center text-gold hover:bg-gold hover:text-bg transition-colors"
                style={{ animationDelay: "220ms" }}
              >
                Conhecer o Arquivo Secreto →
              </Link>
            </div>
          </div>

          {/* carrossel de estudos do O Original */}
          <div className="px-6 pb-10 md:px-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-4 flex-1 min-w-[220px]">
                <div className="h-px flex-1 bg-gold/10" />
                <span className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/45 whitespace-nowrap">
                  Destaques do O Original
                </span>
                <div className="h-px flex-1 bg-gold/10" />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => scrollByStep("left")}
                  aria-label="Anterior"
                  className="w-8 h-8 border border-gold/15 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/40 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollByStep("right")}
                  aria-label="Próximo"
                  className="w-8 h-8 border border-gold/15 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/40 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={(e) => {
                const next = e.relatedTarget as Node | null;
                if (!next || !e.currentTarget.contains(next)) setPaused(false);
              }}
              className="flex gap-4 overflow-x-auto promo-hide-scrollbar scroll-smooth snap-x snap-mandatory pb-2"
            >
              {latest.map((a, i) => (
                <Link
                  key={a.slug}
                  href={`/livraria/o-original/${a.slug}`}
                  className="promo-card snap-start shrink-0 w-[260px] sm:w-[300px] border border-gold/10 bg-card/50 hover:border-gold/35 hover:bg-gold/[0.03] transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${120 + i * 40}ms` }}
                >
                  <div className="relative h-[150px] bg-[#0b0907]">
                    {a.image ? (
                      <Image src={a.image} alt={a.title} fill className="object-cover" sizes="300px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-6xl text-gold/10 select-none">✦</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070604]/85 via-transparent to-transparent" />
                    <div className="absolute left-4 bottom-3">
                      <p className="font-label text-[8px] uppercase tracking-widest text-gold/70">
                        {a.category || "O Original"}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="font-label text-[9px] uppercase tracking-[0.22em] text-muted/70">
                      {formatPtDate(a.date)}{a.readTime ? ` · ${a.readTime}` : ""}
                    </p>
                    <h3 className="font-display text-base leading-snug text-text mt-2 line-clamp-2">
                      {a.title}
                    </h3>
                    {a.excerpt ? (
                      <p className="font-body text-sm leading-relaxed text-muted mt-2 line-clamp-2">
                        {a.excerpt}
                      </p>
                    ) : null}

                    <div className="mt-4 pt-3 border-t border-gold/8 flex items-center justify-between">
                      <span className="font-label text-[8px] uppercase tracking-widest text-subtle">
                        Abrir estudo
                      </span>
                      <span className="font-label text-[9px] uppercase tracking-widest text-gold/60">
                        Ler →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* faixa final */}
          <div className="px-6 pb-8 md:px-10">
            <div className="flex items-center gap-4 border-t border-gold/10 pt-6">
              <p className="font-body text-sm text-text/45 leading-relaxed flex-1">
                Se você chegou até o fim… talvez esteja pronto para ver o que fica fora do púlpito.
              </p>
              <Link
                href="/livraria"
                className="font-label text-[9px] uppercase tracking-widest text-gold/60 hover:text-gold transition-colors shrink-0"
              >
                Entrar →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

