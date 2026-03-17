import type { Metadata } from "next";
import NewsletterForm from "@/app/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Livraria — Voz do Deserto",
  description:
    "Em breve — estudos completos, materiais e leituras recomendadas no blog Voz do Deserto.",
};

// Placeholders dos materiais futuros
const placeholders = [
  {
    icon: "✦",
    title: "Coleção Apócrifos",
    description: "Guia completo dos textos excluídos do cânon — contexto histórico e análise crítica.",
    category: "Estudos completos",
  },
  {
    icon: "✦",
    title: "Jesus Histórico",
    description: "Material de estudo sobre o Jesus do século I fora da narrativa institucional.",
    category: "Estudos completos",
  },
  {
    icon: "✦",
    title: "Exegese do Original",
    description: "Dicionário prático de palavras gregas e hebraicas distorcidas pela tradução.",
    category: "Referência",
  },
  {
    icon: "✦",
    title: "História da Igreja",
    description: "Linha do tempo dos concílios, disputas e corrupção institucional — fontes primárias.",
    category: "Referência",
  },
  {
    icon: "✦",
    title: "Fé no Deserto",
    description: "Guia para quem está fora da instituição e busca profundidade espiritual autêntica.",
    category: "Formação",
  },
  {
    icon: "✦",
    title: "Leituras Recomendadas",
    description: "Curadoria de livros acadêmicos e documentários sobre Bíblia, história e teologia.",
    category: "Curadoria",
  },
];

export default function LivrariaPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      {/* Cabeçalho */}
      <p className="font-label text-[11px] uppercase tracking-[0.25em] text-gold mb-6">
        Em breve
      </p>
      <h1 className="font-display text-4xl text-text mb-4 md:text-5xl">
        Livraria
      </h1>
      <div className="h-px w-16 bg-gold/30 mb-5" />
      <p className="font-body text-lg text-text/55 max-w-xl leading-relaxed mb-16">
        Estudos completos, materiais de referência e leituras recomendadas.
        Cada item com curadoria — sem afilhados, sem publicidade.
      </p>

      {/* Grid de placeholders */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-20">
        {placeholders.map((item) => (
          <div
            key={item.title}
            className="relative border border-gold/10 bg-card p-6 overflow-hidden"
          >
            {/* Overlay de bloqueio */}
            <div className="absolute inset-0 bg-bg/50 flex items-center justify-center z-10">
              <div className="text-center">
                <p className="font-label text-[8px] uppercase tracking-[0.3em] text-gold/30 mb-1">
                  Em breve
                </p>
                <div className="w-6 h-6 border border-gold/20 flex items-center justify-center mx-auto">
                  <svg
                    className="w-3 h-3 text-gold/30"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Conteúdo desfocado sob o overlay */}
            <div className="blur-[2px] select-none">
              <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ember/50 mb-3">
                {item.category}
              </p>
              <p className="font-display text-[10px] text-gold/20 mb-3">
                {item.icon}
              </p>
              <h3 className="font-display text-lg text-text/30 mb-2">
                {item.title}
              </h3>
              <p className="font-body text-sm text-text/20 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Separador */}
      <div className="flex items-center gap-6 mb-14">
        <div className="h-px flex-1 bg-gold/10" />
        <span className="text-xs text-gold/20">✦</span>
        <div className="h-px flex-1 bg-gold/10" />
      </div>

      {/* CTA Newsletter */}
      <div className="max-w-2xl mx-auto">
        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-gold mb-4 text-center">
          Seja o primeiro a saber
        </p>
        <h2 className="font-display text-3xl text-text mb-3 text-center">
          Avise-me quando a Livraria abrir
        </h2>
        <p className="font-body text-base text-text/50 leading-relaxed mb-8 text-center">
          Cadastre seu e-mail e você será notificado quando os primeiros
          materiais estiverem disponíveis. Nenhum spam — apenas o aviso.
        </p>
        <NewsletterForm context="page" />
      </div>
    </main>
  );
}
