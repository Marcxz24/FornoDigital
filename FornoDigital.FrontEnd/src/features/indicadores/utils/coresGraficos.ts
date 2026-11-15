/**
 * Cores categóricas dos gráficos, na ordem fixa da paleta.
 * Os valores ficam em variáveis CSS (indicadores.css) para acompanhar o tema claro e escuro.
 */
export const CORES_SERIES = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
] as const;

/**
 * Cor fixa de cada forma de pagamento: a cor acompanha a forma, não a posição no gráfico.
 * O código 0 (vendas antigas, sem forma informada) usa um cinza neutro.
 */
export function obterCorFormaPagamento(formaPagamento: number): string {
  switch (formaPagamento) {
    case 1:
      return CORES_SERIES[0];
    case 2:
      return CORES_SERIES[1];
    case 3:
      return CORES_SERIES[2];
    default:
      return "var(--series-neutra)";
  }
}
