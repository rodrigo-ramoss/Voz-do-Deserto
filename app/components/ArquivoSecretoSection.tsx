import Link from "next/link";
import Image from "next/image";
import type { ScriptoriumMeta } from "@/lib/scriptorium";

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

function PremiumMarqueeRow({
  premium,
  reverse,
  durationMs,
}: {
  premium: ScriptoriumMeta[];
  reverse?: boolean;
  durationMs: number;
}) {
  const items = premium.length <= 1 ? premium : [...premium, ...premium];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent"
        aria-hidden
      />

      <div
        className={[
          "flex w-max gap-4 py-1",
          "animate-marquee motion-reduce:animate-none",
          reverse ? "animate-marquee-reverse" : "",
        ].join(" ")}
        style={{ animationDuration: `${durationMs}ms` }}
      >
        {items.map((article, idx) => (
          <Link
            key={`${article.slug}-${idx}`}
            href={`/livraria/scriptorium/${article.slug}`}
            className="group shrink-0 w-[190px] sm:w-[210px] lg:w-[220px] border border-gold/10 bg-card/60 hover:bg-gold/[0.03] hover:border-gold/30 transition-colors overflow-hidden"
            aria-label={`Conteúdo premium — ${article.title}`}
          >
            <div className="relative h-[92px] bg-[#0b0907]">
              {article.image ? (
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="220px"
                  className="object-cover brightness-[0.75] saturate-[0.90] scale-[1.02] transition-transform duration-700 group-hover:scale-[1.05]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.10] via-transparent to-ember/[0.06] flex items-center justify-center">
                  <span className="font-display text-4xl text-gold/[0.10] select-none">
                    ✦
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/10 to-transparent" />

              <div className="absolute left-3 top-3 flex items-center gap-2 border border-gold/30 bg-[#0a0806]/70 px-2 py-1">
                <LockIcon className="w-3.5 h-3.5 text-gold" />
                <span className="font-label text-[8px] uppercase tracking-widest text-gold/90">
                  Premium
                </span>
              </div>
            </div>

            <div className="p-3">
              <p className="font-label text-[8px] uppercase tracking-[0.22em] text-muted/70 line-clamp-1">
                {article.category}
              </p>
              <h3 className="font-display text-[14px] leading-snug text-text mt-1 line-clamp-2 group-hover:text-gold transition-colors">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
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
            <p className="premium-text-glow font-label text-[9px] uppercase tracking-[0.4em] mb-3">
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

        <div className="mt-10 space-y-5">
          <PremiumMarqueeRow premium={premium} durationMs={32000} />
          <PremiumMarqueeRow premium={premium} durationMs={36000} reverse />
        </div>
      </div>
    </section>
  );
}

