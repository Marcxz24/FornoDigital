import type { Produto } from "../../features/produtos/types/produto";
import { getJson } from "./httpClient";

/**
 * Realiza uma requisição HTTP assíncrona para buscar a listagem completa de produtos cadastrados no sistema.
 * 
 * @returns Uma promessa (<see cref="Promise"/>) resolvida com um vetor contendo os dados dos produtos (<see cref="Produto"/>).
 */
export function listarProdutos(): Promise<Produto[]> {
  return getJson<Produto[]>("/api/produtos/listar-produtos");
}