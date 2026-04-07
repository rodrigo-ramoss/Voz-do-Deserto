import type { Metadata } from "next";
import { getAllOOriginal, getLatestOOriginal } from "@/lib/o-original";
import OOriginalContent from "./OOriginalContent";

export const metadata: Metadata = {
  title: "O Original — Arquivo Secreto · Voz do Deserto",
  description:
    "Exegese investigativa voltada às fontes — hebraico, grego, história. A Bíblia como era lida antes das traduções e das doutrinas institucionais.",
};

export default function OOriginalPage() {
  const all = getAllOOriginal();
  const latest = getLatestOOriginal(4);
  return <OOriginalContent latest={latest} totalCount={all.length} />;
}
