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
        className="border border-gold/20 bg-card p-7 md:p-9 text-center relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(700px 220px at 50% -10%, rgba(212,183,106,0.12), transparent 60%)",
          }}
        />
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
    <div className="border border-gold/18 bg-card p-7 md:p-9 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(700px 240px at 20% 0%, rgba(212,183,106,0.12), transparent 60%), radial-gradient(600px 240px at 85% 10%, rgba(196,124,58,0.10), transparent 60%)",
        }}
      />

      <div className="relative">
        <p className="font-label text-[9px] uppercase tracking-[0.4em] text-gold/70 mb-3">
          Newsletter
        </p>
        <p className="font-display text-2xl text-text leading-snug mb-2">
          Receba o que o algoritmo não entrega.
        </p>
        <p className="font-body text-sm text-muted leading-relaxed mb-5 max-w-2xl">
          Uma curadoria direta: notícias, destaques e avisos do Arquivo Secreto —
          no seu e-mail, sem ruído e sem dependência de feed.
        </p>

        <div className="flex items-center gap-2 flex-wrap mb-6">
          {["1–2 e-mails/semana", "Sem spam", "Cancelamento em 1 clique"].map(
            (chip) => (
              <span
                key={chip}
                className="font-label text-[9px] uppercase tracking-widest border border-gold/12 bg-gold/5 px-2.5 py-1 text-gold/70"
              >
                {chip}
              </span>
            )
          )}
        </div>

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
            className="flex-1 bg-bg border border-gold/15 px-4 py-3.5 font-body text-sm text-text/85 placeholder:text-muted/40 focus:border-gold/40 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            aria-label="Inscrever-se na newsletter"
            className="whitespace-nowrap font-label text-[10px] uppercase tracking-widest border border-gold px-7 min-h-[48px] inline-flex items-center justify-center text-gold hover:bg-gold hover:text-bg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Enviando…" : "Quero receber"}
          </button>
        </form>

        {status === "error" && (
          <p role="alert" className="mt-3 font-label text-[9px] uppercase tracking-widest text-ember/75">
            Ocorreu um erro ao cadastrar seu e-mail. Tente novamente.
          </p>
        )}

        <p className="mt-4 font-label text-[9px] uppercase tracking-widest text-subtle">
          Privacidade: seu e-mail não é compartilhado.
        </p>
      </div>
    </div>
  );
}
