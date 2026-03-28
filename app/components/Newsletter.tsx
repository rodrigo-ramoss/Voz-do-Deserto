"use client";

import { useState, type FormEvent } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || "/api/newsletter";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (!res.ok) throw new Error("Erro na inscrição");

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
        className="border border-gold/20 bg-card p-6 md:p-8 text-center"
      >
        <p className="font-display text-xl text-gold mb-2" aria-hidden>✦</p>
        <p className="font-display text-lg text-text/80">
          Inscrição confirmada!
        </p>
        <p className="font-body text-sm text-text/50 mt-2">
          Obrigado por se juntar à nossa comunidade. Em breve você receberá nossas atualizações.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gold/15 bg-card p-6 md:p-8">
      <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-3">
        Newsletter
      </p>
      <p className="font-display text-xl text-text mb-2">
        Acompanhe de perto as novidades
      </p>
      <p className="font-body text-sm text-text/50 leading-relaxed mb-6">
        Inscreva-se com seu melhor e-mail para receber as próximas atualizações, 
        estudos e conteúdos exclusivos direto na sua caixa de entrada, 
        sem depender de algoritmos.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Seu melhor e-mail
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="seu@melhoremail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-bg border border-gold/15 px-4 py-3 font-body text-sm text-text/80 placeholder:text-muted/40 focus:border-gold/40 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Inscrever-se na newsletter"
          className="whitespace-nowrap font-label text-[10px] uppercase tracking-widest border border-gold px-6 py-3 text-gold hover:bg-gold hover:text-bg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Enviando…" : "Inscrever-se"}
        </button>
      </form>

      {status === "error" && (
        <p role="alert" className="mt-3 font-label text-[9px] uppercase tracking-widest text-ember/70">
          Ocorreu um erro ao cadastrar seu e-mail. Tente novamente.
        </p>
      )}
    </div>
  );
}
