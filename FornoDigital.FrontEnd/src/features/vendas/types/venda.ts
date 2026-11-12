/**
 * Representa um item retornado dentro de uma venda.
 */
export interface ItemVenda {
  id: string;
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

/**
 * Representa uma venda retornada pela API.
 */
export interface Venda {
  id: string;
  clienteId: string | null;
  itens: ItemVenda[];
  subtotal: number;
  desconto: number;
  total: number;
  dataCriacao: string;
}

/**
 * Representa um item enviado no pedido de registro.
 * O preço é obtido e calculado pelo Back-End.
 */
export interface ItemVendaRequest {
  produtoId: string;
  quantidade: number;
}

/**
 * Representa o corpo enviado para registrar uma venda.
 */
export interface RegistrarVendaRequest {
  clienteId: string | null;
  itens: ItemVendaRequest[];
  desconto: number;
}