"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import NewsletterForm from "@/app/components/NewsletterForm";
import NonMonthlyOnly from "@/app/components/NonMonthlyOnly";
import type { OOriginalMeta } from "@/lib/o-original";

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
  badge,
  delay = 0,
}: {
  icon: string;
  title: string;
  body: string;
  badge?: string;
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

      <div className="flex items-start justify-between gap-2 mb-4">
        <span className="font-display text-2xl text-gold/40" aria-hidden>{icon}</span>
        {badge && (
          <span className="font-label text-[7px] uppercase tracking-widest border border-gold/25 bg-gold/5 text-gold/60 px-2 py-0.5 shrink-0">
            ↻ {badge}
          </span>
        )}
      </div>
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

/* ─── Card de artigo publicado ──────────────────────────────── */
function ArticleCard({ article }: { article: OOriginalMeta }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={`/livraria/o-original/${article.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`group relative flex flex-col border overflow-hidden transition-all duration-300
        ${hov ? "border-gold/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)]" : "border-gold/12 bg-card/60"}`}
    >
      {/* Lombada superior */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] transition-all duration-500
        ${hov ? "bg-gradient-to-r from-transparent via-gold/60 to-transparent"
               : "bg-gradient-to-r from-transparent via-gold/15 to-transparent"}`} />

      {/* Capa */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gold/5 shrink-0">
        {article.image ? (
          <Image src={article.image} alt={article.title} fill
            className={`object-cover transition-transform duration-500 ${hov ? "scale-[1.04]" : "scale-100"}`}
            sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-6xl text-gold/10 select-none">✦</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080705]/80 via-transparent to-transparent" />
        {article.premium && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 border border-gold/35 bg-bg/70 px-2 py-1">
            <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
            </svg>
            <span className="font-label text-[8px] uppercase tracking-widest text-gold/90">Premium</span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {article.language && (
            <span className="font-label text-[8px] uppercase tracking-widest text-gold/50">{article.language}</span>
          )}
          {article.book && (
            <><span className="text-gold/20 text-[10px]">·</span>
            <span className="font-label text-[8px] uppercase tracking-widest text-muted/50">{article.book}</span></>
          )}
        </div>
        <h3 className={`font-display text-base leading-snug flex-1 mb-3 transition-colors duration-200
          ${hov ? "text-gold" : "text-text"}`}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="font-body text-sm text-text/40 leading-relaxed line-clamp-2 mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gold/8 mt-auto">
          <span className="font-label text-[8px] uppercase tracking-widest text-muted/40">{article.date}</span>
          <span className={`font-label text-[8px] uppercase tracking-widest transition-colors duration-200
            ${hov ? "text-gold" : "text-gold/45"}`}>Ler →</span>
        </div>
      </div>

      {/* Lombada lateral */}
      <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b transition-all duration-300
        ${hov ? "from-gold/50 via-gold/25 to-transparent" : "from-gold/15 via-gold/8 to-transparent"}`} />
    </Link>
  );
}

/* ─── Card de seção (Livros / Doutrinas) ─────────────────────── */
function SectionCard({
  href, icon, title, description, count, badge,
}: {
  href: string; icon: string; title: string; description: string;
  count?: number; badge?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`relative flex flex-col border overflow-hidden transition-all duration-300 p-7 md:p-9
        ${hov ? "border-gold/40 bg-gold/[0.03] shadow-[0_6px_32px_rgba(0,0,0,0.4)]"
               : "border-gold/12 bg-card/50"}`}
    >
      {/* Linha topo */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] transition-all duration-500
        ${hov ? "bg-gradient-to-r from-transparent via-gold/55 to-transparent"
               : "bg-gradient-to-r from-transparent via-gold/15 to-transparent"}`} />
      {/* Lombada lateral */}
      <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b transition-all duration-300
        ${hov ? "from-gold/50 via-gold/25 to-transparent" : "from-gold/15 via-gold/8 to-transparent"}`} />

      <div className="flex items-start justify-between mb-5">
        <span className="font-display text-3xl text-gold/35" aria-hidden>{icon}</span>
        {badge && (
          <span className="font-label text-[7px] uppercase tracking-widest border border-gold/20 bg-gold/5 text-gold/55 px-2 py-0.5">
            ↻ {badge}
          </span>
        )}
      </div>

      <h3 className={`font-display text-2xl mb-3 transition-colors duration-200 ${hov ? "text-gold" : "text-text"}`}>
        {title}
      </h3>
      <p className="font-body text-sm text-text/45 leading-relaxed flex-1 mb-6">{description}</p>

      <div className="flex items-center justify-between">
        {count !== undefined && (
          <span className="font-label text-[8px] uppercase tracking-widest text-gold/35">
            {count} {count === 1 ? "estudo" : "estudos"}
          </span>
        )}
        <span className={`font-label text-[9px] uppercase tracking-widest transition-colors duration-200 ml-auto
          ${hov ? "text-gold" : "text-gold/45"}`}>
          Acessar →
        </span>
      </div>
    </Link>
  );
}

/* ─── Página principal ───────────────────────────────────────── */
export default function OOriginalPage({ latest, totalCount }: { latest: OOriginalMeta[]; totalCount: number }) {
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
          <ThemeCard
            delay={480}
            icon="◬"
            title="Doutrinas"
            badge="Atualizado semanalmente"
            body="Doutrinas amplamente aceitas colocadas sob exame direto do texto original — arrebatamento, inferno, trindade, dízimo e outros temas que a tradição ensinou diferente do que está escrito."
          />
          <ThemeCard
            delay={560}
            icon="☷"
            title="Interpretando a Bíblia"
            badge="Atualizado semanalmente"
            body="Livro por livro, capítulo por capítulo — no contexto histórico, no idioma original, com o que o autor queria dizer. Sem filtro de denominação, sem leitura retroativa."
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

      {/* ── Últimos Estudos ─────────────────────────────────────── */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gold/10" />
            <span className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/40">
              Últimos estudos · {totalCount} publicados
            </span>
            <div className="h-px flex-1 bg-gold/10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* ── Duas câmaras: Livros Bíblicos + Doutrinas ───────────── */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gold/10" />
          <span className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/40">
            Navegue por seção
          </span>
          <div className="h-px flex-1 bg-gold/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SectionCard
            href="/livraria/o-original/livros-biblicos"
            icon="◎"
            title="Livros Bíblicos"
            description="Interpretação livro por livro — no idioma original, no contexto histórico em que foi escrito, sem filtro de denominação e sem leitura retroativa."
            badge="Atualizado semanalmente"
          />
          <SectionCard
            href="/livraria/o-original/doutrinas"
            icon="◈"
            title="Doutrinas"
            description="Doutrinas amplamente aceitas colocadas sob exame direto do texto — arrebatamento, inferno, trindade e outros temas que a tradição ensinou diferente do que está escrito."
            badge="Atualizado semanalmente"
          />
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
