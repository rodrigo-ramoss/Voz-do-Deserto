"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/*
 * BookstoreTeaser — carrossel "Em Breve" da Livraria Digital
 * ─────────────────────────────────────────────────────────────────────────
 * • Capas de e-books com blur + overlay "em breve"
 * • Marquee infinito (reusa a animação .animate-marquee do globals.css)
 * • Hover: blur reduz levemente para "teaser" da capa
 * • Fundo com grid sutil estilo papel milimetrado digital
 * ─────────────────────────────────────────────────────────────────────────
 */

const EBOOKS = [
  {
    slug: "babel-2",
    title: "Babel 2.0",
    subtitle: "A Coordenação Total das Máquinas e o Fim do Controle Humano",
    cover: "/ebooks/babel-2.jpg",
  },
  {
    slug: "cinco-textos",
    title: "Cinco Textos que a Igreja Não Leu em Voz Alta",
    subtitle: "Exegese histórica sem filtro institucional",
    cover: "/ebooks/cinco-textos.jpg",
  },
  {
    slug: "imagem-que-respira",
    title: "A Imagem que Respira",
    subtitle: "Inteligência Artificial, Apocalipse 13 e a Transferência dos Atributos Divinos",
    cover: "/ebooks/imagem-que-respira.jpg",
  },
];

// Duplica para o marquee ser contínuo sem gap
const SLIDES = [...EBOOKS, ...EBOOKS, ...EBOOKS];

export default function BookstoreTeaser() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bookstore-teaser relative overflow-hidden border-t border-b border-gold/10 py-16">

      {/* Grade digital de fundo */}
      <div className="bookstore-grid-bg absolute inset-0 pointer-events-none" aria-hidden />

      {/* Gradientes laterais que "cortam" o carrossel */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bookstore-fade-left" aria-hidden />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bookstore-fade-right" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-6">

        {/* ── Cabeçalho ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-gold/30" />
            <span className="font-label text-[9px] uppercase tracking-[0.35em] text-gold/60 border border-gold/20 px-2.5 py-1">
              Em Breve
            </span>
            <span className="h-px w-8 bg-gold/30" />
          </div>

          <h2 className="font-display text-3xl text-text mb-3 md:text-4xl">
            Livraria Digital
          </h2>
          <p className="font-body text-base text-muted/70 max-w-lg mx-auto leading-relaxed">
            E-books aprofundados sobre os temas que o sistema prefere que você ignore.
            Acesse quando estiver pronto.
          </p>
        </div>
      </div>

      {/* ── Carrossel de capas ── */}
      <div className="relative overflow-hidden mt-2 mb-10">
        {/* A faixa duplicada 3× garante loop sem pular */}
        <div
          ref={trackRef}
          className="animate-marquee flex gap-6 items-end"
          aria-label="E-books em desenvolvimento"
        >
          {SLIDES.map((book, i) => (
            <div
              key={`${book.slug}-${i}`}
              className="ebook-card shrink-0 relative"
              aria-hidden={i >= EBOOKS.length}
            >
              {/* Capa com blur */}
              <div className="ebook-cover-wrap relative overflow-hidden border border-gold/15">
                {/* Fallback placeholder caso a imagem ainda não exista */}
                <div className="ebook-placeholder absolute inset-0 bg-gradient-to-b from-gold/[0.06] to-ember/[0.04] flex items-center justify-center">
                  <span className="font-display text-4xl text-gold/10 select-none">✦</span>
                </div>

                <Image
                  src={book.cover}
                  alt={book.title}
                  width={180}
                  height={270}
                  className="ebook-cover-img relative z-[1] object-cover w-[180px] h-[270px]"
                  onError={() => {}} // silencia erro enquanto imagem não existe
                />

                {/* Overlay gradiente base */}
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-bg/60 via-bg/10 to-transparent pointer-events-none" />

                {/* Badge "Em breve" sobre a capa */}
                <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none">
                  <span className="ebook-coming-soon font-label text-[9px] uppercase tracking-[0.3em] text-gold/80 border border-gold/30 bg-bg/70 backdrop-blur-sm px-2.5 py-1">
                    Em breve
                  </span>
                </div>
              </div>

              {/* Título abaixo da capa */}
              <div className="mt-3 w-[180px]">
                <p className="font-display text-xs leading-snug text-text/50 line-clamp-2 text-center">
                  {book.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="relative z-10 text-center">
        <Link
          href="#newsletter"
          className="inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest border border-gold/30 px-6 py-3 text-gold/70 hover:border-gold hover:text-gold transition-all duration-200"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-ember/50">›</span>
          Quero ser avisado quando lançar
        </Link>
      </div>

    </section>
  );
}
