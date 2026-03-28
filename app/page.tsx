import Link from "next/link";
import { getAllStudies } from "@/lib/studies";
import { getAllNoticias } from "@/lib/noticias";
import ArticleCard from "./components/ArticleCard";
import Sidebar from "./components/Sidebar";
import WeeklyCarousel from "./components/WeeklyCarousel";
import NoticiasCarousel from "./components/NoticiasCarousel";
import BookstoreTeaser from "./components/BookstoreTeaser";
import Newsletter from "./components/Newsletter";

// Garante dados frescos a cada requisição (necessário para rotação semanal)
export const dynamic = "force-dynamic";

export default function Home() {
  const studies = getAllStudies();
  const noticias = getAllNoticias();

  // Destaques da Semana: artigos publicados nos últimos 7 dias
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const thisWeek = studies.filter((s) => new Date(s.date) >= sevenDaysAgo);
  // Fallback: se nenhum artigo foi publicado nesta semana, usa os 10 mais recentes
  const weeklySlides = thisWeek.length > 0 ? thisWeek.slice(0, 10) : studies.slice(0, 10);
  const isWeeklyMode = thisWeek.length > 0;

  // Estudos Mais Lidos: rotação semanal — seleciona 6 artigos diferentes a cada semana
  const nonWeekly = studies.filter((s) => !weeklySlides.find((w) => w.slug === s.slug));
  const weekNumber = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
  const offset = nonWeekly.length > 6 ? weekNumber % (nonWeekly.length - 5) : 0;
  const mostRead = nonWeekly.length > 0
    ? [...nonWeekly.slice(offset), ...nonWeekly.slice(0, offset)].slice(0, 6)
    : [];

  return (
    <>
      {noticias.length > 0 && <NoticiasCarousel noticias={noticias} />}
      <WeeklyCarousel studies={weeklySlides} isWeeklyMode={isWeeklyMode} />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Article grid */}
          <div>
            <div className="mb-8 flex items-center gap-4">
              <h2 className="font-label text-[10px] uppercase tracking-[0.25em] text-gold">
                Estudos mais lidos
              </h2>
              <div className="h-px flex-1 bg-gold/15" />
              <Link
                href="/estudos"
                className="font-label text-[9px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
              >
                Ver todos →
              </Link>
            </div>

            {mostRead.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {mostRead.map((study, i) => (
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

      <BookstoreTeaser />
      
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Newsletter />
      </div>
    </>
  );
}
