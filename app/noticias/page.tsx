import { getAllNoticias } from "@/lib/noticias";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { formatDateSmart } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notícias — Voz do Deserto",
  description:
    "Notícias e análises do mundo além dos muros — sem filtro institucional.",
};

export default function NoticiasPage() {
  const noticias = getAllNoticias();

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="animate-blink w-1.5 h-1.5 rounded-full bg-ember/70 shrink-0" />
        <p className="font-label text-[11px] uppercase tracking-[0.25em] text-ember/80">
          Notícias
        </p>
      </div>
      <h1 className="font-display text-4xl text-text mb-4 md:text-5xl">
        Notícias e análises do tempo presente
      </h1>
      <div className="h-px w-16 bg-gold/30 mb-4" />
      <p className="font-body text-lg text-text/55 max-w-xl leading-relaxed mb-16">
        O que está acontecendo agora — e por que isso importa para quem quer ver além do templo.
      </p>

      {noticias.length === 0 ? (
        <div className="border border-gold/10 bg-card p-12 text-center">
          <p className="font-display text-2xl text-gold/20 mb-3" aria-hidden>✦</p>
          <p className="font-body text-text/35 text-sm">
            Nenhuma notícia publicada ainda.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <article
              key={noticia.slug}
              className="group flex flex-col border border-gold/10 bg-card transition-colors duration-300 hover:border-ember/30"
            >
              {/* Imagem de capa */}
              <Link href={`/noticias/${noticia.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-card shrink-0">
                {noticia.image ? (
                  <Image
                    src={noticia.image}
                    alt={noticia.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-gold/5 flex items-center justify-center">
                    <span className="font-display text-4xl text-ember/15 select-none">✦</span>
                  </div>
                )}
              </Link>

              {/* Conteúdo */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-label text-[8px] uppercase tracking-[0.25em] text-ember/60">
                    Notícias
                  </span>
                  {noticia.source && (
                    <>
                      <span className="text-gold/20">·</span>
                      <span className="font-label text-[8px] uppercase tracking-widest text-muted/40">
                        {noticia.source}
                      </span>
                    </>
                  )}
                </div>

                <Link href={`/noticias/${noticia.slug}`} className="block mb-3">
                  <h2 className="font-display text-lg leading-snug text-text transition-colors duration-200 group-hover:text-gold">
                    {noticia.title}
                  </h2>
                </Link>

                {noticia.excerpt && (
                  <p className="font-body text-sm leading-relaxed text-text/50 flex-1 mb-5 line-clamp-3">
                    {noticia.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-gold/10 pt-4 mt-auto">
                  <Link
                    href={`/noticias/${noticia.slug}`}
                    className="font-label text-[10px] uppercase tracking-widest text-gold/55 transition-colors hover:text-gold"
                  >
                    Ler →
                  </Link>
                  <span className="font-label text-[10px] text-muted">
                    {formatDateSmart(noticia.date, "short")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
