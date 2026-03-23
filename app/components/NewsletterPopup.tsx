"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";

const STORAGE_KEY = "vzd_popup_dismissed";

// ── Fases da animação de entrada ─────────────────────────────────────────────
// idle     → nada visível
// orb      → bolinha de luz no canto inferior direito voa para o centro (650ms)
// explode  → orb explode em partículas de código (400ms)
// modal    → modal revela-se com clip-path top→bottom + scan line
type Phase = "idle" | "orb" | "explode" | "modal";

// Caracteres "tecnológicos" que disparam na explosão
const CODE_CHARS = [
  "</>", "{}", "=>", "01", "//", "&&",
  "[]", "()", ">>", "fn", "∅", "null",
];

interface Particle {
  char: string;
  dx: number; // deslocamento X final em px
  dy: number; // deslocamento Y final em px
  delay: number; // ms
}

function makeParticles(): Particle[] {
  return CODE_CHARS.map((char, i) => {
    const angle = (i / CODE_CHARS.length) * Math.PI * 2;
    const dist = 90 + Math.random() * 80;
    return {
      char,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      delay: Math.random() * 80,
    };
  });
}

export default function NewsletterPopup() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Geradas uma vez por mount — estáveis durante toda a animação
  const particles = useRef<Particle[]>(makeParticles()).current;

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      window.removeEventListener("scroll", onScroll);

      setPhase("orb");                                  // fase 1: orb viaja
      setTimeout(() => setPhase("explode"), 700);       // fase 2: explosão
      setTimeout(() => setPhase("modal"),   1100);      // fase 3: modal abre
    };

    const timer = setTimeout(trigger, 8000);

    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total > 0.45) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function dismiss() {
    setPhase("idle");
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
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

  if (phase === "idle") return null;

  return (
    <>
      {/* ── FASE 1: Orb voa do canto inferior direito até o centro ── */}
      {(phase === "orb" || phase === "explode") && (
        <div
          className={`popup-orb ${
            phase === "explode" ? "popup-orb-burst" : "popup-orb-travel"
          }`}
          aria-hidden
        />
      )}

      {/* ── FASE 2: Partículas de código explodem a partir do centro ── */}
      {phase === "explode" && (
        <div
          className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
          aria-hidden
        >
          {particles.map((p, i) => (
            <span
              key={i}
              className="popup-particle font-label text-[11px] text-gold/75"
              style={{
                "--pdx": `${p.dx}px`,
                "--pdy": `${p.dy}px`,
                animationDelay: `${p.delay}ms`,
              } as React.CSSProperties}
            >
              {p.char}
            </span>
          ))}
        </div>
      )}

      {/* ── FASE 3: Modal com clip-path reveal e scan line ── */}
      {phase === "modal" && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          {/* Fundo escurecido */}
          <div
            className="absolute inset-0 bg-bg/75 backdrop-blur-sm animate-fade-in"
            onClick={dismiss}
            aria-hidden
          />

          {/* Caixa do modal */}
          <div className="relative z-10 w-full max-w-sm bg-card border border-gold/20 p-8 shadow-2xl popup-modal-reveal overflow-hidden">

            {/* Scan line que desce pela caixa ao abrir */}
            <div className="carousel-scan-line" />

            {/* Fechar */}
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
      )}
    </>
  );
}
