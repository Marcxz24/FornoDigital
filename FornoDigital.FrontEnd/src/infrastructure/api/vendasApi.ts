import type {
  RegistrarVendaRequest,
  Venda,
} from "../../features/vendas/types/venda";
import { getJson, postJson } from "./httpClient";

/**
 * Busca todas as vendas, incluindo os itens de cada venda.
 */
export function listarVendas(): Promise<Venda[]> {
  return getJson<Venda[]>("/api/vendas/listar-vendas");
}

/**
 * Busca uma venda específica pelo identificador.
 */
export function obterVenda(id: string): Promise<Venda> {
  return getJson<Venda>(
    `/api/vendas/obter-venda/${encodeURIComponent(id)}`,
  );
}

/**
 * Registra uma venda. A API retorna os valores finais calculados.
 */
export function registrarVenda(
  request: RegistrarVendaRequest,
): Promise<Venda> {
  return postJson<RegistrarVendaRequest, Venda>(
    "/api/vendas/registrar",
    request,
  );
}