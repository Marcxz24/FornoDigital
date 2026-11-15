import type { Ordenacao } from "../types/paginacao";

interface CabecalhoOrdenavelProps<TCampo extends string> {
  campo: TCampo;
  rotulo: string;
  ordenacao: Ordenacao<TCampo>;
  onOrdenar: (campo: TCampo) => void;
  alinhamento?: "inicio" | "fim";
}

/**
 * Cabeçalho de coluna que permite ordenar a grid pelo campo informado.
 * Informa a direção atual a tecnologias assistivas por meio de aria-sort.
 */
export function CabecalhoOrdenavel<TCampo extends string>({
  campo,
  rotulo,
  ordenacao,
  onOrdenar,
  alinhamento = "inicio",
}: CabecalhoOrdenavelProps<TCampo>) {
  const ativa = ordenacao.campo === campo;
  const direcaoAria = ativa
    ? ordenacao.direcao === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th
      scope="col"
      aria-sort={direcaoAria}
      className={alinhamento === "fim" ? "data-grid-cell-end" : undefined}
    >
      <button
        className={`data-grid-sort-button${ativa ? " data-grid-sort-button-active" : ""}`}
        type="button"
        onClick={() => onOrdenar(campo)}
        title={`Ordenar por ${rotulo.toLocaleLowerCase("pt-BR")}`}
      >
        {rotulo}
        <span className="data-grid-sort-indicator" aria-hidden="true">
          {ativa ? (ordenacao.direcao === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}
