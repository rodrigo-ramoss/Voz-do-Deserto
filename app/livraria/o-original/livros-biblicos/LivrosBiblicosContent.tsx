"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { OOriginalMeta } from "@/lib/o-original";

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const NEW_TESTAMENT_BOOKS = new Set(
  [
    "mateus",
    "marcos",
    "lucas",
    "joao",
    "atos",
    "romanos",
    "1 corintios",
    "2 corintios",
    "galatas",
    "efesios",
    "filipenses",
    "colossenses",
    "1 tessalonicenses",
    "2 tessalonicenses",
    "1 timoteo",
    "2 timoteo",
    "tito",
    "filemom",
    "hebreus",
    "tiago",
    "1 pedro",
    "2 pedro",
    "1 joao",
    "2 joao",
    "3 joao",
    "judas",
    "apocalipse",
  ].map(normalizeName)
);

function getTestament(book?: string) {
  if (!book) return "Outros";
  return NEW_TESTAMENT_BOOKS.has(normalizeName(book)) ? "Novo Testamento" : "Antigo Testamento";
}

function getPartNumber(article: OOriginalMeta): number | null {
  const slugMatch = article.slug.match(/parte(\d+)/i);
  if (slugMatch?.[1]) return Number.parseInt(slugMatch[1], 10);

  const titleMatch = article.title.match(/parte\s+(\d+)/i);
  if (titleMatch?.[1]) return Number.parseInt(titleMatch[1], 10);

  return null;
}

function shortPartTitle(title: string) {
  const afterColon = title.split(":").slice(1).join(":").trim();
  if (afterColon) return afterColon;

  const afterDash = title.split("—").slice(1).join("—").trim();
  return afterDash || title;
}

function BookRow({
  book,
  articles,
  onOpen,
}: {
  book: string;
  articles: OOriginalMeta[];
  onOpen: () => void;
}) {
  const img = articles.find((a) => a.image)?.image;
  const firstVerse = articles.find((a) => a.verse)?.verse;
  return (
    <button
      onClick={onOpen}
      className="group w-full text-left border border-gold/10 bg-card/50
                 hover:border-gold/35 hover:bg-gold/[0.02]
                 transition-all duration-300 flex items-center gap-0 overflow-hidden
                 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b
                      from-gold/0 via-gold/0 to-gold/0
                      group-hover:from-gold/50 group-hover:via-gold/25 group-hover:to-transparent
                      transition-all duration-300" />

      <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 overflow-hidden bg-gold/5 relative">
        {img ? (
          <Image
            src={img}
            alt={book}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-2xl text-gold/10 select-none">◎</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0b08]/60" />
      </div>

      <div className="flex-1 min-w-0 px-5 py-4">
        <p className="font-label text-[8px] uppercase tracking-[0.3em] text-gold/45 mb-1">
          {articles.length} {articles.length === 1 ? "parte" : "partes"}
          {firstVerse ? ` · ${firstVerse}` : ""}
        </p>
        <h3 className="font-display text-base md:text-lg leading-snug mb-1.5 text-text group-hover:text-gold transition-colors duration-200">
          {book}
        </h3>
        {(articles[0]?.description || articles[0]?.excerpt) && (
          <p className="font-body text-xs text-text/35 leading-relaxed line-clamp-2">
            {(articles[0].description ?? articles[0].excerpt ?? "").slice(0, 140)}…
          </p>
        )}
      </div>

      <div className="shrink-0 pr-5 flex flex-col items-center gap-1.5">
        <div className="w-8 h-8 border border-gold/20 flex items-center justify-center
                        group-hover:border-gold/50 group-hover:bg-gold/8 transition-all duration-200">
          <svg
            className="w-3.5 h-3.5 text-gold/40 group-hover:text-gold transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        <span className="font-label text-[7px] uppercase tracking-widest text-gold/30 group-hover:text-gold/60 transition-colors hidden md:block">
          Ver
        </span>
      </div>
    </button>
  );
}

function BookModal({
  book,
  testament,
  articles,
  onClose,
}: {
  book: string;
  testament: string;
  articles: OOriginalMeta[];
  onClose: () => void;
}) {
  const router = useRouter();
  const img = articles.find((a) => a.image)?.image;

  const sorted = useMemo(() => {
    return [...articles].sort((a, b) => {
      const pa = getPartNumber(a);
      const pb = getPartNumber(b);
      if (pa !== null && pb !== null) return pa - pb;
      if (pa !== null) return -1;
      if (pb !== null) return 1;
      return a.slug.localeCompare(b.slug);
    });
  }, [articles]);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-bg/90 backdrop-blur-sm" aria-hidden />

      <div
        className="relative z-10 w-full md:max-w-lg bg-[#0d0b08] border border-gold/20
                   shadow-[0_0_60px_rgba(0,0,0,0.8)]
                   rounded-none md:rounded-sm
                   max-h-[92vh] md:max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent shrink-0" />

        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-4">
            {img && (
              <div className="w-12 h-12 shrink-0 overflow-hidden border border-gold/15">
                <Image src={img} alt={book} width={48} height={48} className="object-cover w-full h-full" />
              </div>
            )}
            <div>
              <p className="font-label text-[8px] uppercase tracking-[0.4em] text-gold/50 mb-1">
                {testament} · {sorted.length} {sorted.length === 1 ? "parte" : "partes"}
              </p>
              <h2 className="font-display text-xl text-text leading-tight">{book}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 w-8 h-8 border border-gold/15 flex items-center justify-center
                       text-muted hover:text-gold hover:border-gold/40 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-px mx-6 bg-gold/10 shrink-0" />

        {sorted[0]?.excerpt && (
          <p className="font-body text-sm text-text/40 leading-relaxed px-6 pt-4 pb-2 shrink-0">
            {sorted[0].excerpt.slice(0, 160)}…
          </p>
        )}

        <ul className="flex flex-col overflow-y-auto px-6 pb-6 pt-2 gap-3">
          {sorted.map((article, index) => {
            const part = getPartNumber(article) ?? index + 1;
            return (
              <li key={article.slug}>
                <button
                  onClick={() => router.push(`/livraria/o-original/${article.slug}`)}
                  className="group w-full text-left border border-gold/10 bg-card/40
                             hover:border-gold/35 hover:bg-gold/[0.03]
                             transition-all duration-200 p-4 flex items-start gap-4"
                >
                  <div className="w-7 h-7 border border-gold/20 bg-gold/5 flex items-center justify-center shrink-0 mt-0.5
                                  group-hover:border-gold/50 group-hover:bg-gold/10 transition-all duration-200">
                    <span className="font-label text-[9px] text-gold/60 group-hover:text-gold transition-colors">
                      {String(part).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-label text-[8px] uppercase tracking-widest text-gold/40 mb-1">
                      Parte {part}
                      {article.verse ? ` · ${article.verse}` : ""}
                    </p>
                    <h3 className="font-display text-sm leading-snug text-text group-hover:text-gold transition-colors line-clamp-2">
                      {shortPartTitle(article.title)}
                    </h3>
                    {(article.description || article.excerpt) ? (
                      <p className="font-body text-xs text-text/35 leading-relaxed mt-2 line-clamp-2">
                        {(article.description ?? article.excerpt ?? "").slice(0, 160)}…
                      </p>
                    ) : null}
                  </div>

                  <svg
                    className="w-3.5 h-3.5 text-gold/30 group-hover:text-gold shrink-0 mt-1
                               transition-all duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-gold/10 px-6 py-4 shrink-0 flex items-center justify-between">
          <span className="font-label text-[8px] uppercase tracking-widest text-gold/25">
            O Original · Voz do Deserto
          </span>
          <button
            onClick={onClose}
            className="font-label text-[8px] uppercase tracking-widest text-gold/40 hover:text-gold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LivrosBiblicosContent({ articles }: { articles: OOriginalMeta[] }) {
  const [activeBook, setActiveBook] = useState<string | null>(null);
  const byBook = useMemo(() => {
    const grouped = articles.reduce<Record<string, OOriginalMeta[]>>((acc, a) => {
      const book = a.book ?? "Outros";
      if (!acc[book]) acc[book] = [];
      acc[book].push(a);
      return acc;
    }, {});

    for (const book in grouped) {
      grouped[book].sort((a, b) => {
        const pa = getPartNumber(a);
        const pb = getPartNumber(b);
        if (pa !== null && pb !== null) return pa - pb;
        if (pa !== null) return -1;
        if (pb !== null) return 1;
        return a.slug.localeCompare(b.slug);
      });
    }

    return grouped;
  }, [articles]);

  const byTestament = useMemo(() => {
    const entries = Object.entries(byBook);
    const result: Record<string, { book: string; articles: OOriginalMeta[] }[]> = {
      "Novo Testamento": [],
      "Antigo Testamento": [],
      Outros: [],
    };

    for (const [book, list] of entries) {
      const testament = getTestament(book);
      if (!result[testament]) result[testament] = [];
      result[testament].push({ book, articles: list });
    }

    for (const testament of Object.keys(result)) {
      result[testament].sort((a, b) => a.book.localeCompare(b.book));
    }

    return result;
  }, [byBook]);

  const activeArticles = activeBook ? byBook[activeBook] : [];
  const activeTestament = activeBook ? getTestament(activeBook) : "";

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 relative">
      {activeBook && (
        <BookModal
          book={activeBook}
          testament={activeTestament}
          articles={activeArticles}
          onClose={() => setActiveBook(null)}
        />
      )}

      <nav className="flex items-center gap-2 mb-12" aria-label="Navegação">
        <Link href="/livraria" className="font-label text-[9px] uppercase tracking-widest text-gold/40 hover:text-gold transition-colors">
          Arquivo Secreto
        </Link>
        <span className="text-gold/20 text-[10px]" aria-hidden>›</span>
        <Link href="/livraria/o-original" className="font-label text-[9px] uppercase tracking-widest text-gold/40 hover:text-gold transition-colors">
          O Original
        </Link>
        <span className="text-gold/20 text-[10px]" aria-hidden>›</span>
        <span className="font-label text-[9px] uppercase tracking-widest text-gold/70">Livros Bíblicos</span>
      </nav>

      <p className="font-label text-[10px] uppercase tracking-[0.4em] text-gold/60 mb-4">
        Interpretação · Livro por Livro
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-text mb-4">Livros Bíblicos</h1>
      <div className="h-px w-16 bg-gold/30 mb-5" />
      <p className="font-body text-base text-text/50 leading-relaxed max-w-xl mb-3">
        Cada livro interpretado no idioma original, no contexto histórico em que foi escrito — sem filtro de denominação,
        sem leitura retroativa.
      </p>
      <p className="font-label text-[9px] uppercase tracking-widest text-gold/40 mb-14">
        ↻ Atualizado semanalmente · Clique em um livro para ver as partes
      </p>

      {articles.length === 0 ? (
        <div className="border border-gold/10 bg-card/40 px-8 py-14 text-center">
          <p className="font-body text-sm text-text/35 italic">
            Os primeiros estudos estão sendo preparados. Cadastre-se na newsletter para ser avisado.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {(["Novo Testamento", "Antigo Testamento"] as const).map((testament) => {
            const books = byTestament[testament];
            if (!books?.length) return null;
            return (
              <section key={testament} aria-labelledby={`testament-${testament}`}>
                <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gold/10">
                  <h2 id={`testament-${testament}`} className="font-display text-xl text-text">
                    {testament}
                  </h2>
                  <div className="h-px flex-1 bg-gold/10" />
                  <span className="font-label text-[8px] uppercase tracking-[0.25em] text-gold/50">
                    {books.length} {books.length === 1 ? "livro" : "livros"}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {books.map(({ book, articles: list }) => (
                    <BookRow key={book} book={book} articles={list} onOpen={() => setActiveBook(book)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-14 pt-8 border-t border-gold/8">
        <Link
          href="/livraria/o-original"
          className="font-label text-[9px] uppercase tracking-widest text-gold/35 hover:text-gold transition-colors"
        >
          ← Voltar a O Original
        </Link>
      </div>
    </main>
  );
}

