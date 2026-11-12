/**
 * Representa a estrutura de dados de um cliente recebido pela aplicação,
 * incluindo informações cadastrais, de contato, endereço e datas.
 */
export interface Cliente {
  /** Identificador único do cliente. */
  id: string;
  /** Nome completo ou razão social do cliente. */
  nome: string;
  /** CPF do cliente, quando informado. */
  cpf: string | null;
  /** E-mail do cliente, quando informado. */
  email: string | null;
  /** Telefone ou celular para contato. */
  telefone: string | null;
  /** Endereço do cliente, quando informado. */
  endereco: string | null;
  /** Bairro do cliente, quando informado. */
  bairro: string | null;
  /** Número da residência, quando informado. */
  numeroCasa: string | null;
  /** Cidade do cliente, quando informada. */
  cidade: string | null;
  /** Sigla do estado, quando informada. */
  estado: string | null;
  /** Data e hora UTC do cadastro. */
  dataCadastro: string;
  /** Data e hora UTC da última atualização, ou null. */
  dataAtualizacao: string | null;
}

/**
 * Representa o corpo enviado para cadastrar ou editar um cliente.
 * Campos opcionais são enviados como null quando não forem informados.
 */
export interface ClienteRequest {
  nome: string;
  telefone: string;
  cpf: string | null;
  email: string | null;
  endereco: string | null;
  bairro: string | null;
  numeroCasa: string | null;
  cidade: string | null;
  estado: string | null;
}