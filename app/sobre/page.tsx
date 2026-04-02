/*
 * ACESSIBILIDADE — Hierarquia de Headings (T2)
 * ─────────────────────────────────────────────────────────────────────────
 * Estrutura final da página /sobre:
 *
 *  <h1> Sobre o Projeto
 *    <h2> Rodrigo Ramos              ← seção do autor
 *    <h2> Os 6 pilares               ← antes era <span> (apenas visual)
 *      <h3> Apócrifos e Cânon        ← antes eram <p> (sem semântica)
 *      <h3> História Proibida ...
 *      <h3> Jesus fora do Sermão
 *      <h3> Exegese Profunda
 *      <h3> O Sistema & Você
 *      <h3> Deserto & Resistência
 *    <h2> Onde me encontrar          ← antes era <p> (apenas visual)
 *
 * Cada <section> tem aria-labelledby apontando para seu heading,
 * permitindo que leitores de tela anuem a região ao navegar por landmarks.
 *
 * A seção "Frase assinatura" não recebe heading pois é um elemento
 * de ornamento/citação — usar heading ali criaria ruído na navegação por
 * headings sem benefício semântico real.
 * ─────────────────────────────────────────────────────────────────────────
 */

import AuthorPhoto from "@/app/components/AuthorPhoto";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre — Voz do Deserto",
  description:
    "Rodrigo Ramos não veio da teologia. Veio da vida real. Conheça a história por trás da Voz do Deserto.",
};

const pillars = [
  {
    icon: "✦",
    title: "Fé Sem Filtro",
    description:
      "Exegese do grego original, apócrifos, Jesus histórico. O texto sem a distorção institucional.",
  },
  {
    icon: "✦",
    title: "Escatologia Digital",
    description:
      "IA, Apocalipse 13, imagem da Besta, controle algorítmico. A profecia lida com os olhos abertos.",
  },
  {
    icon: "✦",
    title: "Geopolítica Profética",
    description:
      "Impérios, guerras, alianças globais. A gramática bíblica por trás do que os jornais não explicam.",
  },
  {
    icon: "✦",
    title: "Economia & Padrões",
    description:
      "Ciclos de Kondratiev, Jubileu, juros, soberania financeira. O que o sistema não quer que você entenda sobre dinheiro.",
  },
  {
    icon: "✦",
    title: "O Sistema & Você",
    description:
      "IA, vigilância, CBDCs, controle social. Como não ser escravo do que está sendo construído agora.",
  },
  {
    icon: "✦",
    title: "Deserto & Resistência",
    description:
      "Para quem saiu da instituição. Fé no deserto, comunidade real, preparação prática para o que vem.",
  },
];

function Ornament() {
  return (
    /* aria-hidden: elemento decorativo, sem valor semântico */
    <div className="flex items-center justify-center gap-6 my-16" aria-hidden>
      <div className="h-px w-16 bg-gold/15" />
      <span className="text-xs text-gold/25">✦</span>
      <div className="h-px w-16 bg-gold/15" />
    </div>
  );
}

export default function SobrePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">

      {/* ── Cabeçalho da página ─────────────────────────────────────────── */}
      {/* <p> visual aqui é intencional: "O projeto" é um label decorativo,
          não um heading de seção — não deve aparecer na navegação por headings. */}
      <p className="font-label text-[11px] uppercase tracking-[0.25em] text-gold mb-6">
        O projeto
      </p>
      {/* H1 único da página */}
      <h1 className="font-display text-4xl text-text mb-4 md:text-5xl">
        Sobre o Projeto
      </h1>
      <div className="h-px w-16 bg-gold/30 mb-12" />

      {/* ── Perfil do autor ─────────────────────────────────────────────── */}
      {/*
        aria-labelledby="author-heading": associa o landmark <section> ao H2,
        assim leitores de tela anunciam "seção: Rodrigo Ramos" ao entrar.
      */}
      <section
        aria-labelledby="author-heading"
        className="flex flex-col gap-8 sm:flex-row sm:items-start mb-12"
      >
        <AuthorPhoto />

        <div className="flex-1">
          {/* Label visual de contexto — não é heading */}
          <p className="font-label text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
            O criador
          </p>
          {/*
            H2: primeiro sub-heading do H1 "Sobre o Projeto".
            Mantém a hierarquia H1 → H2 exigida por WCAG 1.3.1.
          */}
          <h2 id="author-heading" className="font-display text-2xl text-text mb-4">
            Rodrigo Ramos
          </h2>
          <p className="font-label text-[9px] uppercase tracking-[0.2em] text-muted">
            Escritor · Pesquisador · Fundador da Voz do Deserto
          </p>
        </div>
      </section>

      {/* ── Bio principal ───────────────────────────────────────────────── */}
      {/* <section> sem heading: a bio é continuação da apresentação do autor acima.
          Usar um H2 aqui criaria ruído na navegação por headings sem benefício. */}
      <section className="prose-study">
        <p>
          Rodrigo Ramos não estuda o que está nos currículos. Ele estuda o que está
          acontecendo — e o que foi deliberadamente enterrado para que você não pudesse
          ver a conexão.
        </p>
        <p>
          Convertido em 2016, Rodrigo não seguiu o caminho padrão de quem entra numa
          igreja evangélica brasileira. Enquanto a maioria aprendia a aplaudir no momento
          certo do culto, ele mergulhava nos manuscritos de Nag Hammadi, na crítica
          textual do Novo Testamento, na história das controvérsias cristológicas do
          século II, nos textos que Atanásio mandou queimar e que o deserto egípcio
          guardou por 1.600 anos. Não como curiosidade acadêmica — como necessidade.
          Porque a fé que ele havia encontrado exigia mais do que o sistema conseguia oferecer.
        </p>
        <p>
          Com o tempo, percebeu que havia dois tipos de pesquisadores no mundo. Os que
          estudam o passado e os que analisam o presente. Ele decidiu ser o terceiro
          tipo: o que percebe que os dois estão descrevendo a mesma coisa.
        </p>
        <p>
          Os textos proféticos do século I falam de um sistema de controle econômico
          global vinculado à identidade, à conformidade e à lealdade a um poder que
          reivindica autoridade absoluta. A arquitetura tecnológica do século XXI —
          inteligência artificial autônoma, moedas digitais programáveis, biometria
          universal, sistemas de vigilância de massa — está construindo, peça por peça,
          exatamente esse sistema. Não como plano conspiratório de bastidor. Como
          conveniência. Como progresso. Como a solução natural para os problemas que
          o mundo enfrenta.
        </p>
        <p>
          Rodrigo não grita. Ele mostra. Com fontes verificáveis, com exegese
          responsável, com a mesma disciplina intelectual que levaria qualquer
          pesquisador sério a qualquer outra conclusão — se estivesse disposto a
          olhar para o conjunto em vez de para as partes isoladas.
        </p>
        <p>
          A Voz do Deserto é o resultado dessa visão de conjunto.
        </p>

        <h2 className="font-display text-xl text-text mt-10 mb-4">Para quem é este blog</h2>
        <p>
          É para você que saiu de uma igreja — ou que ainda está dentro, mas sente que
          algo não encaixa. Para você que leu a Bíblia com atenção suficiente para
          perceber que o que é pregado no domingo raramente é o que o texto realmente
          diz. Para você que olha para as notícias sobre IA, CBDCs e vigilância digital
          e sente uma ressonância estranha com versículos que nunca ouviu pregados
          com seriedade.
        </p>
        <p>
          Você não perdeu a fé. Você ficou grande demais para o molde que o sistema
          oferecia.
        </p>

        <h2 className="font-display text-xl text-text mt-10 mb-4">O que você encontra aqui</h2>
        <p>
          Encontra o que é mais raro na internet hoje: profundidade sem agenda
          institucional. Cada artigo começa com o dado verificável — histórico, textual
          ou tecnológico — antes de qualquer interpretação. Cada conclusão nomeia os
          próprios limites. Cada fonte é real e checável.
        </p>
        <p>
          Você vai entender o Cristianismo primitivo como ele realmente era — plural,
          disputado, muito mais rico do que o cânon do século IV deixou transparecer.
          Vai entender como a arquitetura digital do presente se encaixa no quadro
          profético com uma precisão que exige mais do que coincidência para explicar.
          E vai entender que o chamado para fora do sistema — que João Batista pregou
          no deserto, que os Padres do Deserto viveram no século IV, que os 16 milhões
          de desigrejados brasileiros estão experimentando agora sem ainda ter nome
          para isso — não é abandono da fé.
        </p>
        <p>
          É a fé funcionando exatamente como deveria.
        </p>
        <blockquote>
          O deserto não é o fim. É onde a voz ainda é clara.
        </blockquote>
        <p className="font-label text-[10px] uppercase tracking-widest text-muted">
          — Rodrigo Ramos · Fundador da Voz do Deserto
        </p>
      </section>

      <Ornament />

      {/* ── Os 6 pilares ────────────────────────────────────────────────── */}
      {/*
        aria-labelledby="pillars-heading": associa o landmark ao H2.
        H2 "Os 6 pilares" corrige a versão anterior que usava <span> —
        leitores de tela ignoravam completamente a seção.
      */}
      <section aria-labelledby="pillars-heading">
        <div className="mb-10 flex items-center gap-4">
          {/*
            H2: segundo sub-heading do H1 "Sobre o Projeto".
            Mantém hierarquia: H1 → H2 (Rodrigo Ramos) → H2 (Os 6 pilares).
            Dois H2 irmãos é correto — representam seções distintas do mesmo nível.
          */}
          <h2
            id="pillars-heading"
            className="font-label text-[11px] uppercase tracking-[0.25em] text-gold"
          >
            Os 6 pilares
          </h2>
          <div className="h-px flex-1 bg-gold/15" aria-hidden />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="border border-gold/10 bg-card p-6 hover:border-gold/20 transition-colors duration-300"
            >
              {/*
                H3: sub-heading de H2 "Os 6 pilares".
                Antes era <p> — leitores de tela não identificavam esses
                itens como títulos de seções, tornando a navegação confusa.
                Hierarquia: H1 → H2 → H3 ✓
              */}
              <h3 className="font-label text-[10px] uppercase tracking-[0.25em] text-gold/50 mb-3">
                {p.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-text/55">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Ornament />

      {/* ── Frase assinatura ────────────────────────────────────────────── */}
      {/*
        Sem heading: é um bloco de citação/ornamento.
        O label "Frase assinatura" é visual apenas — adicionar H2 aqui
        criaria ruído desnecessário na navegação por headings sem
        representar uma seção de conteúdo real.
      */}
      <section
        aria-label="Citação de Rodrigo Ramos"
        className="border border-gold/15 bg-card p-8 text-center"
      >
        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-gold/40 mb-6" aria-hidden>
          Frase assinatura
        </p>
        <blockquote>
          <p className="font-display text-2xl leading-relaxed text-text/70">
            “Deus não tem medo da sua dúvida.
          </p>
          <p className="font-display text-2xl leading-relaxed text-text/70 mb-6">
            O sistema tem.”
          </p>
          <footer className="font-label text-[10px] uppercase tracking-widest text-muted">
            — Rodrigo Ramos · Voz do Deserto
          </footer>
        </blockquote>
      </section>

      <Ornament />

      {/* ── Redes sociais ───────────────────────────────────────────────── */}
      {/*
        H2 "Onde me encontrar" corrige a versão anterior que usava <p>.
        Sem heading, leitores de tela não encontravam essa seção
        na navegação por landmarks/headings.
      */}
      <section aria-labelledby="social-heading" className="text-center">
        <h2
          id="social-heading"
          className="font-label text-[11px] uppercase tracking-[0.25em] text-gold mb-6"
        >
          Onde me encontrar
        </h2>
        <div className="flex flex-col items-center gap-3">
          <a
            href="https://www.instagram.com/vozdodesertto?igsh=MWJjY2IxNXZqYnJnZg=="
            target="_blank"
            rel="noopener noreferrer"
            /* aria-label descreve destino externo — útil quando abre em nova aba */
            aria-label="Seguir Voz do Deserto no Instagram (abre em nova aba)"
            className="font-label text-[11px] uppercase tracking-widest text-muted border-b border-muted/30 pb-0.5 hover:text-gold hover:border-gold/40 transition-colors duration-200"
          >
            Instagram @vozdodeserto
          </a>
          <a
            href="https://www.tiktok.com/@rodrigoramos.vdd?_r=1&_t=ZS-94d8CIakb7x"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Seguir Rodrigo Ramos no TikTok (abre em nova aba)"
            className="font-label text-[11px] uppercase tracking-widest text-muted border-b border-muted/30 pb-0.5 hover:text-gold hover:border-gold/40 transition-colors duration-200"
          >
            TikTok @vozdodeserto
          </a>
        </div>
      </section>

    </main>
  );
}
