"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

const FEATURED_CATS = new Set(["Escatologia Digital", "IA & Controle"]);
const FEATURED_SUBLABEL = "artigo, premium, grátis";
const CAT_DISPLAY_NAMES: Record<string, string> = {
  "IA & Controle": "IA e Controle",
};

function Bar({ categories }: { categories: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeCat = searchParams.get("cat") ?? "";
  const onEstudos = pathname === "/estudos";

  const linkBase =
    "font-label text-[10px] md:text-xs font-medium uppercase tracking-[0.18em] px-3 md:px-4 min-h-[36px] md:min-h-[44px] flex items-center border-b-2 transition-colors duration-200 whitespace-nowrap shrink-0";

  const renderCat = (cat: string, dup = false) => {
    const isActive = activeCat === cat;
    const key = dup ? `${cat}__dup` : cat;
    const label = CAT_DISPLAY_NAMES[cat] ?? cat;

    if (FEATURED_CATS.has(cat)) {
      return (
        <Link
          key={key}
          href={`/estudos?cat=${encodeURIComponent(cat)}`}
          aria-hidden={dup || undefined}
          tabIndex={dup ? -1 : undefined}
          className={`font-label text-[9px] md:text-[10px] font-medium uppercase tracking-[0.16em] px-2.5 md:px-3 flex flex-col items-center justify-center border transition-colors duration-200 whitespace-nowrap shrink-0 my-1 md:my-1.5 ${
            isActive
              ? "border-gold text-gold"
              : "border-gold/50 text-muted hover:border-gold hover:text-text"
          }`}
        >
          <span className="leading-tight">{label}</span>
          <span className="font-label text-[7px] uppercase tracking-[0.14em] text-gold/60 leading-tight mt-0.5">
            {FEATURED_SUBLABEL}
          </span>
        </Link>
      );
    }

    return (
      <Link
        key={key}
        href={`/estudos?cat=${encodeURIComponent(cat)}`}
        aria-hidden={dup || undefined}
        tabIndex={dup ? -1 : undefined}
        className={`${linkBase} ${
          isActive
            ? "border-gold text-gold"
            : "border-transparent text-muted hover:text-text"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="border-b border-gold/10 bg-bg/98 backdrop-blur-sm overflow-hidden">

      {/* ── Linha 1: fixos (mobile: row completa | desktop: inline com marquee) ── */}
      <div className="flex md:hidden items-stretch border-b border-gold/8">
        {/* Todos — ocupa metade */}
        <Link
          href="/estudos"
          className={`flex-1 font-label text-[10px] font-medium uppercase tracking-[0.18em] min-h-[38px] flex items-center justify-center border-b-2 border-r border-r-gold/10 transition-colors duration-200 ${
            onEstudos && !activeCat
              ? "border-b-gold text-gold"
              : "border-b-transparent text-muted"
          }`}
        >
          Todos
        </Link>

        {/* Notícias — ocupa metade */}
        <Link
          href="/noticias"
          className={`flex-1 font-label text-[10px] font-medium uppercase tracking-[0.18em] min-h-[38px] flex items-center justify-center gap-1.5 border-b-2 transition-colors duration-200 ${
            pathname === "/noticias" || pathname.startsWith("/noticias/")
              ? "border-b-ember text-ember"
              : "border-b-transparent text-muted"
          }`}
        >
          <span className="animate-blink w-1 h-1 rounded-full bg-ember/60 shrink-0" />
          Notícias
        </Link>
      </div>

      {/* ── Marquee mobile (linha 2) + desktop (linha única com fixos) ── */}
      <div className="flex items-stretch">

        {/* Fixos visíveis só no desktop */}
        <div className="hidden md:flex items-stretch shrink-0 border-r border-gold/10">
          <Link
            href="/estudos"
            className={`${linkBase} ${
              onEstudos && !activeCat
                ? "border-gold text-gold"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            Todos
          </Link>
        </div>
        <div className="hidden md:flex items-stretch shrink-0 border-r border-gold/10">
          <Link
            href="/noticias"
            className={`${linkBase} gap-1.5 ${
              pathname === "/noticias" || pathname.startsWith("/noticias/")
                ? "border-ember text-ember"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            <span className="animate-blink w-1 h-1 rounded-full bg-ember/60 shrink-0" />
            Notícias
          </Link>
        </div>

        {/* Marquee — mais baixo no mobile */}
        <div className="flex-1 overflow-hidden relative min-h-[36px] md:min-h-[44px]">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-bg/98 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-bg/98 to-transparent z-10" />

          <div className="flex items-center h-full animate-marquee">
            {categories.map((cat) => renderCat(cat))}
            {categories.map((cat) => renderCat(cat, true))}
          </div>
        </div>

      </div>
    </div>
  );
}

function BarFallback() {
  return <div className="border-b border-gold/10 bg-bg/98 min-h-[44px]" />;
}

export default function CategoryBar({ categories }: { categories: string[] }) {
  return (
    <Suspense fallback={<BarFallback />}>
      <Bar categories={categories} />
    </Suspense>
  );
}
