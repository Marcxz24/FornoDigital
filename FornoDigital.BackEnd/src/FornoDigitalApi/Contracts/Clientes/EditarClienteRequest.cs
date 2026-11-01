using System.ComponentModel.DataAnnotations;

namespace FornoDigitalApi.Contracts.Clientes
{
    /// <summary>
    /// Representa o objeto de transferência de dados (DTO / Request) recebido pela API 
    /// contendo as informações atualizadas para a edição de um cliente existente.
    /// Utiliza atributos de validação (<see cref="RequiredAttribute"/>, <see cref="StringLengthAttribute"/>, etc.) 
    /// para garantir a integridade dos dados na entrada da requisição HTTP.
    /// </summary>
    public sealed class EditarClienteRequest
    {
        /// <summary>
        /// Obtém ou define o novo nome completo obrigatório do cliente.
        /// Valigação: Campo obrigatório com limite máximo de 150 caracteres.
        /// </summary>
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(150, ErrorMessage = "O nome deve ter no máximo 150 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        /// <summary>
        /// Obtém ou define o novo número de telefone ou WhatsApp obrigatório de contato do cliente.
        /// Valigação: Campo obrigatório com limite máximo de 20 caracteres.
        /// </summary>
        [Required(ErrorMessage = "O telefone é obrigatório.")]
        [StringLength(20, ErrorMessage = "O telefone deve ter no máximo 20 caracteres.")]
        public string Telefone { get; set; } = string.Empty;

        /// <summary>
        /// Obtém ou define o novo número do CPF do cliente (opcional).
        /// Validação: Caso seja preenchido, deve conter exatamente 11 dígitos numéricos.
        /// </summary>
        [RegularExpression(@"^\d{11}$", ErrorMessage = "O CPF deve conter 11 dígitos.")]
        public string? Cpf { get; set; }

        /// <summary>
        /// Obtém ou define o novo endereço de e-mail do cliente (opcional).
        /// Validação: Deve seguir um formato de e-mail válido com limite máximo de 254 caracteres.
        /// </summary>
        [EmailAddress(ErrorMessage = "O e-mail informado não é válido.")]
        [StringLength(254)]
        public string? Email { get; set; }

        /// <summary>
        /// Obtém ou define o novo logradouro (rua, avenida, etc.) do endereço do cliente (opcional).
        /// Validação: Limite máximo de 200 caracteres.
        /// </summary>
        [StringLength(200)]
        public string? Endereco { get; set; }

        /// <summary>
        /// Obtém ou define o novo bairro correspondente ao endereço do cliente (opcional).
        /// Validação: Limite máximo de 100 caracteres.
        /// </summary>
        [StringLength(100)]
        public string? Bairro { get; set; }

        /// <summary>
        /// Obtém ou define o novo número da residência ou imóvel do cliente (opcional).
        /// Validação: Limite máximo de 20 caracteres.
        /// </summary>
        [StringLength(20)]
        public string? NumeroCasa { get; set; }

        /// <summary>
        /// Obtém ou define a nova cidade onde o cliente reside (opcional).
        /// Validação: Limite máximo de 100 caracteres.
        /// </summary>
        [StringLength(100)]
        public string? Cidade { get; set; }

        /// <summary>
        /// Obtém ou define a nova sigla do estado (UF) onde o cliente reside (opcional).
        /// Validação: Caso seja informado, deve conter exatamente duas letras (alfabéticas).
        /// </summary>
        [RegularExpression(@"^[a-zA-Z]{2}$", ErrorMessage = "O estado deve ser informado com duas letras.")]
        public string? Estado { get; set; }
    }
}
