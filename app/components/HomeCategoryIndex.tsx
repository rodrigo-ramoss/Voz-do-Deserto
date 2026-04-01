import Link from "next/link";
import type { StudyMeta } from "@/lib/studies";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Fé no Deserto": "Fé sem muros: reconstrução, comunidade e vida no deserto.",
  "Jesus Histórico": "Contexto, fontes e leitura histórica do Nazareno.",
  "História da Igreja": "Bastidores, concílios, manuscritos e rupturas.",
  Apócrifos: "Textos esquecidos e o que eles revelam sobre a fé primitiva.",
  Desigrejados: "O depois do templo: fé, trauma religioso e liberdade.",
  Sobrevivência: "Prática: autonomia, preparo e lucidez no caos.",
  "Fé e Tecnologia": "IA, vigilância e o impacto espiritual do mundo digital.",
  "Escatologia Digital": "Profecia, controle e a arquitetura da marca.",
  "Geopolítica Escatológica": "Guerras, poderes e sinais no tabuleiro global.",
  "Profecias e Tempo Presente": "Leitura do agora à luz do texto — sem hype.",
  "Economia & História": "Ciclos, impérios e o preço invisível do futuro.",
  "IA & Controle": "Governamentalidade, dados e a nova religião algorítmica.",
  "Bíblia & Interpretação": "Hermenêutica, contexto e o que o texto realmente diz.",
  "Sistema Religioso": "Estruturas, poder e o negócio do sagrado.",
  "Pilares da Fé": "Fundamentos: Cristo, obediência e vida prática.",
};

function getDescription(category: string) {
  return (
    CATEGORY_DESCRIPTIONS[category] ??
    "Estudos e análises para enxergar além da superfície."
  );
}

export default function HomeCategoryIndex({ studies }: { studies: StudyMeta[] }) {
  const counts = studies.reduce<Record<string, number>>((acc, s) => {
    if (!s.category) return acc;
    acc[s.category] = (acc[s.category] ?? 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(counts).sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );

  if (categories.length === 0) return null;

  return (
    <section className="border-b border-gold/10">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex items-center gap-4">
          <h2 className="font-label text-[10px] uppercase tracking-[0.25em] text-gold">
            Navegue por categoria
          </h2>
          <div className="h-px flex-1 bg-gold/15" />
          <Link
            href="/categorias"
            className="font-label text-[9px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
          >
            Ver índice →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const count = counts[cat] ?? 0;
            return (
              <div
                key={cat}
                className="border border-gold/10 bg-card p-5 transition-colors duration-200 hover:border-gold/25"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display text-lg leading-snug text-text">
                    {cat}
                  </h3>
                  <span className="font-label text-[10px] uppercase tracking-widest text-subtle bg-gold/6 border border-gold/10 px-2 py-1 shrink-0">
                    {count} {count === 1 ? "estudo" : "estudos"}
                  </span>
                </div>

                <p className="font-body text-sm leading-relaxed text-muted mb-4">
                  {getDescription(cat)}
                </p>

                <Link
                  href={`/estudos?cat=${encodeURIComponent(cat)}`}
                  className="font-label text-[10px] uppercase tracking-widest text-gold/70 hover:text-gold transition-colors"
                >
                  Explorar →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

