"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface ReadingProgress {
  slug: string;
  percent: number;
  scrollY: number;
  date: string; // ISO
  title: string;
}

const KEY_PREFIX = "vzd_reading_";

export function getProgress(slug: string): ReadingProgress | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + slug);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProgress(p: ReadingProgress) {
  try {
    localStorage.setItem(KEY_PREFIX + p.slug, JSON.stringify(p));
  } catch {}
}

/* ── Badge individual por livro ───────────────────────────────── */
export function EbookProgressBadge({ slug }: { slug: string }) {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress(slug));
  }, [slug]);

  if (!progress || progress.percent < 2) return null;

  return (
    <div className="mt-2 flex items-center gap-1.5 rounded-full bg-[#1a1a0e] border border-[#d4a855]/20 px-2.5 py-1 text-[10px] text-[#d4a855]/80">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm.5 14.5h-1v-6h1v6zm0-8h-1V7h1v1.5z" />
      </svg>
      {progress.percent}% lido
    </div>
  );
}

/* ── Banner "continuar leitura" no topo da livraria ──────────── */
export function ContinueReadingBanner() {
  const [last, setLast] = useState<ReadingProgress | null>(null);

  useEffect(() => {
    // Pega o ebook lido mais recentemente
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(KEY_PREFIX)
    );
    let mostRecent: ReadingProgress | null = null;
    for (const key of keys) {
      try {
        const p: ReadingProgress = JSON.parse(localStorage.getItem(key)!);
        if (!mostRecent || p.date > mostRecent.date) mostRecent = p;
      } catch {}
    }
    if (mostRecent && mostRecent.percent > 1 && mostRecent.percent < 98) {
      setLast(mostRecent);
    }
  }, []);

  if (!last) return null;

  return (
    <Link
      href={`/livraria/ebooks/${last.slug}#vzd-resume`}
      className="group mx-auto mb-8 flex max-w-5xl items-center gap-4 rounded-xl border border-[#d4a855]/20 bg-[#141408] px-5 py-3.5 transition-colors hover:border-[#d4a855]/40"
    >
      {/* Ícone */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d4a855]/10 text-[#d4a855]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#5a5a4e] mb-0.5">Continuar leitura</p>
        <p className="text-sm font-semibold text-[#c8c4b8] truncate group-hover:text-[#d4a855] transition-colors">
          {last.title}
        </p>
      </div>

      {/* Progresso */}
      <div className="shrink-0 text-right">
        <p className="text-xs font-bold text-[#d4a855]">{last.percent}%</p>
        <div className="mt-1 h-1 w-20 rounded-full bg-[#2a2a1a] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#d4a855]/60"
            style={{ width: `${last.percent}%` }}
          />
        </div>
      </div>

      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="shrink-0 text-[#5a5a4e] group-hover:text-[#d4a855] transition-colors"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
