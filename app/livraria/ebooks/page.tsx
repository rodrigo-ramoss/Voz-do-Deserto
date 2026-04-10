import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getEbooksByTrilogy } from "@/lib/ebooks";
import {
  ContinueReadingBanner,
  EbookProgressBadge,
} from "./EbookProgressBadge";

export const metadata: Metadata = {
  title: "Livraria — Voz do Deserto",
  description:
    "Trilogias completas para leitura gratuita no próprio site. Geopolítica, ciclos históricos e preparação para o interregno.",
};

export default function EbooksPage() {
  const trilogies = getEbooksByTrilogy();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[#1e1e1e]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(180,130,60,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b4823c]/30 bg-[#b4823c]/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-[#d4a855] uppercase">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Leitura Gratuita · Direto no Site
          </span>
          <h1 className="mb-3 font-serif text-4xl font-bold text-[#f0e6d3] md:text-5xl">
            Livraria
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[#6b6b5e]">
            Trilogias completas para quem quer entender o tempo em que vive —
            sem precisar baixar nada.
          </p>
        </div>
      </section>

      {/* ── Banner "continuar leitura" (client) ── */}
      <div className="mx-auto max-w-5xl px-6 pt-10">
        <ContinueReadingBanner />
      </div>

      {/* ── Blocos por trilogia ── */}
      <div className="mx-auto max-w-5xl px-6 pb-20 space-y-16">
        {trilogies.map(({ trilogy, ebooks }) => (
          <section key={trilogy.name} className="group/trilogy">
            {/* Cabeçalho da trilogia */}
            <div className="mb-8 flex flex-col gap-3 border-b border-[#1e1e1e] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold tracking-widest text-[#b4823c] uppercase">
                  Trilogia
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#f0e6d3] md:text-3xl">
                  {trilogy.name}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6b6b5e]">
                  {trilogy.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-[#2a2a2a] px-3 py-1 text-xs text-[#4a4a42]">
                {ebooks.length} {ebooks.length === 1 ? "volume" : "volumes"}
              </span>
            </div>

            {/* Grade dos volumes */}
            <div
              className={`grid gap-6 ${
                ebooks.length === 1
                  ? "grid-cols-1 max-w-xs"
                  : ebooks.length === 2
                  ? "grid-cols-2 max-w-sm"
                  : "grid-cols-3"
              }`}
            >
              {ebooks.map((ebook) => (
                <Link
                  key={ebook.slug}
                  href={`/livraria/ebooks/${ebook.slug}`}
                  className="group flex flex-col"
                  aria-label={`Ler: ${ebook.title}`}
                >
                  {/* Capa */}
                  <div className="relative mb-4 overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 group-hover:-translate-y-1.5">
                    {/* Lombada */}
                    <div
                      aria-hidden
                      className="absolute bottom-0 left-0 top-0 z-10 w-3 rounded-l-lg"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 70%, transparent 100%)",
                      }}
                    />
                    {/* Brilho no hover */}
                    <div
                      aria-hidden
                      className="absolute inset-0 z-10 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)",
                      }}
                    />
                    <Image
                      src={ebook.image}
                      alt={`Capa: ${ebook.title}`}
                      width={320}
                      height={448}
                      className="aspect-[320/448] w-full object-cover"
                      priority={ebook.volume === 1}
                    />
                    {/* Badge do volume */}
                    <div className="absolute right-2 top-2 z-20 rounded-full bg-[#0a0a0a]/80 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#d4a855] backdrop-blur-sm">
                      VOL. {ebook.volume}
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="mb-0.5 font-serif text-sm font-bold leading-snug text-[#e8dcc8] transition-colors group-hover:text-[#d4a855] md:text-base">
                    {ebook.title}
                  </h3>
                  <p className="mb-2 text-xs italic text-[#5a5a4e] leading-snug">
                    {ebook.subtitle}
                  </p>

                  {/* Tempo + badge de progresso */}
                  <div className="mt-auto flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-[#4a4a42]">
                      {ebook.readTime}
                    </span>
                    {/* Client: mostra % lido se houver */}
                    <EbookProgressBadge slug={ebook.slug} />
                  </div>
                </Link>
              ))}
            </div>

            {/* Ler a trilogia em sequência */}
            {ebooks.length > 1 && (
              <div className="mt-6 flex items-center gap-2">
                <Link
                  href={`/livraria/ebooks/${ebooks[0].slug}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#141414] px-4 py-2 text-xs text-[#8a8a7a] transition-colors hover:border-[#b4823c]/30 hover:text-[#d4a855]"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Começar pelo Vol. 1
                </Link>
                <span className="text-[10px] text-[#3a3a32]">
                  · leia em ordem para melhor experiência
                </span>
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
