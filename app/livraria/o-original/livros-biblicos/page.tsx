import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getOOriginalBySpecificCategory } from "@/lib/o-original";
import type { OOriginalMeta } from "@/lib/o-original";

export const metadata: Metadata = {
  title: "Livros Bíblicos — O Original · Voz do Deserto",
  description:
    "Interpretação livro por livro — no idioma original, no contexto histórico, sem filtro de denominação.",
};

function ArticleCard({ article }: { article: OOriginalMeta }) {
  return (
    <Link
      href={`/livraria/o-original/${article.slug}`}
      className="group relative flex flex-col border border-gold/10 bg-card/60 overflow-hidden
                 transition-all duration-300 hover:border-gold/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/15 to-transparent
                      group-hover:via-gold/55 transition-all duration-500" />
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold/15 via-gold/8 to-transparent
                      group-hover:from-gold/50 group-hover:via-gold/25 transition-all duration-300" />

      {/* Capa */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gold/5 shrink-0">
        {article.image ? (
          <Image src={article.image} alt={article.title} fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-5xl text-gold/10 select-none">✦</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080705]/80 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {article.language && <span className="font-label text-[8px] uppercase tracking-widest text-gold/50">{article.language}</span>}
          {article.verse && (
            <><span className="text-gold/20 text-[9px]">·</span>
            <span className="font-label text-[8px] uppercase tracking-widest text-muted/50">{article.verse}</span></>
          )}
        </div>
        <h3 className="font-display text-base leading-snug flex-1 mb-3 text-text group-hover:text-gold transition-colors duration-200">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="font-body text-sm text-text/40 leading-relaxed line-clamp-2 mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gold/8 mt-auto">
          <span className="font-label text-[8px] uppercase tracking-widest text-muted/40">{article.date}</span>
          <span className="font-label text-[8px] uppercase tracking-widest text-gold/45 group-hover:text-gold transition-colors">Ler →</span>
        </div>
      </div>
    </Link>
  );
}

export default function LivrosBiblicosPage() {
  const articles = getOOriginalBySpecificCategory("Estudos de Livros Bíblicos");

  // Agrupa por livro
  const byBook = articles.reduce<Record<string, OOriginalMeta[]>>((acc, a) => {
    const b = a.book ?? "Outros";
    if (!acc[b]) acc[b] = [];
    acc[b].push(a);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">

      {/* Breadcrumb */}
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

      {/* Header */}
      <p className="font-label text-[10px] uppercase tracking-[0.4em] text-gold/60 mb-4">
        Interpretação · Livro por Livro
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-text mb-4">Livros Bíblicos</h1>
      <div className="h-px w-16 bg-gold/30 mb-5" />
      <p className="font-body text-base text-text/50 leading-relaxed max-w-xl mb-4">
        Cada livro interpretado no idioma original, no contexto histórico em que foi escrito —
        sem filtro de denominação, sem leitura retroativa.
      </p>
      <p className="font-label text-[9px] uppercase tracking-widest text-gold/40 mb-16">
        ↻ Atualizado semanalmente
      </p>

      {articles.length === 0 ? (
        <div className="border border-gold/10 bg-card/40 px-8 py-14 text-center">
          <p className="font-body text-sm text-text/35 italic">
            Os primeiros estudos estão sendo preparados. Cadastre-se na newsletter para ser avisado.
          </p>
        </div>
      ) : (
        <div className="space-y-14">
          {Object.entries(byBook).map(([book, bookArticles]) => (
            <section key={book} aria-labelledby={`book-${book}`}>
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gold/10">
                <h2 id={`book-${book}`} className="font-display text-xl text-text">{book}</h2>
                <span className="ml-auto font-label text-[8px] uppercase tracking-[0.25em] text-gold/50">
                  {bookArticles.length} {bookArticles.length === 1 ? "estudo" : "estudos"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {bookArticles.map((a) => <ArticleCard key={a.slug} article={a} />)}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-16 pt-10 border-t border-gold/8">
        <Link href="/livraria/o-original" className="font-label text-[9px] uppercase tracking-widest text-gold/35 hover:text-gold transition-colors">
          ← Voltar a O Original
        </Link>
      </div>
    </main>
  );
}
