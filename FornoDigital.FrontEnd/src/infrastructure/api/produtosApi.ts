import type {
  AlterarDisponibilidadeProdutoRequest,
  EditarProdutoRequest,
  FiltroProduto,
  OrdenacaoProduto,
  Produto,
  ProdutoRequest,
} from "../../features/produtos/types/produto";
import type {
  ParametrosListagem,
  ResultadoPaginado,
} from "../../shared/types/paginacao";
import { montarQueryString } from "../../shared/utils/paginacao";
import {
  deleteRequest,
  getJson,
  patchJson,
  postJson,
  putJson,
} from "./httpClient";

/**
 * Busca todos os produtos, inclusive os indisponíveis.
 * A API retorna também os códigos de barras associados a cada produto.
 * Usada pelo registro de vendas e pelo dashboard.
 */
export function listarProdutos(): Promise<Produto[]> {
  return getJson<Produto[]>("/api/produtos/listar-produtos");
}

/**
 * Busca uma página do catálogo. Busca, filtro, ordenação e paginação
 * são executados pela API no banco de dados.
 */
export function listarProdutosPaginado(
  parametros: ParametrosListagem<OrdenacaoProduto, FiltroProduto>,
): Promise<ResultadoPaginado<Produto>> {
  const query = montarQueryString({
    page: parametros.pagina,
    pageSize: parametros.tamanhoPagina,
    search: parametros.busca,
    filtro: parametros.filtro,
    sortBy: parametros.ordenacao.campo,
    sortDirection: parametros.ordenacao.direcao,
  });

  return getJson<ResultadoPaginado<Produto>>(`/api/produtos${query}`);
}

/**
 * Envia o cadastro e retorna o produto criado pela API.
 * O pedido inclui a lista de códigos de barras como texto.
 */
export function cadastrarProduto(
  request: ProdutoRequest,
): Promise<Produto> {
  return postJson<ProdutoRequest, Produto>(
    "/api/produtos/cadastrar",
    request,
  );
}

/**
 * Atualiza os dados do produto e substitui sua coleção de códigos de barras
 * pela lista enviada. A disponibilidade usa uma rota PATCH separada.
 */
export function editarProduto(
  id: string,
  request: EditarProdutoRequest,
): Promise<Produto> {
  return putJson<EditarProdutoRequest, Produto>(
    `/api/produtos/${encodeURIComponent(id)}/editar`,
    request,
  );
}

/**
 * Ativa ou inativa o produto e retorna sua representação atualizada.
 */
export function alterarDisponibilidadeProduto(
  id: string,
  request: AlterarDisponibilidadeProdutoRequest,
): Promise<Produto> {
  return patchJson<AlterarDisponibilidadeProdutoRequest, Produto>(
    `/api/produtos/${encodeURIComponent(id)}/disponibilidade`,
    request,
  );
}

/**
 * Remove um código de barras específico sem excluir o produto.
 * A resposta HTTP 204 não tem corpo e é tratada pelo deleteRequest.
 */
export function removerCodigoBarrasProduto(
  produtoId: string,
  codigoBarras: string,
): Promise<void> {
  return deleteRequest(
    `/api/produtos/${encodeURIComponent(produtoId)}/codigos-barras/${encodeURIComponent(codigoBarras)}`,
  );
}