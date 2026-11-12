import type {
  Cliente,
  ClienteRequest,
} from "../../features/clientes/types/cliente";
import {
  deleteRequest,
  getJson,
  postJson,
  putJson,
} from "./httpClient";

/**
 * Busca a lista de clientes cadastrados.
 */
export function listarClientes(): Promise<Cliente[]> {
  return getJson<Cliente[]>("/api/clientes/listar");
}

/**
 * Cadastra um cliente e retorna os dados confirmados pela API.
 */
export function cadastrarCliente(
  request: ClienteRequest,
): Promise<Cliente> {
  return postJson<ClienteRequest, Cliente>(
    "/api/clientes/cadastrar",
    request,
  );
}

/**
 * Edita um cliente existente e retorna os dados atualizados pela API.
 */
export function editarCliente(
  id: string,
  request: ClienteRequest,
): Promise<Cliente> {
  return putJson<ClienteRequest, Cliente>(
    `/api/clientes/${encodeURIComponent(id)}/editar`,
    request,
  );
}

/**
 * Exclui um cliente. A API responde sem corpo quando a exclusão dá certo.
 */
export function excluirCliente(id: string): Promise<void> {
  return deleteRequest(
    `/api/clientes/${encodeURIComponent(id)}/excluir`,
  );
}