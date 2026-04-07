import type { Metadata } from "next";
import { getOOriginalBySpecificCategory } from "@/lib/o-original";
import DoutrinasContent from "./DoutrinasContent";

export const metadata: Metadata = {
  title: "Doutrinas — O Original · Voz do Deserto",
  description:
    "Doutrinas amplamente aceitas colocadas sob exame direto do texto original — o que resiste e o que foi acrescentado pela tradição.",
};

export default function DoutrinasPage() {
  const articles = getOOriginalBySpecificCategory("Doutrinas");
  return <DoutrinasContent articles={articles} />;
}
