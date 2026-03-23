import Link from "next/link";
import { getAllStudies } from "@/lib/studies";
import { getAllNoticias } from "@/lib/noticias";
import ArticleCard from "./components/ArticleCard";
import Sidebar from "./components/Sidebar";
import WeeklyCarousel from "./components/WeeklyCarousel";
import NoticiasCarousel from "./components/NoticiasCarousel";

export default function Home() {
  const studies = getAllStudies();
  const noticias = getAllNoticias();
  const weeklySlides = studies.slice(0, 10);
  const rest = studies.slice(10, 16);

  return (
    <>
      {noticias.length > 0 && <NoticiasCarousel noticias={noticias} />}
      <WeeklyCarousel studies={weeklySlides} />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Article grid */}
          <div>
            <div className="mb-8 flex items-center gap-4">
              <h2 className="font-label text-[10px] uppercase tracking-[0.25em] text-gold">
                Estudos recentes
              </h2>
              <div className="h-px flex-1 bg-gold/15" />
              <Link
                href="/estudos"
                className="font-label text-[9px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
              >
                Ver todos →
              </Link>
            </div>

            {rest.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((study, i) => (
                  <ArticleCard key={study.slug} study={study} index={i} />
                ))}
              </div>
            ) : (
              <div className="border border-gold/10 bg-card p-10 text-center">
                <p className="font-display text-xl text-gold/25 mb-3">✦</p>
                <p className="font-body text-text/30 text-sm">
                  Novos estudos em breve.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar excludeSlug={weeklySlides[0]?.slug} />
        </div>
      </div>
    </>
  );
}
