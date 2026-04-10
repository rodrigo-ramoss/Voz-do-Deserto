import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllEbooks } from "@/lib/ebooks";

export const metadata: Metadata = {
  title: "Livraria — Voz do Deserto",
  description:
    "Trilogia O Mapa Antes da Tempestade — leitura gratuita e completa no próprio site. Geopolítica, ciclos históricos e preparação para o interregno.",
};

export default function EbooksPage() {
  const ebooks = getAllEbooks();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* ── Hero da livraria ── */}
      <section className="relative overflow-hidden border-b border-[#1e1e1e]">
        {/* Gradiente decorativo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(180,130,60,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
          {/* Badge */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b4823c]/30 bg-[#b4823c]/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-[#d4a855] uppercase">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Trilogia Completa · Leitura Gratuita
          </span>

          <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-[#f0e6d3] md:text-5xl">
            O Mapa Antes da<br />
            <span className="text-[#d4a855]">Tempestade</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#8a8a7a]">
            Uma trilogia para quem sente que o mundo está mudando — e quer
            entender o porquê antes que a próxima página da história vire.
          </p>

          {/* Decoração de prateleira */}
          <div className="mt-10 flex items-center justify-center gap-3 opacity-40">
            <div className="h-px w-16 bg-[#b4823c]" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#b4823c">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <div className="h-px w-16 bg-[#b4823c]" />
          </div>
        </div>
      </section>

      {/* ── Prateleira de livros ── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {ebooks.map((ebook) => (
            <Link
              key={ebook.slug}
              href={`/livraria/ebooks/${ebook.slug}`}
              className="group relative flex flex-col"
              aria-label={`Ler: ${ebook.title}`}
            >
              {/* Capa do livro */}
              <div className="relative mb-5 overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 group-hover:-translate-y-2">
                {/* Efeito de lombada */}
                <div
                  aria-hidden
                  className="absolute bottom-0 left-0 top-0 w-4 rounded-l-lg"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                  }}
                />
                {/* Brilho na capa */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
                  }}
                />

                <Image
                  src={ebook.image}
                  alt={`Capa: ${ebook.title}`}
                  width={400}
                  height={560}
                  className="aspect-[400/560] w-full object-cover"
                  priority={ebook.volume === 1}
                />

                {/* Badge do volume */}
                <div className="absolute right-3 top-3 rounded-full bg-[#0a0a0a]/80 px-2.5 py-1 text-xs font-bold tracking-wider text-[#d4a855] backdrop-blur-sm">
                  VOL. {ebook.volume}
                </div>
              </div>

              {/* Info do livro */}
              <div className="flex flex-1 flex-col">
                <p className="mb-1 text-xs font-semibold tracking-widest text-[#b4823c] uppercase">
                  {ebook.trilogy}
                </p>
                <h2 className="mb-1 font-serif text-lg font-bold leading-snug text-[#f0e6d3] transition-colors group-hover:text-[#d4a855]">
                  {ebook.title}
                </h2>
                <p className="mb-3 text-sm text-[#6b6b5e] italic">
                  {ebook.subtitle}
                </p>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-[#8a8a7a]">
                  {ebook.description}
                </p>

                {/* Rodapé do card */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-[#5a5a4e]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-[#b4823c]/60"
                    >
                      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm.5 14.5h-1v-6h1v6zm0-8h-1V7h1v1.5z" />
                    </svg>
                    {ebook.readTime} de leitura
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#d4a855] transition-gap group-hover:gap-2">
                    Ler agora
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Chamada para a trilogia ── */}
      <section className="border-t border-[#1e1e1e] bg-[#0d0d0d]">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-[#b4823c] uppercase">
            Por que ler em ordem?
          </p>
          <h3 className="mb-4 font-serif text-2xl font-bold text-[#f0e6d3]">
            Cada volume aprofunda o anterior
          </h3>
          <p className="text-[#8a8a7a] leading-relaxed">
            O Vol. 1 entrega o mapa do presente. O Vol. 2 revela que o presente
            já aconteceu antes. O Vol. 3 transforma tudo isso em ação concreta.
            Lidos juntos, formam um sistema completo de leitura do nosso tempo.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {ebooks.map((e) => (
              <Link
                key={e.slug}
                href={`/livraria/ebooks/${e.slug}`}
                className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#141414] px-5 py-2.5 text-sm text-[#c8c8b8] transition-colors hover:border-[#b4823c]/40 hover:text-[#d4a855]"
              >
                <span className="text-[#b4823c] font-bold">Vol. {e.volume}</span>
                <span className="truncate max-w-[140px]">{e.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
