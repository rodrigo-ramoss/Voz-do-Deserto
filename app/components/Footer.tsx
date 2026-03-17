import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-gold/10">

      {/* Newsletter section */}
      <div className="border-b border-gold/8 px-6 py-12">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-label text-[9px] uppercase tracking-[0.3em] text-gold mb-3">
              Newsletter
            </p>
            <p className="font-display text-xl text-text mb-2">
              Novos estudos no seu e-mail
            </p>
            <p className="font-body text-sm text-text/45 leading-relaxed">
              Sem spam. Apenas os estudos publicados — apócrifos, exegese,
              história da Igreja.
            </p>
          </div>
          <NewsletterForm context="footer" />
        </div>
      </div>

      {/* Footer base */}
      <div className="px-6 py-10">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <p className="font-display text-lg text-gold mb-1">Voz do Deserto</p>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-muted">
              Estudos bíblicos profundos
            </p>
          </div>

          <nav className="flex items-center gap-6" aria-label="Links do rodapé">
            {[
              { label: "Estudos", href: "/estudos" },
              { label: "Categorias", href: "/categorias" },
              { label: "Livraria", href: "/livraria" },
              { label: "Sobre", href: "/sobre" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="font-label text-[9px] uppercase tracking-widest text-muted/50 hover:text-gold transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="font-label text-[10px] uppercase tracking-widest text-muted/45">
            © 2026 — Todos os direitos reservados
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="h-px w-16 bg-gold/10" />
          <span className="text-xs text-gold/20">✦</span>
          <div className="h-px w-16 bg-gold/10" />
        </div>
      </div>
    </footer>
  );
}
