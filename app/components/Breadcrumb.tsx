import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb com JSON-LD para SEO.
 * Uso: <Breadcrumb items={[{label:"Estudos", href:"/estudos"}, {label:"Título"}]} />
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "/" },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: item.href } : {}),
      })),
    ],
  };

  return (
    <>
      {/* JSON-LD breadcrumb para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 flex-wrap"
      >
        <Link
          href="/"
          className="font-label text-[8px] uppercase tracking-widest text-muted/50 hover:text-gold transition-colors"
        >
          Início
        </Link>

        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="font-label text-[8px] text-gold/20">›</span>
            {item.href ? (
              <Link
                href={item.href}
                className="font-label text-[8px] uppercase tracking-widest text-muted/50 hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-label text-[8px] uppercase tracking-widest text-muted/80"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
