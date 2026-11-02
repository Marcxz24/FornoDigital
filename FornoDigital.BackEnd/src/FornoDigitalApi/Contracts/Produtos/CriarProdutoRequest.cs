using FornoDigitalDomain.Enums.Produtos;
using System.ComponentModel.DataAnnotations;

namespace FornoDigitalApi.Contracts.Produtos
{
    /// <summary>
    /// Representa o objeto de transferência de dados (DTO / Request) recebido pela API 
    /// contendo as informações necessárias para a criação e validação inicial de um novo produto.
    /// </summary>
    public sealed class CriarProdutoRequest : IValidatableObject
    {
        /// <summary>
        /// Obtém ou define o nome obrigatório do produto (máximo de 150 caracteres).
        /// </summary>
        [Required(ErrorMessage = "O nome do produto é obrigatório.")]
        [StringLength(150, ErrorMessage = "O nome deve ter no máximo 150 caracteres.")]
        public string Nome { get; init; } = string.Empty;

        /// <summary>
        /// Obtém ou define a descrição detalhada opcional do produto (máximo de 500 caracteres).
        /// </summary>
        [StringLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
        public string? Descricao { get; init; }

        /// <summary>
        /// Obtém ou define o preço unitário de venda do produto (deve ser maior que zero).
        /// </summary>
        [Range(
            typeof(decimal),
            "0.01",
            "79228162514264337593543950335",
            ErrorMessage = "O preço deve ser maior que zero.",
            ParseLimitsInInvariantCulture = true)]
        public decimal Preco { get; init; }

        /// <summary>
        /// Obtém ou define um valor que indica se o produto estará disponível para venda imediata (padrão é <c>true</c>).
        /// </summary>
        public bool Disponivel { get; init; } = true;

        /// <summary>
        /// Obtém ou define a unidade de medida comercial associada ao produto.
        /// </summary>
        [EnumDataType(
        typeof(UnidadeMedidaProduto),
        ErrorMessage = "A unidade de medida informada não é válida.")]
        public UnidadeMedidaProduto UnidadeMedida { get; init; }

        /// <summary>
        /// Obtém ou define um valor que indica se o produto terá controle quantitativo de estoque gerenciado.
        /// </summary>
        public bool ControlaEstoque { get; init; }

        /// <summary>
        /// Obtém ou define a quantidade inicial disponível em estoque (não pode ser negativa).
        /// </summary>
        [Range(
            typeof(decimal),
            "0",
            "79228162514264337593543950335",
            ErrorMessage = "A quantidade em estoque não pode ser negativa.",
            ParseLimitsInInvariantCulture = true)]
        public decimal? QuantidadeEstoque { get; init; }

        /// <summary>
        /// Valida regras adicionais relacionadas aos dados desta requisição.
        /// </summary>
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Preco > 0 && Preco != decimal.Round(Preco, 2))
            {
                yield return new ValidationResult(
                    "O preço deve ter no máximo duas casas decimais.",
                    new[] { nameof(Preco) });
            }

            if (!ControlaEstoque && QuantidadeEstoque.HasValue)
            {
                yield return new ValidationResult(
                    "Informe a quantidade somente quando o controle de estoque estiver ativo.",
                    new[] { nameof(QuantidadeEstoque) });
            }
        }
    }
}
