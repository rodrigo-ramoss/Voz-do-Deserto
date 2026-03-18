"use client";

import { useState, type FormEvent } from "react";

/*
 * ACESSIBILIDADE — NewsletterForm
 * ─────────────────────────────────────────────────────────────────────────
 * • Cada <input> tem um <label> vinculado via htmlFor/id — obrigatório
 *   para leitores de tela (WCAG 1.3.1, 2.4.6).
 * • Os <input> NÃO usam `focus:outline-none`: a regra global
 *   `input:focus-visible { box-shadow: 0 0 0 2px #c9a84c }` em globals.css
 *   provê um indicador de foco dourado suficiente (WCAG 2.4.7).
 * • Status "loading" desabilita o botão via `disabled` e reduz opacidade,
 *   comunicando o estado visualmente e para AT.
 * • A mensagem de erro usa role="alert" para ser anunciada imediatamente
 *   por leitores de tela sem precisar de foco explícito.
 * ─────────────────────────────────────────────────────────────────────────
 */

interface NewsletterFormProps {
  /** "article" usa layout compacto inline; "page" usa layout expandido */
  context?: "article" | "page" | "footer";
}

export default function NewsletterForm({
  context = "article",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Erro na inscrição");
      } else {
        // Simulação frontend-only quando endpoint não está configurado
        await new Promise((r) => setTimeout(r, 800));
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      /* role="status" anuncia a confirmação para leitores de tela */
      <div
        role="status"
        aria-live="polite"
        className="border border-gold/20 bg-card p-6 text-center"
      >
        <p className="font-display text-lg text-gold mb-2" aria-hidden>✦</p>
        <p className="font-display text-base text-text/80">
          Obrigado! Você será notificado em breve.
        </p>
        <p className="font-label text-[9px] uppercase tracking-widest text-muted/50 mt-2">
          {email || "E-mail registrado"}
        </p>
      </div>
    );
  }

  if (context === "footer") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
        <label htmlFor="newsletter-footer" className="sr-only">
          Seu e-mail
        </label>
        <input
          id="newsletter-footer"
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          /*
           * SEM focus:outline-none.
           * O ring dourado de globals.css (input:focus-visible) é o indicador
           * de foco para teclado. A transição de border reforça visualmente.
           */
          className="flex-1 min-w-48 bg-bg border border-gold/15 px-4 py-2.5 font-body text-sm text-text/80 placeholder:text-muted/40 focus:border-gold/40 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Inscrever-se na newsletter"
          className="font-label text-[9px] uppercase tracking-widest border border-gold px-5 py-2.5 text-gold hover:bg-gold hover:text-bg transition-all duration-200 disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Quero receber"}
        </button>
        {status === "error" && (
          /* role="alert" anuncia o erro imediatamente para leitores de tela */
          <p role="alert" className="w-full font-label text-[8px] text-ember/70 mt-1">
            Erro ao cadastrar. Tente novamente.
          </p>
        )}
      </form>
    );
  }

  // Contexto "article" ou "page"
  return (
    <div className="border border-gold/15 bg-card p-6 md:p-8">
      <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-3">
        Não perca nenhum estudo
      </p>
      <p className="font-display text-xl text-text mb-2">
        Receba os próximos estudos no seu e-mail
      </p>
      <p className="font-body text-sm text-text/50 leading-relaxed mb-5">
        Sem spam. Apenas novos estudos publicados — apócrifos, exegese,
        história da Igreja. Cancele quando quiser.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">
        <label htmlFor="newsletter-article" className="sr-only">
          Seu e-mail
        </label>
        <input
          id="newsletter-article"
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          /*
           * SEM focus:outline-none.
           * globals.css injeta `box-shadow: 0 0 0 2px #c9a84c` em :focus-visible,
           * provendo indicador dourado com contraste ≈8.5:1 (WCAG AA ✓).
           */
          className="flex-1 min-w-56 bg-bg border border-gold/15 px-4 py-3 font-body text-sm text-text/80 placeholder:text-muted/40 focus:border-gold/40 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Inscrever-se na newsletter"
          className="font-label text-[10px] uppercase tracking-widest border border-gold px-6 py-3 text-gold hover:bg-gold hover:text-bg transition-all duration-200 disabled:opacity-50"
        >
          {status === "loading" ? "Enviando…" : "Quero receber"}
        </button>
      </form>

      {status === "error" && (
        /* role="alert" garante anúncio imediato pelo leitor de tela */
        <p role="alert" className="mt-2 font-label text-[8px] uppercase tracking-widest text-ember/70">
          Erro ao cadastrar. Tente novamente.
        </p>
      )}
    </div>
  );
}
