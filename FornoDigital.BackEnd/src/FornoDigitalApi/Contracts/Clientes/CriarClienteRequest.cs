using System.ComponentModel.DataAnnotations;

namespace FornoDigitalApi.Contracts.Clientes
{
    /// <summary>
    /// Dados enviados à API para cadastrar um cliente.
    /// </summary>
    public sealed class CriarClienteRequest
    {
        /// <summary>
        /// Nome completo do cliente.
        /// </summary>
        [Required(ErrorMessage = "O Nome é Obrigatório.")]
        [StringLength(150, ErrorMessage = "O nome deve ter no máximo 150 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        /// <summary>
        /// CPF Opcional do cliente. Se informado, deve ser válido.
        /// O valor precisa ter 11 digitos
        /// </summary>
        [RegularExpression(@"^\d{11}$", ErrorMessage = "O CPF deve conter 11 dígitos.")]
        public string? Cpf { get; set; }

        /// <summary>
        /// Telefone para contato, Obrigatório.
        /// </summary>
        [Required(ErrorMessage = "O Telefone é Obrigatório.")]
        [StringLength(20)]
        public string Telefone { get; set; } = string.Empty;

        /// <summary>
        /// E-mail para contato. Opcional.
        /// </summary>
        [EmailAddress(ErrorMessage = "O e-mail informado não é válido.")]
        [StringLength(254)]
        public string? Email { get; init; }

        /// <summary>
        /// Logradouro do endereço. Opcional.
        /// </summary>
        [StringLength(200)]
        public string? Endereco { get; init; }

        /// <summary>
        /// Bairro. Opcional.
        /// </summary>
        [StringLength(100)]
        public string? Bairro { get; init; }

        /// <summary>
        /// Número do imóvel. Opcional.
        /// </summary>
        [StringLength(20)]
        public string? NumeroCasa { get; init; }

        /// <summary>
        /// Cidade. Opcional.
        /// </summary>
        [StringLength(100)]
        public string? Cidade { get; init; }

        /// <summary>
        /// UF com duas letras. Opcional.
        /// </summary>
        [RegularExpression(
            @"^[a-zA-Z]{2}$",
            ErrorMessage = "O estado deve ser informado com duas letras.")]
        public string? Estado { get; init; }
    }
}
