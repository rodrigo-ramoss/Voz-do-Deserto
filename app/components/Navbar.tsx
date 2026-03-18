"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { label: "Estudos", href: "/estudos" },
  { label: "Categorias", href: "/categorias" },
  { label: "Livraria", href: "/livraria" },
  { label: "Sobre", href: "/sobre" },
];

/*
 * LEGIBILIDADE (T2) + ACESSIBILIDADE (T1 WCAG)
 * ─────────────────────────────────────────────────────────────────────────
 * Desktop: text-sm (14px) — era text-[11px] (11px), abaixo do mínimo legível
 * Mobile drawer: text-base (16px) — mínimo WCAG para toque confortável
 * Hambúrguer: min-h-[44px] min-w-[44px] — área de toque WCAG 2.5.5 AA
 * Itens do drawer: py-4 (48px de área vertical) — toque sem erro
 * aria-controls + aria-expanded + aria-current: mantidos de versão anterior
 * ─────────────────────────────────────────────────────────────────────────
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo + nome do site */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Voz do Deserto — página inicial"
        >
          {!logoError && (
            <div className="relative w-9 h-9 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.webp"
                alt="Voz do Deserto"
                onError={() => setLogoError(true)}
                className="w-full h-full object-contain transition-opacity duration-200 group-hover:opacity-80"
              />
            </div>
          )}
          <span className="font-display text-xl tracking-wide text-gold leading-none">
            Voz do Deserto
          </span>
        </Link>

        {/* Navegação desktop
            text-sm (14px) — era text-[11px], tornava os itens quase invisíveis.
            text-muted = #B8A98A (contraste 8.6:1) sem qualquer opacity redutora. */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navegação principal"
        >
          {links.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`font-label text-sm uppercase tracking-widest transition-colors duration-200 ${
                  isActive
                    ? "text-gold"
                    : "text-muted hover:text-gold"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Hambúrguer — min-h/w 44px para área de toque WCAG 2.5.5 */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] gap-1.5 md:hidden"
        >
          <span
            className={`block h-px w-5 bg-muted transition-all duration-300 ${
              open ? "rotate-45 translate-y-[5px]" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-muted transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-muted transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-[5px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu mobile colapsável
          text-base (16px) — mínimo legível e confortável em mobile.
          py-4 por link → área de toque ≥ 44px (WCAG 2.5.5 ✓).
          text-muted = #B8A98A sem opacity → contraste 8.6:1 ✓           */}
      <div
        id="mobile-nav-menu"
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="border-t border-gold/10 bg-bg/98 px-6 pb-2"
          aria-label="Menu mobile"
        >
          <div className="flex flex-col">
            {links.map(({ label, href }) => {
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
          </div>
        </nav>
      </div>
    </header>
  );
}
