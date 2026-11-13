export type FiltroProduto =
  | "todos"
  | "disponiveis"
  | "indisponiveis"
  | "estoque-zerado";

interface ProdutoFiltersProps {
  termoBusca: string;
  filtroAtivo: FiltroProduto;
  onTermoBuscaChange: (termo: string) => void;
  onFiltroChange: (filtro: FiltroProduto) => void;
}

const filtros: { valor: FiltroProduto; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "disponiveis", rotulo: "Disponíveis" },
  { valor: "indisponiveis", rotulo: "Indisponíveis" },
  { valor: "estoque-zerado", rotulo: "Estoque zerado" },
];

/**
 * Renderiza a busca e os filtros de apresentação do catálogo.
 * A página recebe as mudanças e aplica os filtros aos produtos carregados.
 */
export function ProdutoFilters({
  termoBusca,
  filtroAtivo,
  onTermoBuscaChange,
  onFiltroChange,
}: ProdutoFiltersProps) {
  return (
    <section className="product-toolbar" aria-label="Busca e filtros de produtos">
      <label className="product-search-field">
        <span className="product-search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </span>

        <span className="sr-only">Buscar produtos</span>
        <input
          type="search"
          value={termoBusca}
          onChange={(event) => onTermoBuscaChange(event.target.value)}
          placeholder="Buscar por nome ou descrição"
        />
      </label>

      <div className="product-filter-group" aria-label="Filtrar produtos">
        {filtros.map((filtro) => (
          <button
            className={`product-filter-button${filtroAtivo === filtro.valor ? " product-filter-button-active" : ""}`}
            type="button"
            key={filtro.valor}
            aria-pressed={filtroAtivo === filtro.valor}
            onClick={() => onFiltroChange(filtro.valor)}
          >
            {filtro.rotulo}
          </button>
        ))}
      </div>
    </section>
  );
}