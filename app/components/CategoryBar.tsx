"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

function Bar({ categories }: { categories: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeCat = searchParams.get("cat") ?? "";
  const onEstudos = pathname === "/estudos";

  return (
    <div className="border-b border-gold/10 bg-bg/98 backdrop-blur-sm overflow-x-auto scrollbar-none">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-stretch min-w-max">
          <Link
            href="/estudos"
            className={`font-label text-[10px] uppercase tracking-[0.2em] px-5 py-3 border-b-2 transition-colors duration-200 whitespace-nowrap ${
              onEstudos && !activeCat
                ? "border-gold text-gold"
                : "border-transparent text-muted hover:text-text/60"
            }`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/estudos?cat=${encodeURIComponent(cat)}`}
              className={`font-label text-[10px] uppercase tracking-[0.2em] px-5 py-3 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                activeCat === cat
                  ? "border-gold text-gold"
                  : "border-transparent text-muted hover:text-text/60"
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
  return <div className="border-b border-gold/10 bg-bg/98 h-[42px]" />;
}

export default function CategoryBar({ categories }: { categories: string[] }) {
  return (
    <Suspense fallback={<BarFallback />}>
      <Bar categories={categories} />
    </Suspense>
  );
}
