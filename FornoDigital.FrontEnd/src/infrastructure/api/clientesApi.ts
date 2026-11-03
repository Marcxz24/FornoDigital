import type { Cliente } from "../../features/clientes/types/cliente";
import { getJson } from "./httpClient";

/**
 * Realiza uma requisição HTTP assíncrona para buscar a listagem completa de clientes cadastrados no sistema.
 * 
 * @returns Uma promessa (<see cref="Promise"/>) resolvida com um vetor contendo os dados dos clientes (<see cref="Cliente"/>).
 */
export function listarClientes(): Promise<Cliente[]> {
  return getJson<Cliente[]>("/api/clientes/listar");
}