"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import NewsletterForm from "@/app/components/NewsletterForm";
import NonMonthlyOnly from "@/app/components/NonMonthlyOnly";

/* ─── Hook de entrada por scroll ────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─── Card de tema ──────────────────────────────────────────── */
function ThemeCard({
  icon,
  title,
  body,
  delay = 0,
}: {
  icon: string;
  title: string;
  body: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      className={`relative border p-6 transition-all duration-300 cursor-default
        ${hov
          ? "border-gold/35 bg-gold/[0.03] shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
          : "border-gold/10 bg-card/50"
        }`}
    >
      {/* linha topo */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1px] transition-all duration-500
          ${hov
            ? "bg-gradient-to-r from-transparent via-gold/50 to-transparent"
            : "bg-gradient-to-r from-transparent via-gold/12 to-transparent"
          }`}
      />

      <span className="font-display text-2xl text-gold/40 mb-4 block" aria-hidden>{icon}</span>
      <h3
        className={`font-display text-lg leading-snug mb-3 transition-colors duration-200
          ${hov ? "text-gold" : "text-text"}`}
      >
        {title}
      </h3>
      <p className="font-body text-sm text-text/45 leading-relaxed">{body}</p>
    </div>
  );
}

/* ─── Linha de destaque com palavra original ─────────────────── */
function WordLine({ word, lang, meaning }: { word: string; lang: string; meaning: string }) {
  const { ref, visible } = useReveal(0.05);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
      className="flex items-start gap-5 border-b border-gold/8 pb-5"
    >
      <span className="font-display text-2xl text-gold/80 shrink-0 min-w-[80px]">{word}</span>
      <div>
        <p className="font-label text-[8px] uppercase tracking-widest text-gold/40 mb-1">{lang}</p>
        <p className="font-body text-sm text-text/55 leading-relaxed">{meaning}</p>
      </div>
    </div>
  );
}

/* ─── Página principal ───────────────────────────────────────── */
export default function OOriginalPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative overflow-hidden">

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.03; }
          50%       { opacity: 0.07; }
        }
        @keyframes scanDown {
          from { transform: translateY(-100%); }
          to   { transform: translateY(100vh); }
        }
      `}</style>

      {/* ── Fundo decorativo ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,183,106,0.05) 0%, transparent 60%)",
            animation: "glowPulse 6s ease-in-out infinite",
          }}
        />
        {/* Grade de linhas finas — efeito papiro antigo */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(212,183,106,0.8) 39px, rgba(212,183,106,0.8) 40px)",
          }}
        />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">

        {/* Breadcrumb */}
        <nav
          className="flex items-center justify-center gap-2 mb-16"
          aria-label="Navegação"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <Link
            href="/livraria"
            className="font-label text-[9px] uppercase tracking-widest text-gold/40 hover:text-gold transition-colors"
          >
            Arquivo Secreto
          </Link>
          <span className="text-gold/20 text-[10px]" aria-hidden>›</span>
          <span className="font-label text-[9px] uppercase tracking-widest text-gold/70">
            O Original
          </span>
        </nav>

        {/* Badge */}
        <p
          className="font-label text-[9px] uppercase tracking-[0.45em] text-gold/55 mb-6"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
          }}
        >
          ✦ &nbsp; 03 · Exegese & Origens &nbsp; ✦
        </p>

        {/* Título */}
        <h1
          className="font-display text-5xl md:text-7xl text-text leading-none mb-4"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
        >
          O Original
        </h1>

        {/* Subtítulo em hebraico/grego (decorativo) */}
        <p
          className="font-display text-base text-gold/30 tracking-widest mt-3 mb-6"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.7s ease 0.2s",
          }}
          aria-hidden
        >
          בְּרֵאשִׁית · ἐν ἀρχῇ · In Principio
        </p>

        <div
          className="h-px w-20 bg-gold/30 mx-auto mb-8"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "scaleX(1)" : "scaleX(0)",
            transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
            transformOrigin: "center",
          }}
        />

        {/* Descrição */}
        <p
          className="font-body text-lg text-text/50 max-w-2xl mx-auto leading-relaxed"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
          }}
        >
          A Bíblia antes das traduções e das doutrinas institucionais.
          Voltamos ao hebraico, ao grego, à história — para descobrir o que realmente
          estava escrito, o que os primeiros leitores entendiam, e o que isso significa hoje.
        </p>

        {/* Linha de declaração */}
        <blockquote
          className="mt-10 border-l-2 border-gold/25 pl-6 text-left max-w-lg mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.7s ease 0.45s",
          }}
        >
          <p className="font-body text-sm text-text/40 italic leading-relaxed">
            &ldquo;O que a tradição chamou de heresia pode ser apenas
            o que estava escrito antes da tradição existir.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* ── O que encontrará aqui ────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gold/10" />
          <span className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/40">
            O que você vai encontrar
          </span>
          <div className="h-px flex-1 bg-gold/10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ThemeCard
            delay={0}
            icon="◎"
            title="Estudos de Livros Bíblicos"
            body="Cada livro, capítulo por capítulo — no contexto histórico em que foi escrito, com as palavras originais e o que o autor queria dizer."
          />
          <ThemeCard
            delay={80}
            icon="◈"
            title="Doutrinas Sob Exame"
            body="Doutrinas amplamente aceitas colocadas à prova das Escrituras originais. O que resiste? O que foi acrescentado pela tradição?"
          />
          <ThemeCard
            delay={160}
            icon="✦"
            title="Palavras que Foram Apagadas"
            body="Termos hebraicos e gregos que perderam força na tradução — e o que se perde quando eles desaparecem do texto que você lê."
          />
          <ThemeCard
            delay={240}
            icon="◇"
            title="A Bíblia e a História"
            body="Como os primeiros cristãos, os judeus do Segundo Templo e os pais da Igreja liam os mesmos textos que você tem em mãos hoje."
          />
          <ThemeCard
            delay={320}
            icon="◉"
            title="O que a Igreja Distorceu"
            body="Não é anticristianismo — é amor à verdade. Quando a instituição substituiu a Escritura, e o que voltamos a encontrar quando retornamos à fonte."
          />
          <ThemeCard
            delay={400}
            icon="◐"
            title="Aplicação Contemporânea"
            body="O passado não é museu. O que esses textos, lidos como foram escritos, têm a dizer sobre o tempo em que vivemos agora."
          />
        </div>
      </section>

      {/* ── Amostra de palavras originais ───────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gold/10" />
          <span className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/40">
            Amostra — palavras que importam
          </span>
          <div className="h-px flex-1 bg-gold/10" />
        </div>
        <p className="font-body text-sm text-text/35 text-center mb-10">
          Cada estudo começa aqui — na palavra como foi escrita.
        </p>

        <div className="space-y-5">
          <WordLine
            word="שָׁלוֹם"
            lang="Hebraico · Shalom"
            meaning="Não apenas &ldquo;paz&rdquo; — mas inteireza, completude, ausência de fragmentação. Uma ordem cósmica restaurada que a palavra &ldquo;paz&rdquo; não consegue carregar."
          />
          <WordLine
            word="μετάνοια"
            lang="Grego · Metanoia"
            meaning="Traduzido como &ldquo;arrependimento&rdquo;, mas literalmente: mudança de mente, de direção do pensamento. Muito além do remorso emocional que a tradução sugere."
          />
          <WordLine
            word="אֱמוּנָה"
            lang="Hebraico · Emunah"
            meaning="&ldquo;Fé&rdquo; na tradução — mas a raiz é firmeza, constância, confiabilidade. Não crença cega, mas um modo de estar no mundo com consistência."
          />
          <WordLine
            word="παρουσία"
            lang="Grego · Parousia"
            meaning="&ldquo;Vinda&rdquo; ou &ldquo;segunda vinda&rdquo; nas traduções — originalmente: presença ativa, chegada de um rei à sua cidade. Muda o que se entende por escatologia."
          />
        </div>
      </section>

      {/* ── Em construção ───────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="border border-gold/15 bg-card/40 p-10 md:p-14 text-center relative overflow-hidden">

          {/* Decoração de fundo */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background: "radial-gradient(ellipse at 50% 100%, rgba(212,183,106,0.04) 0%, transparent 70%)",
            }}
          />

          <p className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/50 mb-5">
            Conteúdo chegando
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-text leading-tight mb-5">
            Os primeiros estudos<br />estão sendo preparados.
          </h2>
          <div className="h-px w-12 bg-gold/25 mx-auto mb-6" />
          <p className="font-body text-sm text-text/45 leading-relaxed max-w-lg mx-auto mb-10">
            Cada estudo publicado aqui passa por um processo rigoroso — fontes primárias,
            contexto histórico, palavras originais. Não publicamos rápido. Publicamos certo.
          </p>

          {/* Tags do que vem */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              "Gênesis 1–3",
              "O Sermão da Montanha",
              "Daniel e os Impérios",
              "Apocalipse — texto original",
              "O Sheol e o Inferno",
              "Paulo e a Lei",
            ].map((tag) => (
              <span
                key={tag}
                className="font-label text-[8px] uppercase tracking-widest border border-gold/15 bg-gold/4 px-3 py-1.5 text-gold/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Newsletter */}
          <NonMonthlyOnly>
            <div className="max-w-md mx-auto">
              <p className="font-label text-[9px] uppercase tracking-[0.35em] text-gold/55 mb-5">
                Avise-me quando publicar
              </p>
              <NewsletterForm context="page" />
            </div>
          </NonMonthlyOnly>
        </div>
      </section>

      {/* ── Rodapé ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-10 flex flex-col items-center gap-6">
        <div className="flex items-center gap-6 w-full" aria-hidden>
          <div className="h-px flex-1 bg-gold/8" />
          <span className="font-label text-[8px] uppercase tracking-[0.4em] text-gold/20">
            O Original · Arquivo Secreto
          </span>
          <div className="h-px flex-1 bg-gold/8" />
        </div>
        <Link
          href="/livraria"
          className="font-label text-[9px] uppercase tracking-widest text-gold/35 hover:text-gold transition-colors"
        >
          ← Voltar ao Arquivo Secreto
        </Link>
      </div>

    </main>
  );
}
