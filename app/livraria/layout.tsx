import type { ReactNode } from "react";
import ArquivoSecretoLockedNotice from "../components/ArquivoSecretoLockedNotice";

const ARQUIVO_SECRETO_LOCKED = true;

export default function LivrariaLayout({ children }: { children: ReactNode }) {
  if (ARQUIVO_SECRETO_LOCKED) {
    return <ArquivoSecretoLockedNotice variant="page" />;
  }

  return children;
}

