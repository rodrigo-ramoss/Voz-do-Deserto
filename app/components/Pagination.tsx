"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-gold/10"
      aria-label="Paginação"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className="font-label text-[9px] uppercase tracking-widest text-muted border border-gold/15 px-5 py-2.5 transition-all duration-200 hover:border-gold/40 hover:text-gold disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-gold/15 disabled:hover:text-muted"
      >
        ← Anterior
      </button>

      <span className="font-label text-[9px] text-muted/60 tracking-widest">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
        className="font-label text-[9px] uppercase tracking-widest text-muted border border-gold/15 px-5 py-2.5 transition-all duration-200 hover:border-gold/40 hover:text-gold disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-gold/15 disabled:hover:text-muted"
      >
        Próxima →
      </button>
    </nav>
  );
}
