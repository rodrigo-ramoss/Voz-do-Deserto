import { getLatestOOriginal } from "@/lib/o-original";
import ArquivoSecretoPromoClient from "./ArquivoSecretoPromoClient";

export default function ArquivoSecretoPromo() {
  const latest = getLatestOOriginal(10);
  return <ArquivoSecretoPromoClient latest={latest} />;
}

