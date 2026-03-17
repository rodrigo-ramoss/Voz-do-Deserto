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

export const metadata: Metadata = {
  title: "Voz do Deserto — Estudos Bíblicos Profundos",
  description:
    "Estudos bíblicos profundos para cristãos despertos e buscadores da verdade.",
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
