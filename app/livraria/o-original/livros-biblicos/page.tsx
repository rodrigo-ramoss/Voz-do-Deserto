import type { Metadata } from "next";
import { getOOriginalBySpecificCategory } from "@/lib/o-original";
import LivrosBiblicosContent from "./LivrosBiblicosContent";

export const metadata: Metadata = {
  title: "Livros Bíblicos — O Original · Voz do Deserto",
  description:
    "Interpretação livro por livro — no idioma original, no contexto histórico, sem filtro de denominação.",
};

export default function LivrosBiblicosPage() {
  const articles = getOOriginalBySpecificCategory("Estudos de Livros Bíblicos");
  return <LivrosBiblicosContent articles={articles} />;
}
