"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ShareButtons from "@/app/components/ShareButtons";
import NewsletterForm from "@/app/components/NewsletterForm";
import AuthorCard from "@/app/components/AuthorCard";

interface Props {
  previewHtml: string;
  contentHtml: string;
  price?: string;
  paymentUrl?: string;
  title: string;
  canonicalUrl: string;
}

export default function ScriptoriumContent({
  previewHtml,
  contentHtml,
  price,
  paymentUrl,
  title,
  canonicalUrl,
}: Props) {
  // TEMPORÁRIO — artigos abertos para lançamento do blog
  // Para bloquear novamente: trocar true por false abaixo
  const [isOwner, setIsOwner] = useState(true);

  useEffect(() => {
    // const params = new URLSearchParams(window.location.search);
    // const key = params.get("key") ?? "";
    // setIsOwner(key === "ramos-vozz");
  }, []);

  if (isOwner) {
    /* ── MODO PROPRIETÁRIO ─────────────────────────────────────── */
    return (
      <>
        {/* Banner discreto */}
        <div className="mb-8 border border-gold/20 bg-gold/5 px-4 py-3 flex items-center gap-3">
          <span className="text-gold text-sm" aria-hidden>✦</span>
          <p className="font-label text-[9px] uppercase tracking-widest text-gold">
            Modo proprietário — artigo completo visível apenas para você
          </p>
        </div>

        <article
          className="prose-study"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <AuthorCard />
        <ShareButtons title={title} url={canonicalUrl} />

        <div className="mt-14">
          <NewsletterForm context="article" />
        </div>
      </>
    );
  }

  /* ── MODO VISITANTE — preview + paywall ────────────────────── */
  return (
    <>
      {/* Preview com fade */}
      <div className="relative">
        <article
          className="prose-study"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, var(--color-bg, #0a0804) 100%)",
          }}
          aria-hidden
        />
      </div>

      {/* Paywall */}
      <div className="mt-0 border border-gold/20 bg-card px-8 py-10 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gold/60"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-3">
          Scriptorium · Conteúdo exclusivo
        </p>

        <h2 className="font-display text-2xl text-text mb-3 max-w-md mx-auto leading-snug">
          Continue lendo este estudo
        </h2>

        <p className="font-body text-sm text-text/50 leading-relaxed mb-6 max-w-sm mx-auto">
          Este artigo faz parte do Scriptorium — estudos aprofundados
          disponíveis mediante acesso único, sem assinatura recorrente.
        </p>

        {price && (
          <p className="font-display text-3xl text-gold mb-6">{price}</p>
        )}

        <a
          href={paymentUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gold text-bg font-label text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold/90 transition-colors duration-200"
        >
          Acessar estudo completo →
        </a>

        <div className="mt-8 pt-6 border-t border-gold/10">
          <p className="font-label text-[8px] uppercase tracking-widest text-muted/60">
            Pagamento seguro · Acesso imediato após confirmação
          </p>
        </div>
      </div>

      <div className="mt-14">
        <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-4 text-center">
          Ou fique de graça por enquanto
        </p>
        <NewsletterForm context="article" />
      </div>
    </>
  );
}
