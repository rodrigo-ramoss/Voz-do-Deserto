import Link from "next/link";
import Image from "next/image";
import type { StudyMeta } from "@/lib/studies";

// Gradient fallback por categoria — paleta da marca
const categoryAccent: Record<string, string> = {
  "Apócrifos": "from-gold/[0.12] to-ember/[0.04]",
  "Exegese": "from-gold/[0.09] to-transparent",
  "História da Igreja": "from-ember/[0.08] to-gold/[0.04]",
  "História do Cânon": "from-ember/[0.08] to-gold/[0.04]",
  "Textos Antigos": "from-gold/[0.07] to-ember/[0.06]",
  "Teologia Bíblica": "from-gold/[0.10] to-transparent",
  "Hermenêutica": "from-ember/[0.06] to-gold/[0.08]",
  "Escatologia": "from-ember/[0.09] to-transparent",
  "Profecia": "from-gold/[0.08] to-ember/[0.05]",
  "Patrística": "from-gold/[0.06] to-ember/[0.07]",
  "Desigrejados": "from-ember/[0.10] to-gold/[0.05]",
  "Jesus Histórico": "from-gold/[0.08] to-ember/[0.06]",
  "Fé no Deserto": "from-gold/[0.11] to-transparent",
};

// Formata data completa em português: "12 de março de 2026"
function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ArticleVisual({
  category,
  image,
  title,
}: {
  category: string;
  image?: string;
  title: string;
}) {
  const gradient = categoryAccent[category] ?? "from-gold/[0.07] to-transparent";

  if (image) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden bg-card">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-card">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-[6rem] leading-none text-gold/[0.055] select-none pointer-events-none">
          ✦
        </span>
      </div>
      <div className="absolute inset-0 flex items-end p-4">
        <span className="font-label text-[9px] uppercase tracking-[0.35em] text-gold/20">
          {category}
        </span>
      </div>
    </div>
  );
}

export default function ArticleCard({
  study,
  index = 0,
}: {
  study: StudyMeta;
  index?: number;
}) {
  const delay = Math.min(index, 8) * 80; // escalonamento até 640ms

  return (
    <article
      className="group flex flex-col border border-gold/10 bg-card transition-colors duration-300 hover:border-gold/25 animate-fade-in-up"
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {/* Imagem / visual */}
      <Link href={`/estudos/${study.slug}`} tabIndex={-1} aria-hidden>
        <ArticleVisual
          category={study.category}
          image={study.image}
          title={study.title}
        />
      </Link>

      <div className="flex flex-col flex-1 p-5">
        {/* Pílula de categoria */}
        <Link
          href={`/estudos?cat=${encodeURIComponent(study.category)}`}
          className="inline-flex mb-3 self-start"
        >
          <span className="font-label text-[8px] uppercase tracking-[0.25em] text-ember/80 bg-ember/[0.08] border border-ember/15 px-2 py-0.5 hover:bg-ember/[0.14] hover:text-ember transition-colors">
            {study.category}
          </span>
        </Link>

        {/* Título */}
        <Link href={`/estudos/${study.slug}`}>
          <h3 className="font-display text-[1.1rem] leading-snug text-text mb-3 group-hover:text-gold transition-colors duration-200">
            {study.title}
          </h3>
        </Link>

        {/* Excerpt truncado em 2 linhas */}
        {study.excerpt && (
          <p className="font-body text-sm leading-relaxed text-text/45 flex-1 mb-4 line-clamp-2">
            {study.excerpt}
          </p>
        )}

        {/* Rodapé do card */}
        <div className="flex items-center justify-between border-t border-gold/8 pt-4 mt-auto">
          <div className="flex flex-col gap-0.5">
            <span className="font-label text-[8px] text-muted">
              {formatDate(study.date)}
            </span>
            {study.readTime && (
              <span className="font-label text-[8px] text-muted/50">
                {study.readTime} de leitura
              </span>
            )}
          </div>
          <Link
            href={`/estudos/${study.slug}`}
            className="font-label text-[9px] uppercase tracking-widest text-gold/50 hover:text-gold transition-colors"
          >
            Ler →
          </Link>
        </div>
      </div>
    </article>
  );
}
