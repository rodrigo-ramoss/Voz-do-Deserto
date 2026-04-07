import type { Metadata } from "next";
import ArquivoSecretoHub from "./ArquivoSecretoHub";

export const metadata: Metadata = {
  title: "Arquivo Secreto — Voz do Deserto",
  description:
    "Três câmaras de conteúdo exclusivo: Artigos Premium, Livraria e O Original — exegese, profecias e o que o sistema prefere que você nunca encontre.",
};

export default function ArquivoSecretoPage() {
  return <ArquivoSecretoHub />;
}
