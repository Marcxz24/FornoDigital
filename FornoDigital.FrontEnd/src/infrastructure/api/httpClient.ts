/**
 * URL base da API obtida através das variáveis de ambiente do projeto, 
 * com qualquer barra diagonal final redundante removida para padronização das rotas.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

/**
 * Realiza uma requisição HTTP do tipo GET padronizada para o endpoint informado, 
 * validando a disponibilidade da URL base, executando a chamada fetch e desserializando a resposta em JSON.
 * 
 * @template T O tipo esperado do dado de retorno da requisição.
 * @param path O caminho ou rota relativa do endpoint da API (ex: "/api/clientes/listar").
 * @returns Uma promessa (<see cref="Promise"/>) contendo os dados desserializados do tipo genérico <typeparamref name="T"/>.
 * @throws {Error} Lança um erro se a variável de ambiente <c>VITE_API_BASE_URL</c> não estiver configurada ou se a resposta HTTP falhar.
 */
export async function getJson<T>(path: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("A variável VITE_API_BASE_URL não está configurada.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`A requisição falhou (HTTP ${response.status}).`);
  }

  return (await response.json()) as T;
}