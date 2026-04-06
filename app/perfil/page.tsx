"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LOCAL_EMAIL_KEY = "vzd_last_email";
const COOKIE_NAME = "vzd_plan";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type PlanData = {
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: number;
  interval: string;
};

type ProfileData = {
  name: string;
  email: string;
  plan: PlanData | null;
};

function StatusBadge({ status, cancelAtPeriodEnd }: { status: string; cancelAtPeriodEnd: boolean }) {
  if (cancelAtPeriodEnd) {
    return (
      <span className="font-label text-[9px] uppercase tracking-widest text-ember/80 border border-ember/30 px-2 py-0.5">
        Cancelamento agendado
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="font-label text-[9px] uppercase tracking-widest text-gold/80 border border-gold/30 px-2 py-0.5">
        Ativo
      </span>
    );
  }
  return (
    <span className="font-label text-[9px] uppercase tracking-widest text-muted border border-muted/30 px-2 py-0.5">
      {status}
    </span>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-6 my-12" aria-hidden>
      <div className="h-px w-16 bg-gold/15" />
      <span className="text-xs text-gold/25">✦</span>
      <div className="h-px w-16 bg-gold/15" />
    </div>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cookie = getCookie(COOKIE_NAME);
    const email = localStorage.getItem(LOCAL_EMAIL_KEY) ?? "";

    if (!cookie || cookie !== "monthly" || !email) {
      router.replace("/livraria");
      return;
    }

    fetch(`/api/perfil?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProfile(data);
        }
      })
      .catch(() => setError("Não foi possível carregar seu perfil."))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 min-h-[60vh] flex items-center justify-center">
        <p className="font-label text-[10px] uppercase tracking-widest text-muted animate-pulse">
          Carregando...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-label text-[10px] uppercase tracking-widest text-ember/70">{error}</p>
        <Link
          href="/livraria"
          className="font-label text-[9px] uppercase tracking-widest text-gold/70 hover:text-gold transition-colors"
        >
          ← Voltar ao Arquivo Secreto
        </Link>
      </main>
    );
  }

  if (!profile) return null;

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : profile.email[0].toUpperCase();

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">

      {/* Cabeçalho */}
      <p className="font-label text-[11px] uppercase tracking-[0.25em] text-gold mb-6">
        Minha conta
      </p>
      <h1 className="font-display text-4xl text-text mb-4">
        Perfil do Assinante
      </h1>
      <div className="h-px w-16 bg-gold/30 mb-12" />

      {/* Card de identidade */}
      <section className="border border-gold/15 bg-card p-8 mb-6">
        <div className="flex items-center gap-6">
          {/* Avatar com iniciais */}
          <div className="w-16 h-16 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <span className="font-display text-xl text-gold/70">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            {profile.name && (
              <h2 className="font-display text-2xl text-text mb-1 truncate">
                {profile.name}
              </h2>
            )}
            <p className="font-body text-sm text-muted truncate">{profile.email}</p>
          </div>
        </div>
      </section>

      {/* Card do plano */}
      {profile.plan ? (
        <section className="border border-gold/15 bg-card p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-gold">
              Plano atual
            </p>
            <div className="h-px flex-1 bg-gold/10" />
          </div>

          <div className="grid gap-5">
            {/* Status */}
            <div className="flex items-center justify-between">
              <p className="font-label text-[10px] uppercase tracking-widest text-muted">Status</p>
              <StatusBadge
                status={profile.plan.status}
                cancelAtPeriodEnd={profile.plan.cancelAtPeriodEnd}
              />
            </div>

            {/* Tipo */}
            <div className="flex items-center justify-between">
              <p className="font-label text-[10px] uppercase tracking-widest text-muted">Plano</p>
              <p className="font-label text-[10px] uppercase tracking-widest text-text">
                Arquivo Secreto — {profile.plan.interval === "month" ? "Mensal" : "Anual"}
              </p>
            </div>

            {/* Renovação ou encerramento */}
            <div className="flex items-center justify-between">
              <p className="font-label text-[10px] uppercase tracking-widest text-muted">
                {profile.plan.cancelAtPeriodEnd ? "Acesso até" : "Próxima renovação"}
              </p>
              <p className="font-label text-[10px] uppercase tracking-widest text-text">
                {formatDate(profile.plan.currentPeriodEnd)}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="border border-gold/10 bg-card p-8 mb-6 text-center">
          <p className="font-body text-sm text-muted">Nenhuma assinatura ativa encontrada.</p>
        </section>
      )}

      <Ornament />

      {/* Ações */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/livraria"
          className="flex-1 text-center font-label text-[10px] uppercase tracking-widest border border-gold/50 px-6 py-4 text-gold/80 hover:bg-gold/10 hover:border-gold transition-colors duration-200"
        >
          Acessar Arquivo Secreto →
        </Link>
        <button
          type="button"
          onClick={() => {
            document.cookie = "vzd_plan=; Path=/; Max-Age=0";
            localStorage.removeItem("vzd_last_email");
            localStorage.removeItem("vzd_plan_monthly");
            router.push("/");
          }}
          className="flex-1 text-center font-label text-[10px] uppercase tracking-widest border border-muted/20 px-6 py-4 text-muted hover:border-muted/40 hover:text-text/60 transition-colors duration-200"
        >
          Sair da conta
        </button>
      </div>

    </main>
  );
}
