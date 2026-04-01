import Link from "next/link";
import Image from "next/image";
import type { ScriptoriumMeta } from "@/lib/scriptorium";
import { formatDateSmart } from "@/lib/utils";

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 10V7.8a4.5 4.5 0 0 1 9 0V10"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 10h11a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}

export default function ArquivoSecretoSection({
  premium,
}: {
  premium: ScriptoriumMeta[];
}) {
  if (!premium.length) return null;

  return (
    <section className="border-b border-gold/10">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/55 mb-3">
              Conteúdo premium
            </p>
            <h2 className="font-display text-3xl text-text leading-tight">
              Arquivo Secreto
            </h2>
            <p className="font-body text-sm leading-relaxed text-muted mt-3">
              Conteúdo exclusivo, sem censura editorial — artigos premium,
              análises e conexões que não cabem no feed.
            </p>

            <div className="mt-5 flex items-center gap-2 flex-wrap">
              {["Conteúdo exclusivo", "Sem censura", "Artigos premium"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="font-label text-[9px] uppercase tracking-widest border border-gold/15 bg-gold/5 px-2.5 py-1 text-gold/70"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>

          <Link
            href="/livraria"
            className="font-label text-[10px] uppercase tracking-widest border border-gold/45 px-6 min-h-[44px] inline-flex items-center text-gold hover:bg-gold hover:text-bg transition-colors"
          >
            Ver o Arquivo Secreto →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {premium.map((article) => (
            <Link
              key={article.slug}
              href={`/livraria/scriptorium/${article.slug}`}
              className="group border border-gold/10 bg-card transition-colors duration-200 hover:border-gold/25 overflow-hidden"
              aria-label={`Assinante Premium — ${article.title}`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-card">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover blur-[2px] brightness-[0.70] scale-[1.03] transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.10] via-transparent to-ember/[0.06] flex items-center justify-center">
                    <span className="font-display text-5xl text-gold/[0.08] select-none">
                      ✦
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/10 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-2 border border-gold/35 bg-[#0a0806]/70 px-2.5 py-1">
                  <LockIcon className="w-3.5 h-3.5 text-gold" />
                  <span className="font-label text-[9px] uppercase tracking-widest text-gold/90">
                    Assinante premium
                  </span>
                </div>
              </div>

              <div className="p-5">
                <p className="font-label text-[9px] uppercase tracking-[0.22em] text-muted/80">
                  {formatDateSmart(article.date, "short")}
                </p>
                <h3 className="font-display text-lg leading-snug text-text mt-2 group-hover:text-gold transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="font-body text-sm leading-relaxed text-muted mt-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-gold/8 flex items-center justify-between gap-3">
                  <span className="font-label text-[9px] uppercase tracking-widest text-subtle">
                    Conteúdo bloqueado
                  </span>
                  <span className="font-label text-[10px] uppercase tracking-widest text-gold/70 group-hover:text-gold transition-colors">
                    Abrir →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

