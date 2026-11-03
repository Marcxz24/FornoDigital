/**
 * Representa a estrutura de dados de um produto no sistema, espelhando 
 * as propriedades da entidade de domínio e os metadados de controle e auditoria.
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
  /** Data e hora em UTC da criação/cadastro inicial do registro no formato ISO string. */
  dataCriacao: string;
  /** Data e hora em UTC da última atualização do registro (ou nulo se nunca foi alterado). */
  dataAtualizacao: string | null;
}