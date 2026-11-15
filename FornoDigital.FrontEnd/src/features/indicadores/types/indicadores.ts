/**
 * Período consultado nos indicadores, no formato yyyy-MM-dd (datas locais).
 */
export interface PeriodoIndicadores {
  dataInicial: string;
  dataFinal: string;
}

/**
 * Totais gerais das vendas do período.
 */
export interface ResumoVendas {
  quantidadeVendas: number;
  faturamento: number;
  ticketMedio: number;
}

/**
 * Produto do ranking de mais vendidos, ordenado por faturamento.
 */
export interface ProdutoMaisVendido {
  produtoId: string;
  nomeProduto: string;
  unidadeMedida: number | null;
  faturamento: number;
  quantidade: number;
  quantidadeVendas: number;
}

/**
 * Total vendido em uma forma de pagamento. O código 0 representa
 * vendas registradas antes da forma de pagamento existir.
 */
export interface VendasPorFormaPagamento {
  formaPagamento: number;
  quantidadeVendas: number;
  total: number;
}

/**
 * Valores de um produto em um dia do período.
 */
export interface PontoDiario {
  data: string;
  faturamento: number;
  quantidade: number;
}

/**
 * Série diária de um produto, com todos os dias do período (dias sem venda valem zero).
 */
export interface SerieDiariaProduto {
  produtoId: string;
  nomeProduto: string;
  pontos: PontoDiario[];
}

/**
 * Indicadores de vendas devolvidos pela API para o período consultado.
 */
export interface IndicadoresVendas {
  dataInicial: string;
  dataFinal: string;
  resumo: ResumoVendas;
  produtosMaisVendidos: ProdutoMaisVendido[];
  vendasPorFormaPagamento: VendasPorFormaPagamento[];
  vendasDiariasPorProduto: SerieDiariaProduto[];
}
