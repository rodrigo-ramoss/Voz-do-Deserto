"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
  const pathname = usePathname();

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

      {/* ── Desktop: 3 colunas (nav esq | logo centro | nav dir) ───── */}
      <div className="hidden md:grid grid-cols-3 items-center max-w-6xl mx-auto px-6 py-4">

        {/* Esquerda */}
        <nav className="flex items-center gap-8" aria-label="Navegação esquerda">
          {leftLinks.map(({ label, href }) => navLink(label, href))}
        </nav>

        {/* Centro — logo */}
        <Link
          href="/"
          className="flex justify-center items-center group"
          aria-label="Voz do Deserto — página inicial"
        >
          <Image
            src="/logo.svg"
            alt="Voz do Deserto"
            width={240}
            height={48}
            className="h-12 w-auto transition-opacity duration-200 group-hover:opacity-75"
            priority
          />
        </Link>

        {/* Direita */}
        <nav className="flex items-center justify-end gap-8" aria-label="Navegação direita">
          {rightLinks.map(({ label, href }) => navLink(label, href))}
        </nav>
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
            width={200}
            height={40}
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
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="border-t border-gold/10 bg-bg/98 px-6 pb-2"
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
          </div>
        </nav>
      </div>
    </header>
  );
}
