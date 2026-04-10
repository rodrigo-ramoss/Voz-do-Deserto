"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Ebook } from "@/lib/ebooks";
import { saveProgress, getProgress } from "../EbookProgressBadge";

interface Props {
  ebook: Ebook;
  allEbooks: { slug: string; title: string; volume: number }[];
}

export default function EbookReader({ ebook, allEbooks }: Props) {
  const [activeChapter, setActiveChapter] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResume, setShowResume] = useState(false);
  const [savedScrollY, setSavedScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRestored = useRef(false);

  /* ── Carregar progresso salvo ── */
  useEffect(() => {
    const saved = getProgress(ebook.slug);
    if (saved && saved.percent > 2 && saved.percent < 98) {
      setSavedScrollY(saved.scrollY);
      // Mostra banner "continuar" só se não vier do hash #vzd-resume
      if (!window.location.hash.includes("vzd-resume")) {
        setShowResume(true);
      }
    }
  }, [ebook.slug]);

  /* ── Restaurar posição ao clicar em "Continuar" ── */
  useEffect(() => {
    if (window.location.hash === "#vzd-resume" && !hasRestored.current) {
      hasRestored.current = true;
      const saved = getProgress(ebook.slug);
      if (saved?.scrollY) {
        // Pequeno delay para o conteúdo renderizar
        setTimeout(() => {
          window.scrollTo({ top: saved.scrollY, behavior: "smooth" });
        }, 400);
      }
      // Limpa o hash da URL sem reload
      history.replaceState(null, "", window.location.pathname);
    }
  }, [ebook.slug]);

  /* ── Progresso de leitura + salvar ── */
  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const total = el.offsetHeight;
    const scrolled = Math.max(0, window.scrollY - el.offsetTop);
    const pct = Math.min(100, Math.round((scrolled / total) * 100));
    setProgress(pct);

    // Salva com debounce de 1.5s
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProgress({
        slug: ebook.slug,
        percent: pct,
        scrollY: window.scrollY,
        date: new Date().toISOString(),
        title: ebook.title,
      });
    }, 1500);
  }, [ebook.slug, ebook.title]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [handleScroll]);

  /* ── Capítulo ativo ── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ebook.chapters.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveChapter(id); },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ebook.chapters]);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
    setTocOpen(false);
  };

  const handleResume = () => {
    setShowResume(false);
    setTimeout(() => window.scrollTo({ top: savedScrollY, behavior: "smooth" }), 80);
  };

  /* Prev / Next */
  const currentIdx = allEbooks.findIndex((e) => e.slug === ebook.slug);
  const prev = currentIdx > 0 ? allEbooks[currentIdx - 1] : null;
  const next = currentIdx < allEbooks.length - 1 ? allEbooks[currentIdx + 1] : null;

  return (
    <>
      {/* ── Barra de progresso no topo ── */}
      <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-[#1a1a1a]" aria-hidden>
        <div
          className="h-full bg-[#d4a855] transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Toast "Continuar de onde parou" ── */}
      {showResume && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-in">
          <div className="flex items-center gap-3 rounded-xl border border-[#d4a855]/30 bg-[#111108] px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4a855]/15 text-[#d4a855]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[#5a5a4e]">Você leu {progress > 0 ? progress : getProgress(ebook.slug)?.percent ?? 0}% deste livro</p>
              <p className="text-sm font-semibold text-[#c8c4b8]">Continuar de onde parou?</p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={handleResume}
                className="rounded-lg bg-[#d4a855] px-3 py-1.5 text-xs font-bold text-[#0a0a0a] transition-opacity hover:opacity-90"
              >
                Continuar
              </button>
              <button
                onClick={() => setShowResume(false)}
                className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#5a5a4e] hover:text-[#8a8a7a]"
              >
                Do início
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#0e0e0e]">
        {/* ── Header do leitor ── */}
        <header className="sticky top-0 z-40 border-b border-[#1e1e1e] bg-[#0e0e0e]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
            <Link
              href="/livraria/ebooks"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-[#6b6b5e] transition-colors hover:text-[#d4a855]"
              aria-label="Voltar à livraria"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              <span className="hidden sm:inline">Livraria</span>
            </Link>

            <div className="flex-1 text-center">
              <span className="text-xs font-semibold tracking-widest text-[#b4823c] uppercase">
                Vol. {ebook.volume} ·{" "}
              </span>
              <span className="text-xs text-[#6b6b5e]">{ebook.title}</span>
            </div>

            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-[#6b6b5e] transition-colors hover:text-[#d4a855] lg:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              <span className="hidden sm:inline">Sumário</span>
            </button>

            <span className="text-xs text-[#4a4a42]">{progress}%</span>
          </div>

          {tocOpen && (
            <nav className="border-t border-[#1e1e1e] bg-[#0e0e0e] px-4 pb-4 pt-2 lg:hidden">
              <p className="mb-2 text-xs font-semibold tracking-widest text-[#5a5a4e] uppercase">Sumário</p>
              <ul className="space-y-1">
                {ebook.chapters.map((ch) => (
                  <li key={ch.id}>
                    <button
                      onClick={() => scrollToChapter(ch.id)}
                      className={`w-full rounded px-2 py-1.5 text-left text-sm transition-colors ${
                        activeChapter === ch.id ? "text-[#d4a855]" : "text-[#6b6b5e] hover:text-[#c8c8b8]"
                      }`}
                    >
                      {ch.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </header>

        {/* ── Layout: sidebar + conteúdo ── */}
        <div className="mx-auto flex max-w-6xl gap-0 px-4 lg:gap-10 lg:px-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-16 w-56 pt-10">
              <div className="mb-6 overflow-hidden rounded-lg shadow-xl">
                <Image src={ebook.image} alt={ebook.title} width={224} height={314} className="w-full object-cover" />
              </div>

              <p className="mb-3 text-xs font-semibold tracking-widest text-[#5a5a4e] uppercase">Sumário</p>
              <nav>
                <ul className="space-y-1">
                  {ebook.chapters.map((ch) => (
                    <li key={ch.id}>
                      <button
                        onClick={() => scrollToChapter(ch.id)}
                        className={`w-full rounded px-2 py-1.5 text-left text-xs leading-snug transition-colors ${
                          activeChapter === ch.id
                            ? "font-semibold text-[#d4a855]"
                            : "text-[#5a5a4e] hover:text-[#c8c8b8]"
                        }`}
                      >
                        {ch.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Progresso salvo na sidebar */}
              {progress > 0 && (
                <div className="mt-6 rounded-lg border border-[#1e1e1e] bg-[#111108] p-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[10px] text-[#4a4a42]">Seu progresso</p>
                    <p className="text-[10px] font-bold text-[#d4a855]">{progress}%</p>
                  </div>
                  <div className="h-1 w-full rounded-full bg-[#2a2a1a] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#d4a855]/60 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Trilogia na sidebar */}
              <div className="mt-6 space-y-1.5 border-t border-[#1e1e1e] pt-5">
                <p className="mb-2 text-xs font-semibold tracking-widest text-[#4a4a42] uppercase">Trilogia</p>
                {allEbooks.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/livraria/ebooks/${e.slug}`}
                    className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors ${
                      e.slug === ebook.slug
                        ? "bg-[#1a1a1a] text-[#d4a855]"
                        : "text-[#4a4a42] hover:text-[#8a8a7a]"
                    }`}
                  >
                    <span className="font-bold text-[#b4823c]/60">{e.volume}.</span>
                    <span className="truncate">{e.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Conteúdo ── */}
          <article className="flex-1 py-10 pb-24">
            <div className="mb-12 border-b border-[#1e1e1e] pb-10 text-center">
              <p className="mb-2 text-xs font-semibold tracking-widest text-[#b4823c] uppercase">
                {ebook.trilogy} · Volume {ebook.volume}
              </p>
              <h1 className="mb-2 font-serif text-3xl font-bold text-[#f0e6d3] md:text-4xl">
                {ebook.title}
              </h1>
              <p className="mb-4 font-serif text-lg italic text-[#8a8a7a]">{ebook.subtitle}</p>
              <p className="text-sm text-[#5a5a4e]">
                Rodrigo Ramos · Voz do Deserto ·{" "}
                <span className="text-[#b4823c]/70">{ebook.readTime} de leitura</span>
              </p>
            </div>

            <div
              ref={contentRef}
              className="ebook-body"
              dangerouslySetInnerHTML={{ __html: ebook.contentHtml }}
            />

            {/* Navegação entre volumes */}
            <div className="mt-16 flex flex-col gap-4 border-t border-[#1e1e1e] pt-10 sm:flex-row sm:justify-between">
              {prev ? (
                <Link
                  href={`/livraria/ebooks/${prev.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] px-5 py-4 text-sm text-[#8a8a7a] transition-colors hover:border-[#b4823c]/30 hover:text-[#d4a855]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  <div>
                    <p className="text-xs text-[#4a4a42]">Volume anterior</p>
                    <p className="font-semibold">{prev.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {next ? (
                <Link
                  href={`/livraria/ebooks/${next.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] px-5 py-4 text-sm text-[#8a8a7a] transition-colors hover:border-[#b4823c]/30 hover:text-[#d4a855] sm:flex-row-reverse"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <div className="sm:text-right">
                    <p className="text-xs text-[#4a4a42]">Próximo volume</p>
                    <p className="font-semibold">{next.title}</p>
                  </div>
                </Link>
              ) : (
                <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] px-5 py-4 text-center text-sm text-[#4a4a42]">
                  Você chegou ao fim da trilogia 🏜️
                </div>
              )}
            </div>
          </article>
        </div>
      </div>

      {/* ── Estilos do corpo ── */}
      <style>{`
        .ebook-body {
          color: #c8c4b8;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.0625rem;
          line-height: 1.85;
          max-width: 68ch;
          margin: 0 auto;
        }
        .ebook-body h1 { display: none; }
        .ebook-body h2 {
          font-family: Georgia, serif;
          font-size: 1.45rem;
          font-weight: 700;
          color: #f0e6d3;
          margin-top: 3rem;
          margin-bottom: 1rem;
          padding-top: 0.5rem;
          border-top: 1px solid #1e1e1e;
          scroll-margin-top: 90px;
        }
        .ebook-body h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #d4c4a8;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .ebook-body p {
          margin-bottom: 1.4em;
          text-align: justify;
          hyphens: auto;
        }
        .ebook-body hr {
          border: none;
          border-top: 1px solid #2a2a2a;
          margin: 2.5rem auto;
          width: 40%;
        }
        .ebook-body strong { color: #e8dcc8; font-weight: 700; }
        .ebook-body em { color: #b8b4a4; font-style: italic; }
        .ebook-body ul, .ebook-body ol {
          margin: 1.2em 0 1.2em 1.5em;
        }
        .ebook-body li { margin-bottom: 0.5em; color: #b8b4a4; }
        .ebook-body blockquote {
          border-left: 3px solid #b4823c;
          margin: 1.8em 0;
          padding: 0.8em 1.2em;
          background: rgba(180,130,60,0.06);
          border-radius: 0 6px 6px 0;
          color: #c0b898;
          font-style: italic;
        }
        .ebook-body blockquote p { margin-bottom: 0; }
        .ebook-body a { color: #d4a855; text-decoration: none; }
        .ebook-body a:hover { text-decoration: underline; }
        .ebook-body a[id] { display: block; scroll-margin-top: 90px; }
        .ebook-body table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 0.9rem; }
        .ebook-body th { background: #1a1a1a; color: #d4a855; padding: 0.6em 0.8em; text-align: left; font-weight: 600; border-bottom: 1px solid #2a2a2a; }
        .ebook-body td { padding: 0.6em 0.8em; border-bottom: 1px solid #1a1a1a; color: #b0aca0; }
        .ebook-body code { font-family: monospace; font-size: 0.875em; background: #1a1a1a; padding: 0.15em 0.4em; border-radius: 3px; color: #d4a855; }

        @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease forwards; }
      `}</style>
    </>
  );
}
