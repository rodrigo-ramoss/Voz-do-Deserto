/**
 * Retorna o texto do CTA de acordo com a categoria do post.
 * Mantém CTAs envolventes e variados em todos os componentes de card.
 */
export function getCtaLabel(category: string): string {
  switch (category) {
    case "Apologética":
      return "Examinar a questão →";
    case "Denúncias":
      return "Aprofundar-se →";
    case "Profecias":
    case "Profecia":
      return "Entender a fundo →";
    default:
      return "Continuar lendo →";
  }
}

/**
 * Formata a data do frontmatter em pt-BR.
 * Se a data for futura (em relação a hoje), retorna "Em breve".
 *
 * @param dateStr  ISO date string  "YYYY-MM-DD"
 * @param format   "long"  → "12 de março de 2026"
 *                 "short" → "mar. 2026"  (padrão)
 */
export function formatDateSmart(
  dateStr: string,
  format: "long" | "short" = "short"
): string {
  // Força meio-dia local para evitar off-by-one por fuso horário
  const articleDate = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (articleDate > today) {
    return "Em breve";
  }

  const options: Intl.DateTimeFormatOptions =
    format === "long"
      ? { day: "numeric", month: "long", year: "numeric" }
      : { month: "short", year: "numeric" };

  return articleDate.toLocaleDateString("pt-BR", options);
}
