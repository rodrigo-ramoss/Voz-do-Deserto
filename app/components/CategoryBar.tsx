"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

const PREMIUM_CAT = "Escatologia Digital";

function Bar({ categories }: { categories: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeCat = searchParams.get("cat") ?? "";
  const onEstudos = pathname === "/estudos";

  const linkBase =
    "font-label text-xs font-medium uppercase tracking-[0.18em] px-4 min-h-[44px] flex items-center border-b-2 transition-colors duration-200 whitespace-nowrap shrink-0";

  const renderCat = (cat: string, dup = false) => {
    const isActive = activeCat === cat;
    const key = dup ? `${cat}__dup` : cat;

    if (cat === PREMIUM_CAT) {
      return (
        <Link
          key={key}
          href={`/estudos?cat=${encodeURIComponent(cat)}`}
          aria-hidden={dup || undefined}
          tabIndex={dup ? -1 : undefined}
          className={`font-label text-[10px] font-medium uppercase tracking-[0.16em] px-3 flex flex-col items-center justify-center border transition-colors duration-200 whitespace-nowrap shrink-0 my-1.5 ${
            isActive
              ? "border-gold text-gold"
              : "border-gold/50 text-muted hover:border-gold hover:text-text"
          }`}
        >
          <span className="leading-tight">{cat}</span>
          <span className="font-label text-[7px] uppercase tracking-[0.14em] text-gold/60 leading-tight mt-0.5">
            artigo premium grátis
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
        {cat}
      </Link>
    );
  };

  return (
    <div className="border-b border-gold/10 bg-bg/98 backdrop-blur-sm flex items-stretch overflow-hidden">

      {/* "Todos" fixo à esquerda */}
      <div className="flex items-stretch shrink-0 border-r border-gold/10">
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

      {/* Marquee das categorias */}
      <div className="flex-1 overflow-hidden relative">
        {/* Fade nas bordas */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-bg/98 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-bg/98 to-transparent z-10" />

        <div className="flex items-stretch animate-marquee">
          {categories.map((cat) => renderCat(cat))}
          {categories.map((cat) => renderCat(cat, true))}
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
