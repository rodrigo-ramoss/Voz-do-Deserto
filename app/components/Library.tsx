export default function Library() {
  return (
    <section className="border-t border-gold/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-4">
          <span className="font-label text-[11px] uppercase tracking-[0.25em] text-gold">
            Biblioteca
          </span>
          <div className="h-px flex-1 bg-gold/15" />
        </div>

        <div className="relative overflow-hidden border border-gold/10 bg-card px-8 py-16 text-center">
          {/* Decorative watermark */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          >
            <span className="font-display text-[18rem] leading-none text-gold/[0.025]">
              ✦
            </span>
          </div>

          <div className="relative">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-gold/50 border border-gold/20 px-3 py-1 inline-block mb-10">
              Em breve
            </span>

            <h2 className="font-display text-4xl text-text mb-6 md:text-5xl">
              Biblioteca
            </h2>

            <p className="font-body text-lg leading-relaxed text-text/50 mx-auto max-w-md mb-4">
              Uma coleção curada de textos primários, comentários históricos e
              recursos para o estudo aprofundado das Escrituras.
            </p>

            <p className="font-label text-[10px] uppercase tracking-widest text-muted">
              Em desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
