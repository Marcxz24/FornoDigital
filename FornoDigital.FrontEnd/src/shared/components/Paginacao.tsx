interface PaginacaoProps {
  pagina: number;
  totalPaginas: number;
  totalRegistros: number;
  tamanhoPagina: number;
  desabilitada?: boolean;
  onMudarPagina: (pagina: number) => void;
}

const formatarNumero = new Intl.NumberFormat("pt-BR");

/**
 * Apresenta o intervalo exibido e os controles de navegação entre páginas.
 * Não renderiza nada quando não há registros.
 */
export function Paginacao({
  pagina,
  totalPaginas,
  totalRegistros,
  tamanhoPagina,
  desabilitada = false,
  onMudarPagina,
}: PaginacaoProps) {
  if (totalRegistros === 0 || totalPaginas === 0) {
    return null;
  }

  const primeiro = (pagina - 1) * tamanhoPagina + 1;
  const ultimo = Math.min(pagina * tamanhoPagina, totalRegistros);
  const naPrimeira = pagina <= 1;
  const naUltima = pagina >= totalPaginas;

  return (
    <nav className="data-grid-pagination" aria-label="Paginação">
      <p className="data-grid-pagination-summary">
        Exibindo {formatarNumero.format(primeiro)}–{formatarNumero.format(ultimo)} de{" "}
        {formatarNumero.format(totalRegistros)}
      </p>

      <div className="data-grid-pagination-controls">
        <button
          className="data-grid-page-button"
          type="button"
          onClick={() => onMudarPagina(1)}
          disabled={desabilitada || naPrimeira}
          aria-label="Primeira página"
          title="Primeira página"
        >
          «
        </button>

        <button
          className="data-grid-page-button"
          type="button"
          onClick={() => onMudarPagina(pagina - 1)}
          disabled={desabilitada || naPrimeira}
          aria-label="Página anterior"
          title="Página anterior"
        >
          ‹
        </button>

        <span className="data-grid-page-indicator" aria-current="page">
          Página {formatarNumero.format(pagina)} de{" "}
          {formatarNumero.format(totalPaginas)}
        </span>

        <button
          className="data-grid-page-button"
          type="button"
          onClick={() => onMudarPagina(pagina + 1)}
          disabled={desabilitada || naUltima}
          aria-label="Próxima página"
          title="Próxima página"
        >
          ›
        </button>

        <button
          className="data-grid-page-button"
          type="button"
          onClick={() => onMudarPagina(totalPaginas)}
          disabled={desabilitada || naUltima}
          aria-label="Última página"
          title="Última página"
        >
          »
        </button>
      </div>
    </nav>
  );
}
