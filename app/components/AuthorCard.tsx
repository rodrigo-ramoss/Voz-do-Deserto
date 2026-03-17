import AuthorPhoto from "./AuthorPhoto";

/**
 * Card do autor exibido ao final de cada artigo — foto, nome, bio curta e redes sociais.
 * Modelo inspirado em revistas editoriais.
 */
export default function AuthorCard() {
  return (
    <div className="mt-14 border-t border-gold/10 pt-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Foto */}
        <div className="shrink-0">
          <AuthorPhoto size="sm" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-label text-[8px] uppercase tracking-[0.3em] text-gold mb-1">
            Escrito por
          </p>
          <p className="font-display text-lg text-text mb-0.5">
            Rodrigo Ramos
          </p>
          <p className="font-label text-[8px] uppercase tracking-[0.2em] text-muted mb-3">
            Evangelista · Pesquisador · Voz do Deserto
          </p>
          <p className="font-body text-sm leading-relaxed text-text/50 mb-4 max-w-md">
            Convertido em 2016, mais de 50 cursos de teologia depois. Estuda
            apócrifos, história da Igreja e exegese do original grego e hebraico.
            Escreve para quem quer profundidade — não motivacional barato.
          </p>

          {/* Redes sociais */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://www.instagram.com/vozdodesertto?igsh=MWJjY2IxNXZqYnJnZg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram do Rodrigo Ramos — Voz do Deserto"
              className="flex items-center gap-2 border border-gold/15 px-3 py-1.5 font-label text-[8px] uppercase tracking-widest text-muted hover:text-gold hover:border-gold/40 transition-all duration-200"
            >
              {/* Instagram icon */}
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor" aria-hidden>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>

            <a
              href="https://www.tiktok.com/@rodrigoramos.vdd?_r=1&_t=ZS-94d8CIakb7x"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok do Rodrigo Ramos — Voz do Deserto"
              className="flex items-center gap-2 border border-gold/15 px-3 py-1.5 font-label text-[8px] uppercase tracking-widest text-muted hover:text-gold hover:border-gold/40 transition-all duration-200"
            >
              {/* TikTok icon */}
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
              TikTok
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
