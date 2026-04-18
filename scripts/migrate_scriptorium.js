#!/usr/bin/env node
/**
 * Migra os artigos de content/scriptorium para content/studies,
 * removendo os campos `price` e `paymentUrl` do frontmatter.
 *
 * - Preserva tudo o mais (title, date, category, image, faq, conteúdo).
 * - Não sobrescreve se já existir no destino (aborta e avisa).
 * - Apaga o arquivo de origem depois de migrar com sucesso.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "content", "scriptorium");
const DST_DIR = path.join(ROOT, "content", "studies");

if (!fs.existsSync(SRC_DIR)) {
  console.log("Pasta scriptorium não existe. Nada a fazer.");
  process.exit(0);
}

const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith(".md"));
if (files.length === 0) {
  console.log("Pasta scriptorium vazia. Nada a fazer.");
  process.exit(0);
}

let moved = 0;
for (const filename of files) {
  const srcPath = path.join(SRC_DIR, filename);
  const dstPath = path.join(DST_DIR, filename);

  if (fs.existsSync(dstPath)) {
    console.error(`CONFLITO: ${filename} já existe em studies/. Pulando.`);
    continue;
  }

  const raw = fs.readFileSync(srcPath, "utf-8");
  // Frontmatter YAML entre --- ... ---
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) {
    console.error(`Sem frontmatter reconhecível: ${filename}. Pulando.`);
    continue;
  }

  const frontmatter = m[1];
  const body = m[2];

  // Remove linhas de price: e paymentUrl: (e caso estejam com aspas ou não)
  const cleanedFrontmatter = frontmatter
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (/^price\s*:/i.test(trimmed)) return false;
      if (/^paymentUrl\s*:/i.test(trimmed)) return false;
      return true;
    })
    .join("\n");

  const out = `---\n${cleanedFrontmatter}\n---\n${body}`;
  fs.writeFileSync(dstPath, out, "utf-8");
  fs.unlinkSync(srcPath);
  moved++;
  console.log(`✓ ${filename}`);
}

console.log(`\nMigrados: ${moved}/${files.length}`);
