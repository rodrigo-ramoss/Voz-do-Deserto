"use client";

import { useEffect, useState, type ReactNode } from "react";

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

export default function NonMonthlyOnly({ children }: { children: ReactNode }) {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);

  useEffect(() => {
    const decide = (value: boolean) => {
      queueMicrotask(() => setShouldShow(value));
    };

    // Permite que um fluxo de checkout marque o usuário como mensal ao voltar.
    // Exemplos:
    // - /livraria?plan=mensal
    // - /livraria?monthly=1
    const params = new URLSearchParams(window.location.search);
    const plan = (params.get("plan") ?? "").toLowerCase();
    const markedAsMonthly =
      plan === "mensal" ||
      plan === "monthly" ||
      params.get("mensal") === "1" ||
      params.get("monthly") === "1";

    if (markedAsMonthly) {
      try {
        localStorage.setItem(LOCAL_MONTHLY_KEY, "1");
      } catch {}
      setCookie(COOKIE_NAME, "monthly", 365);
    }

    if (getCookie(COOKIE_NAME) === "monthly") {
      decide(false);
      return;
    }

    try {
      if (localStorage.getItem(LOCAL_MONTHLY_KEY) === "1") {
        decide(false);
        return;
      }
    } catch {}

    let email = "";
    try {
      email = (localStorage.getItem(LOCAL_EMAIL_KEY) ?? "").trim().toLowerCase();
    } catch {}

    if (!email) {
      // Sem e-mail salvo, não há como checar no servidor: mostra a caixa.
      decide(true);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/plano-mensal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const payload = (await res.json().catch(() => ({}))) as { isMonthly?: boolean };
        if (payload?.isMonthly) {
          try {
            localStorage.setItem(LOCAL_MONTHLY_KEY, "1");
          } catch {}
          setCookie(COOKIE_NAME, "monthly", 365);
          setShouldShow(false);
          return;
        }
      } catch {}

      setShouldShow(true);
    })();
  }, []);

  // Se estamos checando, evita "flash" da caixa para quem já é mensal.
  if (shouldShow === null) return null;
  if (!shouldShow) return null;
  return <>{children}</>;
}
