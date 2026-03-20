import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const noticiasDir = path.join(process.cwd(), "content/noticias");

export interface NoticiaMeta {
  slug: string;
  title: string;
  date: string;
  category: string;       // "Fora do Deserto"
  image?: string;
  excerpt?: string;
  description?: string;
  keywords?: string;
  readTime?: string;
  source?: string;        // URL ou nome da fonte original
}

export interface Noticia extends NoticiaMeta {
  contentHtml: string;
}

export function getAllNoticias(): NoticiaMeta[] {
  if (!fs.existsSync(noticiasDir)) return [];

  const files = fs
    .readdirSync(noticiasDir)
    .filter((f) => f.endsWith(".md"));

  if (files.length === 0) return [];

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(noticiasDir, filename), "utf-8");
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
        category: "Fora do Deserto",
        image: data.image,
        excerpt,
        description: data.description,
        keywords: data.keywords,
        readTime,
        source: data.source,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
}

export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const filepath = path.join(noticiasDir, `${slug}.md`);
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

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
    category: "Fora do Deserto",
    image: data.image,
    excerpt,
    description: data.description,
    keywords: data.keywords,
    readTime,
    source: data.source,
    contentHtml,
  };
}

export function getAllNoticiasSlugs(): string[] {
  if (!fs.existsSync(noticiasDir)) return [];
  return fs
    .readdirSync(noticiasDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
