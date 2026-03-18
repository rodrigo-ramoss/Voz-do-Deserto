"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

/*
 * LEGIBILIDADE (T2) — Submenu de categorias
 * ─────────────────────────────────────────────────────────────────────────
 * text-xs font-medium (12px) — era text-[10px] (10px), ilegível
 * text-muted = #B8A98A (contraste 8.6:1) — era text-muted (#5C4F35 = 1.9:1 ✗)
 * min-h-[44px] + flex items-center — área de toque WCAG 2.5.5 AA ✓
 * hover:text-text (sem opacity) — substitui hover:text-text/60
 * ─────────────────────────────────────────────────────────────────────────
 */

function Bar({ categories }: { categories: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeCat = searchParams.get("cat") ?? "";
  const onEstudos = pathname === "/estudos";

  const linkBase =
    "font-label text-xs font-medium uppercase tracking-[0.18em] px-4 min-h-[44px] flex items-center border-b-2 transition-colors duration-200 whitespace-nowrap";

  return (
    <div className="border-b border-gold/10 bg-bg/98 backdrop-blur-sm overflow-x-auto scrollbar-none">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-stretch min-w-max">
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
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/estudos?cat=${encodeURIComponent(cat)}`}
              className={`${linkBase} ${
                activeCat === cat
                  ? "border-gold text-gold"
                  : "border-transparent text-muted hover:text-text"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function BarFallback() {
  /* min-h-[44px] para evitar layout shift durante o Suspense */
  return <div className="border-b border-gold/10 bg-bg/98 min-h-[44px]" />;
}

export default function CategoryBar({ categories }: { categories: string[] }) {
  return (
    <Suspense fallback={<BarFallback />}>
      <Bar categories={categories} />
    </Suspense>
  );
}
