import Link from "next/link";
import Image from "next/image";
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

const CATEGORY_COVER_SLUG: Record<string, string> = {
  Apócrifos: "canone-e-poder",
  "Jesus Histórico": "agonia-no-getsemani",
  "História da Igreja": "400-mil-variantes",
  Desigrejados: "igreja-mercado-templo-convencoes",
  Sobrevivência: "bussola-amanha-10-estrategias-autonomia",
  "Fé e Tecnologia": "a-vontade-da-maquina-ciencia-profecia-consciencia-artificial",
  "Escatologia Digital": "a-sombra-digital-do-leviata-vigilancia-total-e-a-engenharia-da-marca",
  "Geopolítica Escatológica": "colapso-pax-americana-daniel2",
  "Profecias e Tempo Presente": "o-grande-reinicio-a-engrenagem-que-redesenha-o-destino-global",
  "Economia & História": "kondratiev_jubileu_ciclo",
  "IA & Controle": "nomos_digital_governamentalidade",
  "Bíblia & Interpretação": "malaquias-3-10-dizimo-voz-do-deserto",
  "Sistema Religioso": "o-templo-que-nunca-caiu-novos-donos-do-sagrado",
  "Pilares da Fé": "obediencia_jesus",
  "Fé no Deserto": "deserto-purificacao",
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

  const bySlug = new Map(studies.map((s) => [s.slug, s]));
  const firstWithImageByCat = new Map<string, StudyMeta>();
  for (const s of studies) {
    if (!s.category || !s.image) continue;
    if (!firstWithImageByCat.has(s.category)) firstWithImageByCat.set(s.category, s);
  }

  const getCover = (cat: string): string | null => {
    const preferredSlug = CATEGORY_COVER_SLUG[cat];
    if (preferredSlug) {
      const preferred = bySlug.get(preferredSlug);
      if (preferred?.image) return preferred.image;
    }
    return firstWithImageByCat.get(cat)?.image ?? null;
  };

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
            const cover = getCover(cat);
            return (
              <div
                key={cat}
                className="border border-gold/10 bg-card transition-colors duration-200 hover:border-gold/25 overflow-hidden"
              >
                {/* Capa da categoria (derivada de um estudo representativo) */}
                <div className="relative aspect-[16/9] overflow-hidden bg-bg border-b border-gold/10">
                  {cover ? (
                    <>
                      <Image
                        src={cover}
                        alt={`Capa da categoria ${cat}`}
                        fill
                        className="object-cover opacity-85"
                      />
                      <div className="carousel-scan-line" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.10] via-transparent to-ember/[0.06] flex items-center justify-center">
                      <span className="font-display text-5xl text-gold/[0.07] select-none">
                        ✦
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/10 to-transparent" />
                  <div className="absolute left-4 bottom-3 right-4 flex items-end justify-between gap-3">
                    <h3 className="font-display text-xl leading-snug text-text">
                      {cat}
                    </h3>
                    <span className="font-label text-[10px] uppercase tracking-widest text-gold/80 border border-gold/20 bg-[#0a0806]/70 px-2 py-1 shrink-0">
                      {count} {count === 1 ? "estudo" : "estudos"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
