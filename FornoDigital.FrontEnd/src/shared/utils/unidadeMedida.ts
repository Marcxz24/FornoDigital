/**
 * Dicionário estático que mapeia códigos numéricos para suas respectivas 
 * descrições textuais das unidades de medida comerciais.
 */
const unidadesMedida: Record<number, string> = {
  1: "Unidade",
  2: "Grama",
  3: "Quilograma",
  4: "Mililitro",
  5: "Litro",
};

/**
 * Converte um código numérico de unidade de medida em sua respectiva representação textual.
 * 
 * @param value O código numérico da unidade de medida.
 * @returns A descrição textual correspondente ou "Unidade desconhecida" caso o código não seja encontrado.
 */
export function formatUnidadeMedida(value: number): string {
  return unidadesMedida[value] ?? "Unidade desconhecida";
}