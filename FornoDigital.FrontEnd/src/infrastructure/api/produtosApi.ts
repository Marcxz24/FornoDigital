import type {
  AlterarDisponibilidadeProdutoRequest,
  EditarProdutoRequest,
  Produto,
  ProdutoRequest,
} from "../../features/produtos/types/produto";
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
 */
export function listarProdutos(): Promise<Produto[]> {
  return getJson<Produto[]>("/api/produtos/listar-produtos");
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