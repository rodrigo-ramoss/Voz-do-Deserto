"use client";

import { useState, useEffect, useRef } from "react";

const LOCAL_EMAIL_KEY = "vzd_last_email";
const LOCAL_MONTHLY_KEY = "vzd_plan_monthly";
const COOKIE_NAME = "vzd_plan";

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const maxAge = Math.max(0, Math.floor(days * 24 * 60 * 60));
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

interface Props {
  onClose: () => void;
  onAccessGranted: () => void;
}

type Step = "idle" | "loading" | "not_found" | "error";

export default function LoginModal({ onClose, onAccessGranted }: Props) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_EMAIL_KEY) ?? "";
      if (saved) setEmail(saved);
    } catch {}
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setStep("loading");

    try {
      const res = await fetch("/api/plano-mensal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        isMonthly?: boolean;
        checked?: boolean;
      };

      if (data.isMonthly) {
        try {
          localStorage.setItem(LOCAL_EMAIL_KEY, trimmed);
          localStorage.setItem(LOCAL_MONTHLY_KEY, "1");
        } catch {}
        setCookie(COOKIE_NAME, "monthly", 30);
        onAccessGranted();
        return;
      }

      if (data.checked === false) {
        setStep("error");
        return;
      }

      setStep("not_found");
    } catch {
      setStep("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md border border-gold/20 bg-card px-8 py-10">

        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-muted hover:text-gold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
        </div>

        <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-2 text-center">
          Scriptorium
        </p>

        <h2 className="font-display text-2xl text-text mb-2 text-center">
          Acesse como assinante
        </h2>

        <p className="font-body text-sm text-text/50 leading-relaxed mb-8 text-center">
          Digite o e-mail usado na sua assinatura. Vamos verificar e liberar o acesso imediatamente.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (step !== "idle") setStep("idle");
            }}
            placeholder="seu@email.com"
            required
            disabled={step === "loading"}
            className="w-full border border-gold/20 bg-transparent px-4 py-3 font-body text-sm text-text placeholder-text/30 focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
          />

          {step === "not_found" && (
            <p className="font-label text-[9px] uppercase tracking-wider text-ember/80">
              E-mail não encontrado. Verifique se é o mesmo usado na assinatura.
            </p>
          )}

          {step === "error" && (
            <p className="font-label text-[9px] uppercase tracking-wider text-ember/80">
              Não conseguimos verificar agora. Tente novamente em instantes.
            </p>
          )}

          <button
            type="submit"
            disabled={step === "loading" || !email.trim()}
            className="w-full bg-gold text-bg font-label text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === "loading" ? "Verificando..." : "Verificar acesso →"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gold/10 text-center">
          <p className="font-label text-[8px] uppercase tracking-widest text-muted/50 mb-3">
            Ainda não é assinante?
          </p>
          <button
            onClick={onClose}
            className="font-label text-[9px] uppercase tracking-widest text-gold/70 hover:text-gold transition-colors"
          >
            Ver planos de assinatura →
          </button>
        </div>
      </div>
    </div>
  );
}
