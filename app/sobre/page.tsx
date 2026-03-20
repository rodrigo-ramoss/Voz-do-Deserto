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
 *      <h3> Fé no Deserto
 *      <h3> Confronto com a Narrativa
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
    title: "Apócrifos e Cânon",
    description:
      "Livro de Enoque, Evangelho de Tomé, Maria Madalena, Jubileus. O que foi retirado da Bíblia, por quem e por quê.",
  },
  {
    icon: "✦",
    title: "História Proibida da Igreja",
    description:
      "Concílio de Niceia, Inquisição, alianças com poder político, corrupção institucional ao longo dos séculos.",
  },
  {
    icon: "✦",
    title: "Jesus fora do Sermão",
    description:
      "Jesus histórico. Contexto do século I. O que ele realmente dizia fora da narrativa domesticada pela instituição.",
  },
  {
    icon: "✦",
    title: "Exegese Profunda",
    description:
      "Palavras originais grego e hebraico — Hamartia, Ekklesia, Exerchomai, Metanoia. O que a tradução perdeu ou distorceu.",
  },
  {
    icon: "✦",
    title: "Fé no Deserto",
    description:
      "Para quem está fora da instituição. Validação da jornada. O deserto bíblico como lugar de encontro com Deus.",
  },
  {
    icon: "✦",
    title: "Confronto com a Narrativa",
    description:
      "Dízimo não está no NT. PEC 5/2023. Aliança templo-política. Babilônia moderna. Apocalipse 18.",
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
            Evangelista · Pesquisador · Voz do Deserto
          </p>
        </div>
      </section>

      {/* ── Bio principal ───────────────────────────────────────────────── */}
      {/* <section> sem heading: a bio é continuação da apresentação do autor acima.
          Usar um H2 aqui criaria ruído na navegação por headings sem benefício. */}
      <section className="prose-study">
        <p>
          Rodrigo Ramos não estuda o que está nos currículos. Estuda o que está acontecendo.
        </p>
        <p>
          Enquanto o mundo religioso debate dízimo e cobertura espiritual, Rodrigo
          investiga a convergência entre profecia bíblica e a arquitetura tecnológica
          que está sendo construída em tempo real — algoritmos que tomam decisões sem
          supervisão humana, moedas digitais programadas para expirar, sistemas de
          vigilância que conhecem seu rosto antes de você entrar numa sala.
        </p>
        <p>
          Não é ficção científica. É Apocalipse 13 com código-fonte aberto.
        </p>
        <p>
          Formado na escola do que ninguém ensina — manuscritos que foram enterrados
          no deserto, textos que o cânon rejeitou, histórias que a instituição religiosa
          suprimiu por conveniência — Rodrigo chegou à conclusão que a maioria dos
          estudiosos evita: o sistema que a Escritura chama de Besta não chegará como
          um ditador com um exército. Chegará como conveniência. Como conforto. Como
          a solução para todos os seus problemas — desde que você aceite os termos de uso.
        </p>
        <p>
          A Voz do Deserto existe para os que ainda têm ouvidos. Para os que saíram
          do sistema religioso institucional não porque perderam a fé, mas porque a fé
          os tornou incapazes de continuar fingindo que está tudo bem.
        </p>
        <p>
          O chamado já começou. O deserto está cheio de pessoas que ainda não sabem
          que estão nele.
        </p>
        <p className="font-label text-[10px] uppercase tracking-widest text-muted">
          — Rodrigo Ramos · Pesquisador de origens cristãs, escatologia tecnológica
          e o Cristianismo que sobreviveu ao deserto.
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
            "Deus não tem medo da sua dúvida.
          </p>
          <p className="font-display text-2xl leading-relaxed text-text/70 mb-6">
            O sistema tem."
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
