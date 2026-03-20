"use client";

import { useState, useEffect, type FormEvent } from "react";

const STORAGE_KEY = "vzd_popup_dismissed";

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Não mostra se já dispensado ou inscrito
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    let shown = false;

    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
      window.removeEventListener("scroll", onScroll);
    };

    // Mostra após 8 segundos OU quando rolar 45% da página
    const timer = setTimeout(show, 8000);

    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total > 0.45) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const ep = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;
      if (ep) {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error();
      } else {
        await new Promise((r) => setTimeout(r, 800));
      }
      setStatus("success");
      setEmail("");
      setTimeout(dismiss, 3000);
    } catch {
      setStatus("error");
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-bg/75 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-card border border-gold/20 p-8 shadow-2xl">
        {/* Botão fechar (X) */}
        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute top-3 right-4 font-label text-lg text-muted/40 hover:text-gold transition-colors leading-none"
        >
          ×
        </button>

        {status === "success" ? (
          <div role="status" aria-live="polite" className="text-center py-6">
            <p className="font-display text-2xl text-gold mb-2" aria-hidden>✦</p>
            <p className="font-display text-lg text-text/90">Você está dentro.</p>
            <p className="font-label text-[9px] uppercase tracking-widest text-muted/50 mt-3">
              Próxima análise chega direto no seu e-mail
            </p>
          </div>
        ) : (
          <>
            <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-4">
              Fique um passo à frente
            </p>

            <p className="font-display text-xl text-text leading-snug mb-3">
              Receba as próximas análises antes que o algoritmo decida se você pode ler
            </p>

            <p className="font-body text-xs text-muted/60 leading-relaxed mb-5">
              Algoritmos censuram. Plataformas derrubam. Garanta acesso direto.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label htmlFor="popup-newsletter-email" className="sr-only">
                Seu e-mail
              </label>
              <input
                id="popup-newsletter-email"
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg border border-gold/15 px-4 py-3 font-body text-sm text-text/80 placeholder:text-muted/40 focus:border-gold/40 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="font-label text-[10px] uppercase tracking-widest border border-gold px-6 py-3 text-gold hover:bg-gold hover:text-bg transition-all duration-200 disabled:opacity-50"
              >
                {status === "loading" ? "Enviando…" : "Quero receber"}
              </button>

              {status === "error" && (
                <p role="alert" className="font-label text-[8px] uppercase tracking-widest text-ember/70">
                  Erro ao cadastrar. Tente novamente.
                </p>
              )}
            </form>

            <button
              onClick={dismiss}
              className="mt-5 w-full font-label text-[8px] uppercase tracking-widest text-muted/30 hover:text-muted/60 transition-colors text-center"
            >
              Agora não
            </button>
          </>
        )}
      </div>
    </div>
  );
}
