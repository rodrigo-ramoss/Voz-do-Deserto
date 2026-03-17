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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo + nome */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Voz do Deserto — página inicial"
        >
          {/* Logo: mostra a imagem se /logo.webp existir, senão só o texto */}
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {links.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`font-label text-[11px] uppercase tracking-widest transition-colors duration-200 ${
                  isActive ? "text-gold" : "text-muted hover:text-gold"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle — hambúrguer animado */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="relative flex flex-col items-center justify-center w-8 h-8 gap-1.5 md:hidden"
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

      {/* Mobile drawer — animação suave */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="border-t border-gold/10 bg-bg/98 px-6 pb-6"
          aria-label="Menu mobile"
        >
          <div className="flex flex-col gap-5 pt-5">
            {links.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`font-label text-[11px] uppercase tracking-widest transition-colors duration-200 ${
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
