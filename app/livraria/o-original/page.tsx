import type { Metadata } from "next";
import { getAllOOriginal } from "@/lib/o-original";
import OOriginalContent from "./OOriginalContent";

export const metadata: Metadata = {
  title: "O Original — Arquivo Secreto · Voz do Deserto",
  description:
    "Exegese investigativa voltada às fontes — hebraico, grego, história. A Bíblia como era lida antes das traduções e das doutrinas institucionais.",
};

export default function OOriginalPage() {
  const articles = getAllOOriginal();
  return <OOriginalContent articles={articles} />;
}
