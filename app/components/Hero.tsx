function Ornament({ opacity = "30" }: { opacity?: string }) {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className={`h-px w-24 bg-gold/${opacity}`} />
      <span className={`text-sm text-gold/${opacity}`}>✦</span>
      <div className={`h-px w-24 bg-gold/${opacity}`} />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative px-6 py-28 text-center">
      <Ornament opacity="25" />

      <p className="mt-12 font-label text-[11px] uppercase tracking-[0.3em] text-gold/60">
        Estudos Bíblicos
      </p>

      <h1 className="mx-auto mt-8 max-w-4xl font-display text-5xl leading-[1.05] tracking-tight text-text md:text-7xl lg:text-8xl">
        O que o templo
        <br />
        <em className="text-gold not-italic">nunca te disse</em>
      </h1>

      <p className="mx-auto mt-8 max-w-xl font-body text-xl leading-relaxed text-text/65 md:text-2xl">
        Estudos bíblicos profundos para cristãos despertos e buscadores da
        verdade.
      </p>

      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="#estudos"
          className="font-label text-[11px] uppercase tracking-widest border border-gold px-8 py-3.5 text-gold transition-all duration-200 hover:bg-gold hover:text-bg"
        >
          Explorar estudos
        </a>
        <a
          href="#sobre"
          className="font-label text-[11px] uppercase tracking-widest border border-text/20 px-8 py-3.5 text-text/50 transition-all duration-200 hover:border-gold/30 hover:text-text/80"
        >
          Sobre o projeto
        </a>
      </div>

      <div className="mt-16">
        <Ornament opacity="15" />
      </div>
    </section>
  );
}
