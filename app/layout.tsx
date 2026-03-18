import type { Metadata } from "next";
import { Playfair_Display, Crimson_Pro, Space_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CategoryBar from "./components/CategoryBar";
import { getAllStudies } from "@/lib/studies";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vozdodeserto.com.br";

// ─── Metadados globais (padrão para todas as páginas) ────────────────────────
export const metadata: Metadata = {
  // Resolve URLs relativas em og:image, twitter:image, canonical, etc.
  metadataBase: new URL(BASE_URL),

  // Título padrão quando a página não define o próprio.
  // template: "%s" ← páginas filhas gerenciam seus títulos completos.
  title: {
    default: "Voz do Deserto — Estudos Bíblicos Profundos",
    template: "%s",
  },

  // 150-160 caracteres · palavra-chave principal no início
  description:
    "Estudos bíblicos profundos para desigrejados que saíram da instituição mas não saíram de Deus. Teologia honesta, apócrifos e história da Igreja.",

  keywords: [
    "estudos bíblicos",
    "desigrejados",
    "apócrifos",
    "teologia bíblica",
    "história da Igreja",
    "crítica textual",
    "Jesus histórico",
    "fé no deserto",
    "voz do deserto",
  ],

  authors: [
    { name: "Rodrigo Ramos", url: `${BASE_URL}/sobre` },
  ],
  creator: "Rodrigo Ramos",
  publisher: "Voz do Deserto",

  // Canonical da raiz (páginas internas sobrescrevem via alternates em suas
  // próprias generateMetadata)
  alternates: {
    canonical: "/",
  },

  // ── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    title: "Voz do Deserto — Estudos Bíblicos Profundos",
    description:
      "Estudos bíblicos profundos para desigrejados que saíram da instituição mas não saíram de Deus. Teologia honesta, apócrifos e história da Igreja.",
    url: "/",
    siteName: "Voz do Deserto",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        // Coloque uma imagem 1200×630 em /public/og-default.jpg para resultado ideal.
        // Por ora usa o logo como fallback.
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Voz do Deserto — Estudos Bíblicos Profundos",
      },
    ],
  },

  // ── Twitter / X Cards ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Voz do Deserto — Estudos Bíblicos Profundos",
    description:
      "Estudos bíblicos profundos para desigrejados que saíram da instituição mas não saíram de Deus.",
    images: ["/logo.webp"],
    // Atualize com o @ do Twitter/X quando disponível:
    // creator: "@vozdodeserto",
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = Array.from(
    new Set(getAllStudies().map((s) => s.category).filter(Boolean))
  ).sort();

  return (
    // T5: lang="pt-BR" confirmado ✓
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${crimsonPro.variable} ${spaceMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <CategoryBar categories={categories} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
