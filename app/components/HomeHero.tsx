import Link from "next/link";

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

export default function HomeHero() {
  return (
    <section className="border-b border-gold/10 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(800px 260px at 20% 0%, rgba(212,183,106,0.10), transparent 60%), radial-gradient(700px 260px at 80% 10%, rgba(196,124,58,0.10), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-10 pb-8 md:pt-12 md:pb-10 relative">
        <h1 className="font-display text-4xl leading-tight text-text md:text-5xl">
          Profecia no tempo do algoritmo.
        </h1>

        <p className="font-body text-lg leading-relaxed text-muted/90 max-w-2xl mt-4">
          Tecnologia, geopolítica e o sistema religioso lidos à luz do texto —
          com fontes verificáveis e exegese responsável, sem agenda institucional.
        </p>

        <div className="mt-7 flex items-center gap-3 flex-wrap">
          <Link
            href="/noticias"
            className="font-label text-[10px] uppercase tracking-widest border border-ember/35 bg-ember/5 px-6 min-h-[44px] inline-flex items-center text-ember hover:border-ember/60 hover:bg-ember/10 transition-colors"
          >
            Ver notícias
          </Link>
          <Link
            href="/estudos"
            className="font-label text-[10px] uppercase tracking-widest border border-gold/45 px-6 min-h-[44px] inline-flex items-center text-gold hover:bg-gold hover:text-bg transition-colors"
          >
            Explorar estudos
          </Link>
          <Link
            href="/livraria"
            className="font-label text-[10px] uppercase tracking-widest text-muted hover:text-gold transition-colors min-h-[44px] inline-flex items-center"
          >
            <LockIcon className="w-4 h-4 mr-2 text-gold/50" />
            Arquivo secreto (em breve) →
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-6" aria-hidden>
          <div className="h-px w-16 bg-gold/15" />
          <span className="text-xs text-gold/25">✦</span>
          <div className="h-px w-16 bg-gold/15" />
        </div>
      </div>
    </section>
  );
}

