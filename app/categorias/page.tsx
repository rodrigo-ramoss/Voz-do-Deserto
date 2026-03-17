import Link from "next/link";
import { getAllStudies } from "@/lib/studies";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });
}

export default function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const studies = getAllStudies();

  // Gather unique categories from real content
  const allCategories = Array.from(
    new Set(studies.map((s) => s.category).filter(Boolean))
  ).sort();

  // This is a server component — searchParams is a Promise in Next 15
  // We resolve it synchronously by using a client trick: read via URL below.
  // For now we list all studies grouped by category.

  const grouped = allCategories.reduce<Record<string, typeof studies>>(
    (acc, cat) => {
      acc[cat] = studies.filter((s) => s.category === cat);
      return acc;
    },
    {}
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      {/* Header */}
      <p className="font-label text-[11px] uppercase tracking-[0.25em] text-gold mb-6">
        Índice
      </p>
      <h1 className="font-display text-4xl text-text mb-4 md:text-5xl">
        Categorias
      </h1>
      <div className="h-px w-16 bg-gold/30 mb-4" />
      <p className="font-body text-lg text-text/55 max-w-xl leading-relaxed mb-16">
        Navegue pelos estudos por tema, período ou tradição hermenêutica.
      </p>

      {/* Category list */}
      {allCategories.length === 0 ? (
        <p className="font-body text-text/40 text-sm">
          Nenhum estudo publicado ainda.
        </p>
      ) : (
        <div className="space-y-16">
          {allCategories.map((cat) => (
            <div key={cat}>
              {/* Category heading */}
              <div className="mb-8 flex items-center gap-4">
                <span className="font-label text-[11px] uppercase tracking-[0.25em] text-gold">
                  {cat}
                </span>
                <div className="h-px flex-1 bg-gold/15" />
                <span className="font-label text-[10px] text-muted">
                  {grouped[cat].length}{" "}
                  {grouped[cat].length === 1 ? "estudo" : "estudos"}
                </span>
              </div>

              {/* Articles in this category */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {grouped[cat].map((study) => (
                  <article
                    key={study.slug}
                    className="group flex flex-col border border-gold/10 bg-card p-6 transition-colors duration-300 hover:border-gold/25"
                  >
                    <h3 className="font-display text-lg leading-snug text-text mb-3 transition-colors duration-200 group-hover:text-gold">
                      {study.title}
                    </h3>

                    {study.excerpt && (
                      <p className="font-body text-sm leading-relaxed text-text/50 flex-1 mb-6">
                        {study.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-auto">
                      <Link
                        href={`/estudos/${study.slug}`}
                        className="font-label text-[10px] uppercase tracking-widest text-gold/55 transition-colors hover:text-gold"
                      >
                        Ler →
                      </Link>
                      <span className="font-label text-[10px] text-muted">
                        {formatDate(study.date)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
