"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import LoginModal from "./LoginModal";

const leftLinks = [
  { label: "Estudos", href: "/estudos" },
  { label: "Categorias", href: "/categorias" },
];

const rightLinks = [
  { label: "Arquivo Secreto", href: "/livraria" },
  { label: "Sobre", href: "/sobre" },
];

const allLinks = [...leftLinks, ...rightLinks];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const cookie = document.cookie.match(/(?:^|; )vzd_plan=([^;]*)/);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(cookie?.[1] === "monthly");
  }, [pathname]);

  const navLink = (label: string, href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        key={href}
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`font-label text-sm uppercase tracking-widest transition-colors duration-200 whitespace-nowrap ${
          isActive ? "text-gold" : "text-muted hover:text-gold"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-bg/95 backdrop-blur-sm">

      {/* ── Desktop: 3 colunas auto (nav esq | logo centro | ações dir) ── */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center max-w-6xl mx-auto px-6 py-3">

        {/* Esquerda */}
        <nav className="flex items-center gap-8" aria-label="Navegação esquerda">
          {leftLinks.map(({ label, href }) => navLink(label, href))}
          {rightLinks.map(({ label, href }) => navLink(label, href))}
        </nav>

        {/* Centro — logo */}
        <Link
          href="/"
          className="flex justify-center items-center group px-6"
          aria-label="Voz do Deserto — página inicial"
        >
          <Image
            src="/logo.svg"
            alt="Voz do Deserto"
            width={393}
            height={48}
            className="h-12 w-auto transition-opacity duration-200 group-hover:opacity-75"
            priority
          />
        </Link>

        {/* Direita — ações */}
        <div className="flex items-center justify-end gap-4">
          {/* Lupa */}
          <Link
            href="/estudos"
            aria-label="Buscar estudos"
            className="text-muted hover:text-gold transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>

          {isLoggedIn ? (
            /* Ícone de perfil quando logado */
            <Link
              href="/perfil"
              aria-label="Meu perfil"
              className="border border-gold/30 p-2 text-gold/70 hover:bg-gold/10 hover:border-gold transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          ) : (
            <>
              {/* Assinar */}
              <button
                type="button"
                onClick={() => router.push("/livraria")}
                className="font-label text-[10px] uppercase tracking-widest border border-gold/50 px-4 py-2 text-gold/80 hover:bg-gold/10 hover:border-gold transition-colors duration-200 whitespace-nowrap"
              >
                Assinar
              </button>

              {/* Entrar */}
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="font-label text-[10px] uppercase tracking-widest bg-gold/8 border border-gold/20 px-4 py-2 text-muted hover:bg-gold/15 hover:text-text transition-colors duration-200 whitespace-nowrap"
              >
                Entrar
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile: logo + hambúrguer ───────────────────────────────── */}
      <div className="flex md:hidden items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Voz do Deserto — página inicial"
          className="group"
        >
          <Image
            src="/logo.svg"
            alt="Voz do Deserto"
            width={262}
            height={32}
            className="h-10 w-auto transition-opacity duration-200 group-hover:opacity-75"
            priority
          />
        </Link>

        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] gap-1.5"
        >
          <span className={`block h-px w-5 bg-muted transition-all duration-300 ${open ? "rotate-45 translate-y-[5px]" : ""}`} />
          <span className={`block h-px w-5 bg-muted transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-muted transition-all duration-300 ${open ? "-rotate-45 -translate-y-[5px]" : ""}`} />
        </button>
      </div>

      {/* ── Menu mobile colapsável ──────────────────────────────────── */}
      <div
        id="mobile-nav-menu"
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="border-t border-gold/10 bg-bg/98 px-6 pb-4"
          aria-label="Menu mobile"
        >
          <div className="flex flex-col">
            {allLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-label text-base uppercase tracking-widest py-4 border-b border-gold/8 last:border-0 transition-colors duration-200 ${
                    isActive ? "text-gold" : "text-muted hover:text-gold"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {/* Ações mobile */}
            <div className="flex items-center gap-3 pt-4">
              {isLoggedIn ? (
                <Link
                  href="/perfil"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center font-label text-[10px] uppercase tracking-widest border border-gold/50 py-3 text-gold/80 hover:bg-gold/10 transition-colors duration-200"
                >
                  Meu Perfil
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); router.push("/livraria"); }}
                    className="flex-1 font-label text-[10px] uppercase tracking-widest border border-gold/50 py-3 text-gold/80 hover:bg-gold/10 transition-colors duration-200"
                  >
                    Assinar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setShowLogin(true); }}
                    className="flex-1 font-label text-[10px] uppercase tracking-widest bg-gold/8 border border-gold/20 py-3 text-muted hover:bg-gold/15 transition-colors duration-200"
                  >
                    Entrar
                  </button>
                </>
              )}
              <Link
                href="/estudos"
                onClick={() => setOpen(false)}
                aria-label="Buscar"
                className="border border-gold/20 p-3 text-muted hover:text-gold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </Link>
            </div>
          </div>
        </nav>
      </div>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onAccessGranted={() => {
            setShowLogin(false);
            router.push("/livraria");
          }}
        />
      )}
    </header>
  );
}
