/**
 * Página de resultados devolvida pelas listagens paginadas da API.
 */
export interface ResultadoPaginado<T> {
  /** Registros da página solicitada. */
  items: T[];
  /** Número da página retornada, iniciando em 1. */
  page: number;
  /** Quantidade máxima de registros por página. */
  pageSize: number;
  /** Total de registros encontrados com a busca e os filtros aplicados. */
  totalCount: number;
  /** Total de páginas; zero quando nenhum registro foi encontrado. */
  totalPages: number;
}

/**
 * Direção de ordenação aceita pela API.
 */
export type DirecaoOrdenacao = "asc" | "desc";

/**
 * Campo e direção usados para ordenar uma listagem.
 */
export interface Ordenacao<TCampo extends string> {
  campo: TCampo;
  direcao: DirecaoOrdenacao;
}

/**
 * Parâmetros enviados pelos hooks de listagem aos serviços de API.
 */
export interface ParametrosListagem<TCampo extends string, TFiltro extends string> {
  pagina: number;
  tamanhoPagina: number;
  busca: string;
  ordenacao: Ordenacao<TCampo>;
  filtro: TFiltro | null;
}
