"use client";

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

export default function ArquivoSecretoCTA() {
  return (
    <div className="arquivo-secreto-cta relative overflow-hidden my-12 border border-gold/30 bg-[#0e0b07] p-8 md:p-10">
      {/* Sweep de luz — passa da esquerda p/ direita em loop */}
      <div className="arquivo-sweep absolute inset-y-0 w-1/3 pointer-events-none" aria-hidden />

      {/* Conteúdo */}
      <div className="relative z-10">

        {/* Badge */}
        <p className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/50 mb-5">
          ✦ &nbsp; Acesso Exclusivo &nbsp; ✦
        </p>

        {/* Cabeçalho principal */}
        <p className="font-display text-xl text-text/85 leading-snug mb-1">
          Isso é apenas a superfície.
        </p>
        <p className="font-body text-sm text-muted/60 leading-relaxed mb-6">
          O que não pode ficar no blog vai para o app.
        </p>

        {/* "Na continuação..." com seta animada */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-label text-[10px] uppercase tracking-widest text-gold/70">
            Na continuação, exploramos
          </span>
          <span className="animate-arrow-bounce text-gold text-base leading-none" aria-hidden>
            →
          </span>
        </div>

        {/* Pontos em lista — capitalizados, com símbolo dourado */}
        <ul className="space-y-2.5 mb-8 pl-0 list-none">
          {[
            "A origem oculta do evento e seus desdobramentos reais",
            "O que os grandes meios de comunicação preferiram ignorar",
            "Como isso se conecta ao cenário profético atual",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="text-gold/45 mt-[3px] text-[10px] shrink-0 leading-none">◆</span>
              <span className="font-body text-sm text-text/55 leading-relaxed">{item}.</span>
            </li>
          ))}
        </ul>

        {/* Botão CTA */}
        <Link
          href="/livraria#newsletter"
          className="arquivo-btn inline-flex items-center gap-2 font-label text-[10px] uppercase tracking-widest border border-gold/50 px-7 py-3.5 text-gold hover:bg-gold hover:text-bg hover:border-gold transition-all duration-300"
        >
          <LockIcon className="w-4 h-4 text-gold/80" />
          Quero ser avisado
          <span className="animate-arrow-bounce" aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
