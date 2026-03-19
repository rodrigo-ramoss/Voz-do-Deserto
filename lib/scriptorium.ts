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
  price?: string;        // ex: "R$ 19,90"
  paymentUrl?: string;   // link Stripe / Hotmart / Kiwify
}

export interface ScriptoriumArticle extends ScriptoriumMeta {
  contentHtml: string;
  previewHtml: string;   // primeiros parágrafos para o paywall
  faqItems?: { question: string; answer: string }[];
}

// Converte markdown para HTML de forma assíncrona
async function toHtml(md: string): Promise<string> {
  const result = await remark().use(html).process(md);
  return result.toString();
}

// Extrai os primeiros N parágrafos do markdown (evita cortar no meio de bloco)
function firstParagraphs(content: string, count = 3): string {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith("#")); // ignora headings
  return blocks.slice(0, count).join("\n\n");
}

export function getAllScriptorium(): ScriptoriumMeta[] {
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
        price: data.price,
        paymentUrl: data.paymentUrl,
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

  // HTML completo e preview parcial (3 primeiros parágrafos)
  const [contentHtml, previewHtml] = await Promise.all([
    toHtml(content),
    toHtml(firstParagraphs(content, 3)),
  ]);

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
    price: data.price,
    paymentUrl: data.paymentUrl,
    contentHtml,
    previewHtml,
    faqItems,
  };
}

// Retorna artigos agrupados por categoria
export function getScriptoriumByCategory(): Record<string, ScriptoriumMeta[]> {
  const all = getAllScriptorium();
  return all.reduce<Record<string, ScriptoriumMeta[]>>((acc, article) => {
    const cat = article.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(article);
    return acc;
  }, {});
}

export function getAllScriptoriumSlugs(): string[] {
  if (!fs.existsSync(scriptoriumDir)) return [];
  return fs
    .readdirSync(scriptoriumDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
