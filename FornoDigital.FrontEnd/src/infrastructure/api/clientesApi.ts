import type {
  Cliente,
  ClienteRequest,
  FiltroCliente,
  OrdenacaoCliente,
} from "../../features/clientes/types/cliente";
import type {
  ParametrosListagem,
  ResultadoPaginado,
} from "../../shared/types/paginacao";
import { montarQueryString } from "../../shared/utils/paginacao";
import {
  deleteRequest,
  getJson,
  postJson,
  putJson,
} from "./httpClient";

/**
 * Busca a lista completa de clientes cadastrados.
 * Usada pelo registro de vendas e pelo dashboard.
 */
export function listarClientes(): Promise<Cliente[]> {
  return getJson<Cliente[]>("/api/clientes/listar");
}

/**
 * Busca uma página de clientes. Busca, ordenação e paginação
 * são executadas pela API no banco de dados.
 */
export function listarClientesPaginado(
  parametros: ParametrosListagem<OrdenacaoCliente, FiltroCliente>,
): Promise<ResultadoPaginado<Cliente>> {
  const query = montarQueryString({
    page: parametros.pagina,
    pageSize: parametros.tamanhoPagina,
    search: parametros.busca,
    sortBy: parametros.ordenacao.campo,
    sortDirection: parametros.ordenacao.direcao,
  });

  return getJson<ResultadoPaginado<Cliente>>(`/api/clientes${query}`);
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