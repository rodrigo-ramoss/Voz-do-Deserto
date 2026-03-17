import Link from "next/link";
import { getAllStudies } from "@/lib/studies";

export default function Categories() {
  const studies = getAllStudies();
  const categories = Array.from(
    new Set(studies.map((s) => s.category).filter(Boolean))
  ).sort();

  if (categories.length === 0) return null;

  return (
    <section className="border-t border-gold/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-4">
          <span className="font-label text-[11px] uppercase tracking-[0.25em] text-gold">
            Categorias
          </span>
          <div className="h-px flex-1 bg-gold/15" />
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              href="/categorias"
              className="font-label text-[10px] uppercase tracking-[0.2em] border border-gold/20 px-4 py-2.5 text-text/45 transition-all duration-200 hover:border-gold/45 hover:text-gold"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
