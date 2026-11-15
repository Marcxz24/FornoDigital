/**
 * Representa os dados de produto recebidos da API pelo Front-End,
 * incluindo códigos de barras, disponibilidade, estoque e auditoria.
 */
export interface Produto {
  /** Identificador único universal (UUID) do produto. */
  id: string;
  /** Nome comercial do produto. */
  nome: string;
  /** Descrição detalhada opcional do produto. */
  descricao: string | null;
  /** Preço unitário de venda do produto. */
  preco: number;
  /** Indica se o produto está atualmente disponível para comercialização. */
  disponivel: boolean;
  /** Código numérico correspondente à unidade de medida comercial do produto. */
  unidadeMedida: number;
  /** Indica se o sistema gerencia e controla quantitativamente o estoque deste produto. */
  controlaEstoque: boolean;
  /** Quantidade atual disponível em estoque (nulo se o controle estiver desativado). */
  quantidadeEstoque: number | null;
  /** Indica se o produto possui saldo positivo em estoque. */
  temEstoque: boolean;
  /** Códigos de barras associados ao produto, preservados como texto. */
  codigosBarras: string[];
  /** Data e hora em UTC da criação/cadastro inicial do registro no formato ISO string. */
  dataCriacao: string;
  /** Data e hora em UTC da última atualização do registro (ou nulo se nunca foi alterado). */
  dataAtualizacao: string | null;
}

/**
 * Códigos de unidade de medida que o formulário pode enviar à API.
 * A união restringe o pedido às opções suportadas pelo sistema.
 */
export type UnidadeMedidaCodigo = 1 | 2 | 3 | 4 | 5;

/**
 * Dados enviados pelo Front-End ao cadastrar um produto.
 * Os códigos de barras são texto para preservar zeros à esquerda.
 */
export interface ProdutoRequest {
  nome: string;
  descricao: string | null;
  preco: number;
  disponivel: boolean;
  unidadeMedida: UnidadeMedidaCodigo;
  controlaEstoque: boolean;
  quantidadeEstoque: number | null;
  codigosBarras: string[];
}

/**
 * Dados aceitos pela rota de edição.
 * A disponibilidade é omitida porque possui uma rota PATCH própria.
 * Enviar a coleção de códigos substitui a lista atual; uma lista vazia a remove.
 */
export type EditarProdutoRequest = Omit<ProdutoRequest, "disponivel">;

/**
 * Pedido usado para ativar ou inativar um produto.
 */
export interface AlterarDisponibilidadeProdutoRequest {
  disponivel: boolean;
}