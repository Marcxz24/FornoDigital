/**
 * Instância global de formatador numérico configurada para o padrão brasileiro (pt-BR) 
 * utilizando o estilo de moeda Real (BRL).
 */
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/**
 * Formata um valor numérico para o padrão monetário brasileiro (Real / BRL).
 * 
 * @param value O valor numérico a ser formatado.
 * @returns Uma string contendo o valor formatado com o símbolo da moeda (ex: "R$ 10,00").
 */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}