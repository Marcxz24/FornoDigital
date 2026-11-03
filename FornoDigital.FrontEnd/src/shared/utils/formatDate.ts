/**
 * Formata uma string de data (ou nula) para o padrão de data e hora local do Brasil (pt-BR), 
 * retornando um texto padrão caso o valor seja nulo ou inválido.
 * 
 * @param value A string contendo a data a ser formatada (ou nula).
 * @returns Uma string contendo a data e hora formatadas ou "Não informado" caso a conversão falhe.
 */
export function formatDate(value: string | null): string {
  if (value === null) {
    return "Não informado";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Não informado";
  }

  return date.toLocaleString("pt-BR");
}