import { getAllStudies } from "@/lib/studies";
import Sidebar from "@/app/components/Sidebar";
import EstudosClient from "./EstudosClient";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}): Promise<Metadata> {
  const { cat } = await searchParams;
  return {
    title: cat
      ? `${cat} — Voz do Deserto`
      : "Estudos Bíblicos — Voz do Deserto",
    description: cat
      ? `Estudos da categoria ${cat} no blog Voz do Deserto.`
      : "Todos os estudos bíblicos profundos do blog Voz do Deserto.",
  };
}

export default async function EstudosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const allStudies = getAllStudies();
  const filtered = cat
    ? allStudies.filter((s) => s.category === cat)
    : allStudies;

  return (
    <main>
      {/* Cabeçalho da página */}
      <div className="border-b border-gold/10 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
            Arquivo
          </p>
          <h1 className="font-display text-4xl text-text md:text-5xl">
            {cat ? cat : "Estudos Bíblicos"}
          </h1>
          {cat && (
            <p className="font-label text-[9px] text-muted mt-3 uppercase tracking-widest">
              {filtered.length}{" "}
              {filtered.length === 1 ? "estudo" : "estudos"}
            </p>
          )}
        </div>
      </div>

      {/* Conteúdo — busca + paginação gerenciados pelo client component */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <EstudosClient studies={filtered} />
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
