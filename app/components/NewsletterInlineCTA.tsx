"use client";

import { useState, type FormEvent } from "react";

/**
 * CTA de newsletter compacto para injeção inline nos artigos de Notícias.
 * Caixa dourada animada (btnGlow), apenas campo de e-mail + botão pulsante.
 */
export default function NewsletterInlineCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
        if (!res.ok) throw new Error("Erro");
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="animate-btn-glow my-10 border border-gold/60 bg-[#100d06] px-7 py-6 text-center"
      >
        <p className="font-display text-base text-gold mb-1" aria-hidden>✦</p>
        <p className="font-display text-base text-text/80">
          Cadastrado com sucesso.
        </p>
        <p className="font-label text-[9px] uppercase tracking-widest text-muted/50 mt-1">
          Você será avisado em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-btn-glow my-10 border border-gold/50 bg-[#100d06] px-7 py-6">
      <p className="font-label text-[9px] uppercase tracking-[0.35em] text-gold/60 mb-4 text-center">
        ✦ &nbsp; Não perca o próximo artigo &nbsp; ✦
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap justify-center">
        <label htmlFor="newsletter-inline" className="sr-only">
          Seu e-mail
        </label>
        <input
          id="newsletter-inline"
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-52 bg-bg border border-gold/20 px-4 py-2.5 font-body text-sm text-text/80 placeholder:text-muted/35 focus:border-gold/50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Inscrever-se na newsletter"
          className="animate-btn-glow font-label text-[9px] uppercase tracking-widest border border-gold bg-gold/10 px-6 py-2.5 text-gold hover:bg-gold hover:text-bg transition-all duration-300 disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Receber"}
        </button>
      </form>

      {status === "error" && (
        <p role="alert" className="mt-2 font-label text-[8px] text-ember/70 text-center">
          Erro ao cadastrar. Tente novamente.
        </p>
      )}
    </div>
  );
}
