import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

const ebooksDir = path.join(process.cwd(), "content/ebooks");

/* ------------------------------------------------------------------ */
/* Metadados embutidos diretamente aqui (os MD não têm frontmatter)    */
/* ------------------------------------------------------------------ */
const EBOOK_META: Record<
  string,
  {
    volume: number;
    subtitle: string;
    description: string;
    trilogy: string;
    image: string;
    readTime?: string;
  }
> = {
  "o-mapa-antes-da-tempestade": {
    volume: 1,
    subtitle: "Lendo os Sinais de um Mundo em Convulsão",
    description:
      "A Operação Epic Fury, o eixo CRINK, o Estreito de Ormuz, a guerra ciber-cinética — um mapa para ler o caos e antecipar o próximo movimento da história.",
    trilogy: "O Mapa Antes da Tempestade",
    image: "/imagens/ebooks/o-mapa-antes-da-tempestade.webp",
  },
  "a-anatomia-da-ruptura": {
    volume: 2,
    subtitle: "O Que os Ciclos da História Revelam Sobre o Nosso Futuro",
    description:
      "De Roma à crise de 1914–1945 — os mesmos padrões que derrubaram impérios estão operando agora. Uma anatomia do colapso para quem não quer ser pego de surpresa.",
    trilogy: "O Mapa Antes da Tempestade",
    image: "/imagens/ebooks/a-anatomia-da-ruptura.webp",
  },
  "o-manual-do-interregno": {
    volume: 3,
    subtitle: "Estratégias de Sobrevivência para o Tempo Entre Dois Mundos",
    description:
      "Você já tem o mapa e a bússola. Agora precisa do manual. Estratégias concretas de economia, comunidade, soberania cognitiva e preparação prática para o interregno.",
    trilogy: "O Mapa Antes da Tempestade",
    image: "/imagens/ebooks/o-manual-do-interregno.webp",
  },
};

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */
export interface EbookMeta {
  slug: string;
  title: string;
  subtitle: string;
  volume: number;
  trilogy: string;
  description: string;
  image: string;
  readTime: string;
  chapters: { id: string; title: string }[];
}

export interface Ebook extends EbookMeta {
  contentHtml: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Extrai lista de capítulos (## headings) de um MD raw */
function extractChapters(content: string): { id: string; title: string }[] {
  const lines = content.split("\n");
  const chapters: { id: string; title: string }[] = [];
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const title = match[1].trim();
      const id = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      chapters.push({ id, title });
    }
  }
  return chapters;
}

/** Calcula tempo de leitura */
function calcReadTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${minutes} min`;
}

/* ------------------------------------------------------------------ */
/* API pública                                                         */
/* ------------------------------------------------------------------ */

export function getAllEbooks(): EbookMeta[] {
  const files = fs.readdirSync(ebooksDir).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(ebooksDir, filename), "utf-8");
      const { content } = matter(raw);

      // Título = primeira linha # do arquivo
      const titleLine = content.split("\n").find((l) => l.startsWith("# "));
      const title = titleLine ? titleLine.replace(/^# /, "").trim() : slug;

      const meta = EBOOK_META[slug] ?? {
        volume: 0,
        subtitle: "",
        description: "",
        trilogy: "",
        image: "",
      };

      return {
        slug,
        title,
        ...meta,
        readTime: calcReadTime(content),
        chapters: extractChapters(content),
      };
    })
    .sort((a, b) => a.volume - b.volume);
}

export async function getEbookBySlug(slug: string): Promise<Ebook | null> {
  const filepath = path.join(ebooksDir, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { content } = matter(raw);

  // Título = primeira linha #
  const titleLine = content.split("\n").find((l) => l.startsWith("# "));
  const title = titleLine ? titleLine.replace(/^# /, "").trim() : slug;

  // Converte para HTML com âncoras nos headings
  const contentWithAnchors = content.replace(/^(##\s+.+)$/gm, (match) => {
    const text = match.replace(/^##\s+/, "").trim();
    const id = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    return `## <a id="${id}"></a>${text}`;
  });

  const processed = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(contentWithAnchors);

  const meta = EBOOK_META[slug] ?? {
    volume: 0,
    subtitle: "",
    description: "",
    trilogy: "",
    image: "",
  };

  return {
    slug,
    title,
    ...meta,
    readTime: calcReadTime(content),
    chapters: extractChapters(content),
    contentHtml: processed.toString(),
  };
}

export function getAllEbookSlugs(): string[] {
  return fs
    .readdirSync(ebooksDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
