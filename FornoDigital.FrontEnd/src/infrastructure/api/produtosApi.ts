import type {
  Produto,
  ProdutoRequest,
} from "../../features/produtos/types/produto";
import { getJson, postJson } from "./httpClient";

/**
 * Busca todos os produtos cadastrados, inclusive os indisponíveis.
 * O algoritmo delega a requisição GET ao cliente HTTP compartilhado,
 * que monta a URL e trata respostas de erro.
 */
export function listarProdutos(): Promise<Produto[]> {
  return getJson<Produto[]>("/api/produtos/listar-produtos");
}

/**
 * Envia os dados de cadastro à API e retorna o produto criado.
 * O algoritmo delega o POST ao cliente HTTP, que serializa o pedido
 * como JSON e interpreta a resposta JSON da API.
 */
export function cadastrarProduto(
  request: ProdutoRequest,
): Promise<Produto> {
  return postJson<ProdutoRequest, Produto>(
    "/api/produtos/cadastrar",
    request,
  );
}