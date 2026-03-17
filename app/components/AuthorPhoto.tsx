"use client";

import { useState } from "react";

interface AuthorPhotoProps {
  /** "md" = tamanho padrão (página Sobre) | "sm" = compacto (AuthorCard nos artigos) */
  size?: "md" | "sm";
}

export default function AuthorPhoto({ size = "md" }: AuthorPhotoProps) {
  const [error, setError] = useState(false);

  const cls =
    size === "sm"
      ? "w-16 h-16 shrink-0 overflow-hidden border border-gold/15"
      : "w-32 h-32 sm:w-40 sm:h-40 shrink-0 overflow-hidden border border-gold/15 mx-auto sm:mx-0";

  const fallbackCls =
    size === "sm"
      ? "w-16 h-16 shrink-0 border border-gold/15 bg-card flex items-center justify-center"
      : "w-32 h-32 sm:w-40 sm:h-40 shrink-0 border border-gold/15 bg-card flex items-center justify-center mx-auto sm:mx-0";

  if (error) {
    return (
      <div className={fallbackCls}>
        <span className={`font-display text-gold/30 ${size === "sm" ? "text-xl" : "text-3xl"}`}>
          R
        </span>
      </div>
    );
  }

  return (
    <div className={cls}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/rodrigo.webp"
        alt="Rodrigo Ramos — Voz do Deserto"
        onError={() => setError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
