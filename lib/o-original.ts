import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// ─── Diretórios ───────────────────────────────────────────────────────────────
// Artigos:  content/o-original/*.md
// Imagens:  public/imagens/o-original/*
const oOriginalDir = path.join(process.cwd(), "content/o-original");

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface OOriginalMeta {
  slug: string;
  title: string;
  date: string;
  category: string;       // ex: "Estudos de Livros", "Doutrinas", "Palavras Originais"
  image?: string;         // caminho relativo a /public, ex: /imagens/o-original/genesis.webp
  excerpt?: string;
  description?: string;
  keywords?: string;
  readTime?: string;
  language?: string;      // ex: "Hebraico", "Grego", "Aramaico"
  book?: string;          // ex: "Gênesis", "João", "Daniel"
  verse?: string;         // ex: "Gn 1:1-3"
  premium?: boolean;      // true = requer assinatura mensal
}

export interface OOriginalArticle extends OOriginalMeta {
  contentHtml: string;
  previewHtml: string;    // primeiros parágrafos para paywall (se premium)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function toHtml(md: string): Promise<string> {
  const result = await remark().use(html).process(md);
  return result.toString();
}

function firstParagraphs(content: string, count = 3): string {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith("#"));
  return blocks.slice(0, count).join("\n\n");
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

/** Coleta todos os .md de forma recursiva dentro de oOriginalDir */
function collectMdFiles(dir: string): { slug: string; filepath: string }[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: { slug: string; filepath: string }[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMdFiles(full));
    } else if (entry.name.endsWith(".md")) {
      // slug = nome do arquivo sem extensão (único por convenção de nomes)
      results.push({ slug: entry.name.replace(/\.md$/, ""), filepath: full });
    }
  }
  return results;
}

/** Lista todos os artigos de O Original (incluindo subpastas), ordenados do mais recente */
export function getAllOOriginal(): OOriginalMeta[] {
  const files = collectMdFiles(oOriginalDir);
  if (files.length === 0) return [];

  return files
    .map(({ slug, filepath }) => {
      const raw = fs.readFileSync(filepath, "utf-8");
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
        title:       data.title    ?? slug,
        date:        data.date     ? new Date(data.date).toISOString().slice(0, 10) : "",
        category:    data.category ?? "O Original",
        image:       data.image,
        excerpt,
        description: data.description,
        keywords:    data.keywords,
        readTime,
        language:    data.language,
        book:        data.book,
        verse:       data.verse,
        premium:     data.premium  ?? false,
      } satisfies OOriginalMeta;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
}

/** Carrega um artigo de O Original pelo slug, com HTML completo e preview */
export async function getOOriginalBySlug(
  slug: string
): Promise<OOriginalArticle | null> {
  const filepath = path.join(oOriginalDir, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

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

  return {
    slug,
    title:       data.title    ?? slug,
    date:        data.date     ? new Date(data.date).toISOString().slice(0, 10) : "",
    category:    data.category ?? "O Original",
    image:       data.image,
    excerpt,
    description: data.description,
    keywords:    data.keywords,
    readTime,
    language:    data.language,
    book:        data.book,
    verse:       data.verse,
    premium:     data.premium  ?? false,
    contentHtml,
    previewHtml,
  };
}

/** Agrupa artigos por categoria */
export function getOOriginalByCategory(): Record<string, OOriginalMeta[]> {
  const all = getAllOOriginal();
  return all.reduce<Record<string, OOriginalMeta[]>>((acc, article) => {
    const cat = article.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(article);
    return acc;
  }, {});
}

/** Retorna todos os slugs (para generateStaticParams), incluindo subpastas */
export function getAllOOriginalSlugs(): string[] {
  return collectMdFiles(oOriginalDir).map(({ slug }) => slug);
}

/** Carrega um artigo de O Original pelo slug, buscando recursivamente */
export async function getOOriginalBySlugRecursive(
  slug: string
): Promise<OOriginalArticle | null> {
  const files = collectMdFiles(oOriginalDir);
  const found = files.find((f) => f.slug === slug);
  if (!found) return null;

  const raw = fs.readFileSync(found.filepath, "utf-8");
  const { data, content } = matter(raw);

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

  return {
    slug,
    title:       data.title    ?? slug,
    date:        data.date     ? new Date(data.date).toISOString().slice(0, 10) : "",
    category:    data.category ?? "O Original",
    image:       data.image,
    excerpt,
    description: data.description,
    keywords:    data.keywords,
    readTime,
    language:    data.language,
    book:        data.book,
    verse:       data.verse,
    premium:     data.premium  ?? false,
    contentHtml,
    previewHtml,
  };
}
