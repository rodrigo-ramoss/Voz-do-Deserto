"use client";

import { useState, useMemo } from "react";
import ArticleCard from "@/app/components/ArticleCard";
import Pagination from "@/app/components/Pagination";
import type { StudyMeta } from "@/lib/studies";

const POSTS_PER_PAGE = 9;

interface EstudosClientProps {
  studies: StudyMeta[];
}

export default function EstudosClient({ studies }: EstudosClientProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Filtra por título, categoria e excerpt — case insensitive
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return studies;
    return studies.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.excerpt ?? "").toLowerCase().includes(q)
    );
  }, [studies, query]);

  // Reseta para página 1 quando a busca muda
  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <div>
      {/* Campo de busca */}
      <div className="mb-8 relative">
        <label htmlFor="busca-estudos" className="sr-only">
          Buscar estudos
        </label>
        <div className="relative">
          {/* Ícone de lupa */}
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/50 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="busca-estudos"
            type="search"
            placeholder="Buscar por título, categoria ou conteúdo…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-card border border-gold/15 pl-10 pr-4 py-3 font-body text-sm text-text/80 placeholder:text-muted/40 focus:outline-none focus:border-gold/40 transition-colors"
          />
        </div>
        {/* Contador de resultados quando há busca ativa */}
        {query && (
          <p className="mt-2 font-label text-[8px] uppercase tracking-widest text-muted/50">
            {filtered.length === 0
              ? "Nenhum resultado encontrado"
              : `${filtered.length} ${
                  filtered.length === 1 ? "resultado" : "resultados"
                }`}
          </p>
        )}
      </div>

      {/* Grid de artigos */}
      {paginated.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {paginated.map((study, i) => (
            <ArticleCard key={study.slug} study={study} index={i} />
          ))}
        </div>
      ) : (
        <div className="border border-gold/10 bg-card p-12 text-center">
          <p className="font-display text-2xl text-gold/20 mb-3">✦</p>
          <p className="font-body text-text/35 text-sm">
            {query
              ? "Nenhum estudo encontrado para essa busca."
              : "Nenhum estudo nesta categoria ainda."}
          </p>
          {query && (
            <button
              onClick={() => handleSearch("")}
              className="mt-4 font-label text-[9px] uppercase tracking-widest text-gold/40 hover:text-gold transition-colors"
            >
              Limpar busca
            </button>
          )}
        </div>
      )}

      {/* Paginação */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
