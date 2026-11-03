/**
 * Representa a estrutura de dados de um cliente no sistema, contendo 
 * suas informações cadastrais, de contato, endereço e os metadados de auditoria.
 */
export interface Cliente {
  /** Identificador único universal (UUID) do cliente. */
  id: string;
  /** Nome completo ou razão social do cliente. */
  nome: string;
  /** Número de Cadastro de Pessoas Físicas (CPF) do cliente (opcional). */
  cpf: string | null;
  /** Endereço de correio eletrônico (e-mail) principal do cliente (opcional). */
  email: string | null;
  /** Número de telefone ou celular para contato (opcional). */
  telefone: string | null;
  /** Nome da rua, avenida ou logradouro do endereço do cliente (opcional). */
  endereco: string | null;
  /** Nome do bairro correspondente ao endereço (opcional). */
  bairro: string | null;
  /** Número do imóvel ou identificação complementar do endereço (opcional). */
  numeroCasa: string | null;
  /** Nome do município/cidade de residência ou localização (opcional). */
  cidade: string | null;
  /** Sigla da unidade federativa (Estado) correspondente (opcional). */
  estado: string | null;
  /** Data e hora em UTC do cadastro inicial do cliente no formato ISO string. */
  dataCadastro: string;
  /** Data e hora em UTC da última atualização do registro de cadastro (ou nulo se nunca foi alterado). */
  dataAtualizacao: string | null;
}