/**
 * Opções de forma de pagamento apresentadas no registro de vendas.
 * Os valores correspondem ao enum FormaPagamento da API.
 */
export const opcoesFormaPagamento = [
  { valor: 1, rotulo: "Dinheiro" },
  { valor: 2, rotulo: "Cartão" },
  { valor: 3, rotulo: "PIX" },
] as const;

/**
 * Converte o código da forma de pagamento em texto.
 * Vendas registradas antes da funcionalidade (código 0) aparecem como "Não informada".
 */
export function formatFormaPagamento(valor: number): string {
  return (
    opcoesFormaPagamento.find((opcao) => opcao.valor === valor)?.rotulo ??
    "Não informada"
  );
}