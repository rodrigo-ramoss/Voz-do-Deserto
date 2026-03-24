import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

const studiesDir = path.join(process.cwd(), "content/studies");

export interface StudyMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  pdf?: string;
  image?: string;
  excerpt?: string;
  description?: string; // meta description SEO (frontmatter)
  keywords?: string;    // keywords SEO (frontmatter)
  readTime?: string;
}

export function getAllStudies(): StudyMeta[] {
  const files = fs.readdirSync(studiesDir).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(studiesDir, filename), "utf-8");
      const { data, content } = matter(raw);

      // Usa description do frontmatter se disponível, senão gera excerpt do conteúdo
      const excerpt =
        data.description ??
        content
          .split("\n")
          .find((line) => line.trim() && !line.startsWith("#"))
          ?.slice(0, 180) ?? "";

      const words = content.split(/\s+/).filter(Boolean).length;
      const readTime = `${Math.max(1, Math.round(words / 220))} min`;

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
        category: data.category ?? "",
        pdf: data.pdf,
        image: data.image,
        excerpt,
        description: data.description,
        keywords: data.keywords,
        readTime,
      };
    })
    // Mais recente primeiro; mesmo dia → ordem decrescente por slug (estabiliza a ordem)
    .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
}

export interface Study extends StudyMeta {
  contentHtml: string;
  faqItems?: { question: string; answer: string }[];
}

export async function getStudyBySlug(slug: string): Promise<Study | null> {
  const filepath = path.join(studiesDir, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processed.toString();

  const excerpt =
    data.description ??
    content
      .split("\n")
      .find((line) => line.trim() && !line.startsWith("#"))
      ?.slice(0, 180) ?? "";

  const words = content.split(/\s+/).filter(Boolean).length;
  const readTime = `${Math.max(1, Math.round(words / 220))} min`;

  // Lê FAQ do frontmatter se disponível (array de {question, answer})
  const faqItems: { question: string; answer: string }[] | undefined =
    Array.isArray(data.faq) ? data.faq : undefined;

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
    category: data.category ?? "",
    pdf: data.pdf,
    image: data.image,
    excerpt,
    description: data.description,
    keywords: data.keywords,
    readTime,
    contentHtml,
    faqItems,
  };
}

export function getAllStudySlugs(): string[] {
  return fs
    .readdirSync(studiesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
