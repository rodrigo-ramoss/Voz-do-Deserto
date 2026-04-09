"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Animação de entrada ────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ─── Partícula decorativa flutuante ─────────────────────────── */
function FloatingOrb({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) {
  return (
    <div
      aria-hidden
      className="absolute rounded-full bg-gold/[0.04] blur-3xl pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        animation: `floatOrb ${6 + delay}s ease-in-out ${delay}s infinite alternate`,
      }}
    />
  );
}

/* ─── Card de seção ──────────────────────────────────────────── */
interface SectionCardProps {
  href: string;
  badge: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  locked?: boolean;
  delay?: number;
}

function SectionCard({
  href,
  badge,
  icon,
  title,
  subtitle,
  description,
  tags,
  locked = false,
  delay = 0,
}: SectionCardProps) {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.65s ease, transform 0.65s ease",
      }}
      className={`relative flex flex-col border overflow-hidden h-full
        ${locked
          ? "border-gold/10 bg-card/40 cursor-default"
          : "border-gold/15 bg-card/60 cursor-pointer group"
        }
        transition-all duration-300
        ${!locked && hovered ? "border-gold/40 shadow-[0_8px_40px_rgba(212,183,106,0.08)]" : ""}
      `}
    >
      {/* Linha superior dourada */}
      <div
        className={`absolute top-0 left-0 right-0 h-[1px] transition-all duration-500
          ${!locked && hovered
            ? "bg-gradient-to-r from-transparent via-gold/70 to-transparent"
            : "bg-gradient-to-r from-transparent via-gold/20 to-transparent"
          }`}
      />

      {/* Fundo com gradiente sutil no hover */}
      {!locked && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(212,183,106,0.04) 0%, transparent 70%)",
            opacity: hovered ? 1 : 0,
          }}
        />
      )}

      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg/60 backdrop-blur-[2px]">
          <div className="w-12 h-12 border border-gold/20 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-gold/40" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="font-label text-[9px] uppercase tracking-[0.35em] text-gold/40">
            Em Breve
          </p>
        </div>
      )}

      <div className={`flex flex-col flex-1 p-8 md:p-10 ${locked ? "opacity-30" : ""}`}>

        {/* Badge */}
        <p className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/60 mb-6">
          {badge}
        </p>

        {/* Ícone */}
        <div
          className={`w-14 h-14 border flex items-center justify-center mb-6 shrink-0 transition-all duration-300
            ${!locked && hovered ? "border-gold/50 bg-gold/8" : "border-gold/15 bg-gold/4"}`}
        >
          {icon}
        </div>

        {/* Título */}
        <h2
          className={`font-display text-2xl md:text-3xl leading-tight mb-1 transition-colors duration-200
            ${!locked && hovered ? "text-gold" : "text-text"}`}
        >
          {title}
        </h2>

        {/* Subtítulo */}
        <p className="font-label text-[9px] uppercase tracking-widest text-muted/50 mb-5">
          {subtitle}
        </p>

        {/* Linha separadora */}
        <div
          className={`h-px mb-6 transition-all duration-500
            ${!locked && hovered ? "bg-gold/25 w-16" : "bg-gold/10 w-10"}`}
        />

        {/* Descrição */}
        <p className="font-body text-sm text-text/55 leading-relaxed mb-8 flex-1">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((t) => (
            <span
              key={t}
              className="font-label text-[8px] uppercase tracking-widest border border-gold/12 bg-gold/4 px-2.5 py-1 text-gold/55"
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        {!locked && (
          <div
            className={`inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest transition-colors duration-200
              ${hovered ? "text-gold" : "text-gold/60"}`}
          >
            <span>Entrar</span>
            <svg
              className={`w-3 h-3 transition-transform duration-300 ${hovered ? "translate-x-1" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (locked) return inner;

  return (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}

/* ─── Página principal ───────────────────────────────────────── */
export default function ArquivoSecretoHubPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeaderVisible(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* ── Estilo de animações ─────────────────────────────────── */}
      <style>{`
        @keyframes floatOrb {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-24px) scale(1.05); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,183,106,0); }
          50%       { box-shadow: 0 0 20px 2px rgba(212,183,106,0.08); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      {/* ── Orbs decorativos ────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <FloatingOrb delay={0}   size={420} x="10%"  y="5%"  />
        <FloatingOrb delay={1.5} size={320} x="70%"  y="20%" />
        <FloatingOrb delay={3}   size={280} x="40%"  y="60%" />
        <FloatingOrb delay={2}   size={200} x="85%"  y="70%" />
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 pt-24 pb-20">

        {/* Linha decorativa topo */}
        <div
          className="mb-12 flex items-center gap-4"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div className="h-px flex-1 bg-gold/10" />
          <span className="font-label text-[8px] uppercase tracking-[0.5em] text-gold/30">
            ✦ &nbsp; Arquivo Secreto &nbsp; ✦
          </span>
          <div className="h-px flex-1 bg-gold/10" />
        </div>

        {/* Headline */}
        <div
          ref={headerRef}
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
          className="text-center mb-6"
        >
          <p className="font-label text-[10px] uppercase tracking-[0.45em] text-gold/60 mb-5">
            Acesso Premium
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-text leading-none mb-4">
            Arquivo Secreto
          </h1>
          <div className="h-px w-16 bg-gold/30 mx-auto my-6" />
          <p className="font-body text-base text-text/45 max-w-lg mx-auto leading-relaxed">
            Três câmaras. Cada uma com um propósito diferente —
            mas todas apontando para o que o sistema prefere que você não saiba.
          </p>
        </div>

        {/* Contador de seções */}
        <div
          style={{
            opacity: headerVisible ? 1 : 0,
            transition: "opacity 0.7s ease 0.4s",
          }}
          className="flex items-center justify-center gap-8 mt-10 mb-16"
        >
          {[
            { n: "01", label: "Artigos" },
            { n: "02", label: "Livraria" },
            { n: "03", label: "O Original" },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-3">
              {i > 0 && <span className="text-gold/15 text-xs" aria-hidden>·</span>}
              <span className="font-label text-[8px] uppercase tracking-widest text-gold/35">
                {n} · {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Grade de 3 seções ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

          {/* Card 1 — Artigos Premium */}
          <SectionCard
            href="/livraria/artigos"
            badge="01 · Conteúdo Premium"
            delay={0}
            icon={
              <svg className="w-6 h-6 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            }
            title="Artigos"
            subtitle="Scriptorium · Estudos & Análises"
            description="Artigos aprofundados sobre profecias, geopolítica escatológica, tecnologia e controle — conteúdo que não cabe no feed e não seria publicado em outro lugar."
            tags={["Profecias", "Geopolítica", "Escatologia", "Tecnologia", "Igreja & Poder"]}
          />

          {/* Card 2 — Livraria (fechada) */}
          <SectionCard
            href="/livraria/livros"
            badge="02 · Recursos & Livros"
            delay={120}
            locked={true}
            icon={
              <svg className="w-6 h-6 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            }
            title="Livraria"
            subtitle="Acervo Digital · Em Preparação"
            description="Livros, guias e recursos digitais selecionados — materiais raros que complementam o que é estudado no Arquivo. Em preparação."
            tags={["Livros Digitais", "Guias", "Recursos", "Acervo"]}
          />

          {/* Card 3 — O Original */}
          <SectionCard
            href="/livraria/o-original"
            badge="03 · Exegese & Origens"
            delay={240}
            icon={
              <svg className="w-6 h-6 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            }
            title="O Original"
            subtitle="Hebraico · Grego · História"
            description="A Bíblia como era lida antes das traduções e das doutrinas institucionais. Exegese investigativa, palavras originais e o que a história pensava — aplicado aos dias de hoje."
            tags={["Exegese", "Hebraico", "Grego", "Doutrinas", "História"]}
          />
        </div>

        {/* Nota de rodapé */}
        <div
          className="mt-16 flex items-center gap-6"
          aria-hidden
        >
          <div className="h-px flex-1 bg-gold/8" />
          <span className="font-label text-[8px] uppercase tracking-[0.4em] text-gold/20">
            Arquivo Secreto · Voz do Deserto
          </span>
          <div className="h-px flex-1 bg-gold/8" />
        </div>
      </section>
    </main>
  );
}
