import type {
  AlterarDisponibilidadeProdutoRequest,
  EditarProdutoRequest,
  Produto,
  ProdutoRequest,
} from "../../features/produtos/types/produto";
import {
  getJson,
  patchJson,
  postJson,
  putJson,
} from "./httpClient";

/**
 * Busca todos os produtos, inclusive os indisponíveis.
 * Delega o GET ao cliente HTTP compartilhado.
 */
export function listarProdutos(): Promise<Produto[]> {
  return getJson<Produto[]>("/api/produtos/listar-produtos");
}

/**
 * Envia o cadastro e retorna o produto criado pela API.
 * O cliente HTTP serializa o pedido como JSON.
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
 * Atualiza os dados e a configuração de estoque do produto.
 * A disponibilidade não é incluída neste pedido; ela usa a rota PATCH separada.
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