"use client";

import { useEffect, useState, useCallback } from "react";
import ShareButtons from "@/app/components/ShareButtons";
import NewsletterForm from "@/app/components/NewsletterForm";
import AuthorCard from "@/app/components/AuthorCard";
import LoginModal from "@/app/components/LoginModal";

const LOCAL_EMAIL_KEY = "vzd_last_email";
const LOCAL_MONTHLY_KEY = "vzd_plan_monthly";
const COOKIE_NAME = "vzd_plan";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (!part) continue;
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = decodeURIComponent(part.slice(0, eq));
    if (k !== name) continue;
    return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const maxAge = Math.max(0, Math.floor(days * 24 * 60 * 60));
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

interface Props {
  previewHtml: string;
  contentHtml: string;
  price?: string;
  paymentUrl?: string;
  title: string;
  canonicalUrl: string;
  slug?: string;
}

type AccessState = "checking" | "granted" | "denied";

export default function ScriptoriumContent({
  previewHtml,
  contentHtml,
  price,
  title,
  canonicalUrl,
  slug,
}: Props) {
  const [access, setAccess] = useState<AccessState>("checking");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const checkAccess = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const plan = (params.get("plan") ?? "").toLowerCase();
    const markedAsMonthly =
      plan === "mensal" ||
      plan === "monthly" ||
      params.get("mensal") === "1" ||
      params.get("monthly") === "1";

    if (markedAsMonthly) {
      try { localStorage.setItem(LOCAL_MONTHLY_KEY, "1"); } catch {}
      setCookie(COOKIE_NAME, "monthly", 30);
      setAccess("granted");
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    if (getCookie(COOKIE_NAME) === "monthly") {
      setAccess("granted");
      return;
    }

    try {
      if (localStorage.getItem(LOCAL_MONTHLY_KEY) === "1") {
        setCookie(COOKIE_NAME, "monthly", 30);
        setAccess("granted");
        return;
      }
    } catch {}

    let email = "";
    try { email = (localStorage.getItem(LOCAL_EMAIL_KEY) ?? "").trim().toLowerCase(); } catch {}

    if (email) {
      try {
        const res = await fetch("/api/plano-mensal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = (await res.json().catch(() => ({}))) as { isMonthly?: boolean };
        if (data.isMonthly) {
          try { localStorage.setItem(LOCAL_MONTHLY_KEY, "1"); } catch {}
          setCookie(COOKIE_NAME, "monthly", 30);
          setAccess("granted");
          return;
        }
      } catch {}
    }

    setAccess("denied");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAccess();
  }, [checkAccess]);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      let savedEmail = "";
      try { savedEmail = localStorage.getItem(LOCAL_EMAIL_KEY) ?? ""; } catch {}

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: savedEmail, slug: slug ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutLoading(false);
    }
  }

  function handleAccessGranted() {
    setShowLoginModal(false);
    setAccess("granted");
  }

  if (access === "checking") {
    return (
      <div className="py-24 flex justify-center">
        <span className="font-label text-[9px] uppercase tracking-widest text-gold/40 animate-pulse">
          Verificando acesso…
        </span>
      </div>
    );
  }

  if (access === "granted") {
    return (
      <>
        <div className="mb-8 border border-gold/20 bg-gold/5 px-4 py-3 flex items-center gap-3">
          <span className="text-gold text-sm" aria-hidden>✦</span>
          <p className="font-label text-[9px] uppercase tracking-widest text-gold">
            Scriptorium · Acesso de assinante
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

  return (
    <>
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onAccessGranted={handleAccessGranted}
        />
      )}

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

      <div className="mt-0 border border-gold/20 bg-card px-8 py-10 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-gold/60" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
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
          Este artigo faz parte do Scriptorium — disponível para assinantes mensais.
          Acesse todos os estudos premium por um valor único mensal.
        </p>

        {price && (
          <p className="font-display text-3xl text-gold mb-6">{price}</p>
        )}

        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          className="inline-block bg-gold text-bg font-label text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold/90 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {checkoutLoading ? "Redirecionando…" : "Assinar o Scriptorium →"}
        </button>

        <div className="mt-5">
          <button
            onClick={() => setShowLoginModal(true)}
            className="font-label text-[9px] uppercase tracking-widest text-muted/60 hover:text-gold transition-colors underline underline-offset-4"
          >
            Já sou assinante — acessar com meu e-mail
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gold/10">
          <p className="font-label text-[8px] uppercase tracking-widest text-muted/60">
            Pagamento seguro via Stripe · Cancele quando quiser
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
