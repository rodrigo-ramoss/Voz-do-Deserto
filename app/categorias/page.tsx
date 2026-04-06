import Link from "next/link";
import { getAllStudies } from "@/lib/studies";
import StudiesCarousel from "@/app/components/StudiesCarousel";

const CAT_DISPLAY_NAMES: Record<string, string> = {
  "IA & Controle": "IA e Controle",
};

const CATEGORY_CTA: Record<string, string> = {
  "Escatologia Digital":
    "Escatologia Digital 1.0. Só uma prévia do que tem no Arquivo Secreto.",
  "IA & Controle": "IA e Controle 1.0. Só uma prévia do que tem no Arquivo Secreto.",
};

export default function CategoriasPage() {
  const studies = getAllStudies();

  // Categorias únicas preservando a ordem de aparição (mais recente primeiro)
  const seen = new Set<string>();
  const allCategories: string[] = [];
  for (const s of studies) {
    if (s.category && !seen.has(s.category)) {
      seen.add(s.category);
      allCategories.push(s.category);
    }
  }

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
        <div className="space-y-14">
          {allCategories.map((cat) => {
            const label = CAT_DISPLAY_NAMES[cat] ?? cat;
            const cta = CATEGORY_CTA[cat];
            return (
              <section key={cat} aria-labelledby={`cat-${cat}`}>
                {/* Cabeçalho da categoria */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gold/10">
                  <h2
                    id={`cat-${cat}`}
                    className="font-label text-[11px] uppercase tracking-[0.25em] text-gold"
                  >
                    {label}
                  </h2>
                  <div className="h-px flex-1 bg-gold/10" />
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-label text-[10px] text-muted">
                      {grouped[cat].length}{" "}
                      {grouped[cat].length === 1 ? "estudo" : "estudos"}
                    </span>
                    <Link
                      href={`/estudos?cat=${encodeURIComponent(cat)}`}
                      className="font-label text-[9px] uppercase tracking-widest text-gold/50 hover:text-gold transition-colors"
                    >
                      Ver todos →
                    </Link>
                  </div>
                </div>

                {cta ? (
                  <p className="font-body text-sm text-text/55 leading-relaxed mb-6 max-w-2xl">
                    {cta}
                  </p>
                ) : null}

                {/* Carrossel com os 5 mais recentes */}
                <StudiesCarousel
                  articles={grouped[cat]}
                  linkBase="/estudos"
                  limit={5}
                />
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
