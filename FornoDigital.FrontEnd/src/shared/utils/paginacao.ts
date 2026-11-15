import type { Ordenacao } from "../types/paginacao";

/**
 * Quantidade de registros por página usada nas listagens.
 * O backend aceita até 100 registros por página.
 */
export const TAMANHO_PAGINA_PADRAO = 50;

/**
 * Tempo de espera, em milissegundos, entre a digitação e a busca na API.
 */
export const ATRASO_BUSCA_MS = 300;

/**
 * Retorna a próxima ordenação ao clicar em uma coluna:
 * a mesma coluna inverte a direção; outra coluna começa em ordem crescente.
 */
export function alternarOrdenacao<TCampo extends string>(
  atual: Ordenacao<TCampo>,
  campo: TCampo,
): Ordenacao<TCampo> {
  if (atual.campo !== campo) {
    return { campo, direcao: "asc" };
  }

  return { campo, direcao: atual.direcao === "asc" ? "desc" : "asc" };
}

/**
 * Monta a query string das listagens, omitindo valores vazios.
 */
export function montarQueryString(
  parametros: Record<string, string | number | null | undefined>,
): string {
  const query = new URLSearchParams();

  for (const [nome, valor] of Object.entries(parametros)) {
    if (valor === null || valor === undefined || valor === "") {
      continue;
    }

    query.set(nome, String(valor));
  }

  const texto = query.toString();

  return texto ? `?${texto}` : "";
}
