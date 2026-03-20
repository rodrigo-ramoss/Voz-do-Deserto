"use client";

import Link from "next/link";

export default function ArquivoSecretoCTA() {
  return (
    <div className="arquivo-secreto-cta relative overflow-hidden my-12 border border-gold/30 bg-[#0e0b07] p-8 md:p-10">
      {/* Sweep de luz — passa da esquerda p/ direita em loop */}
      <div className="arquivo-sweep absolute inset-y-0 w-1/3 pointer-events-none" aria-hidden />

      {/* Conteúdo */}
      <div className="relative z-10">
        <p className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/50 mb-5">
          ✦ &nbsp; Acesso Exclusivo &nbsp; ✦
        </p>

        <p className="font-display text-lg text-text/70 leading-snug mb-2">
          Isso é apenas a superfície.
        </p>

        <p className="font-body text-sm text-muted/65 leading-relaxed mb-7">
          Continuação desta análise disponível apenas para os membros do Arquivo Secreto.
        </p>

        <Link
          href="/livraria"
          className="arquivo-btn inline-block font-label text-[10px] uppercase tracking-widest border border-gold/50 px-7 py-3.5 text-gold hover:bg-gold hover:text-bg hover:border-gold transition-all duration-300"
        >
          Acessar o Arquivo Secreto →
        </Link>
      </div>
    </div>
  );
}
