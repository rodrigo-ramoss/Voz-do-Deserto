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
  // Compara strings ISO (YYYY-MM-DD) para evitar problemas de fuso horário.
  // "Em breve" só aparece para datas ESTRITAMENTE no futuro.
  const todayStr = new Date().toISOString().slice(0, 10);
  if (dateStr > todayStr) {
    return "Em breve";
  }
  const articleDate = new Date(dateStr + "T12:00:00");

  const options: Intl.DateTimeFormatOptions =
    format === "long"
      ? { day: "numeric", month: "long", year: "numeric" }
      : { month: "short", year: "numeric" };

  return articleDate.toLocaleDateString("pt-BR", options);
}
