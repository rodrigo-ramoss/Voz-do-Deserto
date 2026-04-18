import type { Metadata } from "next";
import ArquivoSecretoLockedNotice from "../components/ArquivoSecretoLockedNotice";

export const metadata: Metadata = {
  title: "Arquivo Secreto — Voz do Deserto",
  description:
    "O Arquivo Secreto chega no app Êxodo — análises profundas, conexões que a narrativa oficial esconde e o que o sistema prefere que você nunca encontre.",
};

export default function ArquivoSecretoPage() {
  return <ArquivoSecretoLockedNotice variant="page" />;
}
