import Newsletter from "@/app/components/Newsletter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter — Voz do Deserto",
  description: "Inscreva-se na nossa newsletter para receber nossos conteúdos e reflexões por e-mail.",
};

export default function NewsletterPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Newsletter />
      </div>
    </main>
  );
}
