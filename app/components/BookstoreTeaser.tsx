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
    description: "O que acontece quando as máquinas param de falar entre si em linguagem humana? A resposta é mais próxima do que você imagina.",
    cover: "/ebooks/babel-2.jpg",
  },
  {
    slug: "cinco-textos",
    title: "Cinco Textos que a Igreja Não Leu em Voz Alta",
    subtitle: "Exegese histórica sem filtro institucional",
    description: "Cinco passagens que mudaram o curso da teologia — e que as denominações preferiram guardar no fundo da gaveta.",
    cover: "/ebooks/cinco-textos.jpg",
  },
  {
    slug: "imagem-que-respira",
    title: "A Imagem que Respira",
    subtitle: "Inteligência Artificial, Apocalipse 13 e a Transferência dos Atributos Divinos",
    description: "A besta do Apocalipse não chega com chifres. Chega com interface amigável e 99,9% de uptime.",
    cover: "/ebooks/imagem-que-respira.jpg",
  },
  {
    slug: "teatro-das-sombras",
    title: "O Teatro das Sombras",
    subtitle: "A Anatomia das Pandemias Planejadas",
    description: "Quem escreveu o roteiro? Quem pagou pelos atores? E por que a plateia nunca recebe o programa completo?",
    cover: "/ebooks/teatro-das-sombras-voz-do-deserto.png",
  },
  {
    slug: "o-eixo-da-virada",
    title: "O Eixo da Virada",
    subtitle: "Manual de Soberania e Resiliência para a Nova Ordem Global",
    description: "Enquanto o sistema se reorganiza, quem entende o mapa não precisa pedir permissão para atravessar a fronteira.",
    cover: "/ebooks/o-eixo-da-virada.png",
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
          <p className="font-body text-base text-muted/70 max-w-xl mx-auto leading-relaxed">
            E-books escritos sobre o que o Google preferia que ficasse enterrado.
            Conteúdo que não passa em revisão editorial, não recebe patrocínio e
            não foi feito para agradar o algoritmo — só para quem está pronto para ler.
          </p>
          <p className="font-label text-[10px] uppercase tracking-widest text-ember/50 mt-3">
            Acesso restrito — em preparação
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

              {/* Caixa digital animada abaixo da capa */}
              <div className="ebook-info-box mt-3 w-[180px] relative border border-gold/20 px-3 py-2.5">
                {/* Cantos decorativos */}
                <span className="ebook-corner ebook-corner-tl" aria-hidden />
                <span className="ebook-corner ebook-corner-tr" aria-hidden />
                <span className="ebook-corner ebook-corner-bl" aria-hidden />
                <span className="ebook-corner ebook-corner-br" aria-hidden />
                {/* Título */}
                <p className="font-display text-[11px] leading-snug text-text/70 line-clamp-2 text-center mb-1.5">
                  {book.title}
                </p>
                {/* Separador */}
                <div className="h-px w-8 bg-gold/20 mx-auto mb-1.5" />
                {/* Descrição */}
                <p className="font-body text-[10px] leading-relaxed text-text/35 text-center line-clamp-3">
                  {book.description}
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
