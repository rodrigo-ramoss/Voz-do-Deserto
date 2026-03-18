import type { MetadataRoute } from "next";
import { getAllStudies } from "@/lib/studies";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vozdodeserto.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const studies = getAllStudies();

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/estudos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/livraria`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Páginas dinâmicas — cada estudo
  const studyPages: MetadataRoute.Sitemap = studies.map((study) => ({
    url: `${BASE_URL}/estudos/${study.slug}`,
    lastModified: study.date ? new Date(study.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...studyPages];
}
