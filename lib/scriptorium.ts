import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const scriptoriumDir = path.join(process.cwd(), "content/scriptorium");

export interface ScriptoriumMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  image?: string;
  excerpt?: string;
  description?: string;
  keywords?: string;
  readTime?: string;
}

export interface ScriptoriumArticle extends ScriptoriumMeta {
  contentHtml: string;
  faqItems?: { question: string; answer: string }[];
}

export function getAllScriptorium(): ScriptoriumMeta[] {
  // Retorna lista vazia se a pasta ainda não tiver artigos
  if (!fs.existsSync(scriptoriumDir)) return [];

  const files = fs
    .readdirSync(scriptoriumDir)
    .filter((f) => f.endsWith(".md"));

  if (files.length === 0) return [];

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(
        path.join(scriptoriumDir, filename),
        "utf-8"
      );
      const { data, content } = matter(raw);

      const excerpt =
        data.description ??
        content
          .split("\n")
          .find((line) => line.trim() && !line.startsWith("#"))
          ?.slice(0, 180) ??
        "";

      const words = content.split(/\s+/).filter(Boolean).length;
      const readTime = `${Math.max(1, Math.round(words / 220))} min`;

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
        category: data.category ?? "Scriptorium",
        image: data.image,
        excerpt,
        description: data.description,
        keywords: data.keywords,
        readTime,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getScriptoriumBySlug(
  slug: string
): Promise<ScriptoriumArticle | null> {
  const filepath = path.join(scriptoriumDir, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  const excerpt =
    data.description ??
    content
      .split("\n")
      .find((line) => line.trim() && !line.startsWith("#"))
      ?.slice(0, 180) ??
    "";

  const words = content.split(/\s+/).filter(Boolean).length;
  const readTime = `${Math.max(1, Math.round(words / 220))} min`;

  const faqItems: { question: string; answer: string }[] | undefined =
    Array.isArray(data.faq) ? data.faq : undefined;

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
    category: data.category ?? "Scriptorium",
    image: data.image,
    excerpt,
    description: data.description,
    keywords: data.keywords,
    readTime,
    contentHtml,
    faqItems,
  };
}

export function getAllScriptoriumSlugs(): string[] {
  if (!fs.existsSync(scriptoriumDir)) return [];
  return fs
    .readdirSync(scriptoriumDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
