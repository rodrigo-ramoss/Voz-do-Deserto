import Link from "next/link";
import Image from "next/image";
import { getAllStudies } from "@/lib/studies";

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Sidebar({ excludeSlug }: { excludeSlug?: string }) {
  const studies = getAllStudies();
  const recent = studies.filter((s) => s.slug !== excludeSlug).slice(0, 5);

  // Conta artigos por categoria
  const categoryMap = studies.reduce<Record<string, number>>((acc, s) => {
    if (s.category) acc[s.category] = (acc[s.category] ?? 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(categoryMap).sort((a, b) =>
    a[0].localeCompare(b[0], "pt-BR")
  );

  return (
    // lg:sticky top-24 mantém sidebar visível durante o scroll em desktop
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">

      {/* Sobre o projeto */}
      <div className="border border-gold/10 bg-card p-6">
        <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-4">
          Sobre o projeto
        </p>
        <p className="font-body text-sm leading-relaxed text-text/50 mb-5">
          Estudos bíblicos profundos sem filtro institucional — apócrifos,
          exegese do original grego e hebraico, história da Igreja. Para quem
          quer profundidade, não motivacional barato.
        </p>
        <Link
          href="/sobre"
          className="font-label text-[9px] uppercase tracking-widest text-gold/50 border-b border-gold/20 pb-0.5 hover:text-gold hover:border-gold/40 transition-colors"
        >
          Saiba mais →
        </Link>
      </div>

      {/* Separador dourado */}
      <div className="h-px w-full bg-gold/8" />

      {/* Categorias com contagem */}
      {categories.length > 0 && (
        <div className="border border-gold/10 bg-card p-6">
          <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-4">
            Categorias
          </p>
          <div className="flex flex-col">
            {categories.map(([cat, count]) => (
              <Link
                key={cat}
                href={`/estudos?cat=${encodeURIComponent(cat)}`}
                className="flex items-center justify-between py-2.5 border-b border-gold/8 last:border-0 group"
              >
                <span className="font-label text-[9px] uppercase tracking-[0.15em] text-muted group-hover:text-gold transition-colors">
                  {cat}
                </span>
                <span className="font-label text-[8px] text-muted/40 bg-gold/5 px-1.5 py-0.5">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Separador dourado */}
      <div className="h-px w-full bg-gold/8" />

      {/* Posts recentes com thumbnail */}
      {recent.length > 0 && (
        <div className="border border-gold/10 bg-card p-6">
          <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-4">
            Estudos recentes
          </p>
          <div className="flex flex-col gap-4">
            {recent.map((study) => (
              <Link
                key={study.slug}
                href={`/estudos/${study.slug}`}
                className="group flex items-start gap-3"
              >
                {/* Thumbnail pequena */}
                <div className="relative w-14 h-10 shrink-0 overflow-hidden bg-card border border-gold/10">
                  {study.image ? (
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/[0.08] to-transparent">
                      <span className="text-[10px] text-gold/20">✦</span>
                    </div>
                  )}
                </div>

                {/* Título e meta */}
                <div className="flex-1 min-w-0">
                  <span className="font-label text-[7px] uppercase tracking-[0.2em] text-ember/60 block mb-0.5">
                    {study.category}
                  </span>
                  <span className="font-display text-[0.78rem] leading-snug text-text/65 group-hover:text-gold transition-colors block line-clamp-2">
                    {study.title}
                  </span>
                  <span className="font-label text-[7px] text-muted/50 block mt-0.5">
                    {formatDate(study.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tagline */}
      <div className="border border-gold/8 p-5 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="h-px w-8 bg-gold/15" />
          <span className="text-[10px] text-gold/20">✦</span>
          <div className="h-px w-8 bg-gold/15" />
        </div>
        <p className="font-display text-sm text-gold/25 leading-relaxed italic animate-fade-in">
          "O que o templo nunca te disse."
        </p>
      </div>
    </aside>
  );
}
