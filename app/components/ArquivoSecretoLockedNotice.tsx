import Link from "next/link";
import Newsletter from "./Newsletter";

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

export default function ArquivoSecretoLockedNotice({
  variant = "section",
}: {
  variant?: "section" | "page";
}) {
  const content = (
    <>
      <p className="premium-text-glow font-label text-[9px] uppercase tracking-[0.4em] mb-3 text-gold/75">
        Em breve
      </p>

      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center border border-gold/20 bg-gold/5">
          <LockIcon className="h-5 w-5 text-gold/70" />
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-text leading-tight">
          Arquivo Secreto — app Êxodo
        </h1>
      </div>

      <div className="mt-4 space-y-3 max-w-3xl">
        <p className="font-body text-sm leading-relaxed text-muted">
          Há conteúdos que não cabem no blog: análises que seriam censuradas,
          conexões que a narrativa oficial não quer que você veja.
        </p>
        <p className="font-body text-sm leading-relaxed text-muted">
          Por isso, o Arquivo Secreto está sendo preparado dentro do{" "}
          <span className="text-gold/80 font-semibold">app Êxodo</span> — um
          ambiente próprio, fora do alcance das plataformas, para publicar o
          que não pode ficar exposto aqui.
        </p>
        <p className="font-body text-sm leading-relaxed text-muted">
          O app está quase pronto. Entre na lista para ser o primeiro a saber
          quando abrir.
        </p>
      </div>
    </>
  );

  if (variant === "page") {
    return (
      <main className="min-h-[70vh]">
        <section className="border-b border-gold/10 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(800px 260px at 20% 0%, rgba(212,183,106,0.10), transparent 60%), radial-gradient(700px 260px at 80% 10%, rgba(196,124,58,0.10), transparent 60%)",
            }}
          />

          <div className="mx-auto max-w-6xl px-6 pt-12 pb-12 relative">
            {content}

            <div className="mt-7 flex items-center gap-3 flex-wrap">
              <a
                href="#newsletter"
                className="font-label text-[10px] uppercase tracking-widest border border-gold px-6 min-h-[44px] inline-flex items-center text-gold hover:bg-gold hover:text-bg transition-colors"
              >
                Quero ser avisado
              </a>
              <Link
                href="/"
                className="font-label text-[10px] uppercase tracking-widest text-muted hover:text-gold transition-colors min-h-[44px] inline-flex items-center"
              >
                Voltar ao site →
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6" aria-hidden>
              <div className="h-px w-16 bg-gold/15" />
              <span className="text-xs text-gold/25">✦</span>
              <div className="h-px w-16 bg-gold/15" />
            </div>
          </div>
        </section>

        <section className="border-t border-gold/10">
          <div id="newsletter" className="mx-auto max-w-4xl px-6 py-14">
            <Newsletter />
          </div>
        </section>
      </main>
    );
  }

  return (
    <section className="border-b border-gold/10">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {content}

        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <Link
            href="/livraria#newsletter"
            className="font-label text-[10px] uppercase tracking-widest border border-gold/45 px-6 min-h-[44px] inline-flex items-center text-gold hover:bg-gold hover:text-bg transition-colors"
          >
            Quero ser avisado →
          </Link>
          <Link
            href="/estudos"
            className="font-label text-[10px] uppercase tracking-widest text-muted hover:text-gold transition-colors min-h-[44px] inline-flex items-center"
          >
            Explorar estudos →
          </Link>
        </div>
      </div>
    </section>
  );
}
