using FornoDigitalDomain.Enums.Produtos;
using System.ComponentModel.DataAnnotations;

namespace FornoDigitalApi.Contracts.Produtos
{
    /// <summary>
    /// Contém campos e validações compartilhados por cadastro e edição de produtos.
    /// </summary>
    public abstract class ProdutoDadosRequest : IValidatableObject
    {
        /// <summary>Nome obrigatório do produto, limitado a 150 caracteres.</summary>
        [Required(ErrorMessage = "O nome do produto é obrigatório.")]
        [StringLength(150, ErrorMessage = "O nome deve ter no máximo 150 caracteres.")]
        public string Nome { get; init; } = string.Empty;

        /// <summary>Descrição opcional do produto, limitada a 500 caracteres.</summary>
        [StringLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
        public string? Descricao { get; init; }

        /// <summary>Preço de venda, maior que zero e com até duas casas decimais.</summary>
        [Range(
            typeof(decimal),
            "0.01",
            "79228162514264337593543950335",
            ErrorMessage = "O preço deve ser maior que zero.",
            ParseLimitsInInvariantCulture = true)]
        public decimal Preco { get; init; }

        /// <summary>Unidade de medida definida no enum de produtos.</summary>
        [EnumDataType(
            typeof(UnidadeMedidaProduto),
            ErrorMessage = "A unidade de medida informada não é válida.")]
        public UnidadeMedidaProduto UnidadeMedida { get; init; }

        /// <summary>Indica se o estoque será controlado.</summary>
        public bool ControlaEstoque { get; init; }

        /// <summary>Quantidade inicial ou atual; deve ser nula quando o controle estiver desativado.</summary>
        [Range(
            typeof(decimal),
            "0",
            "79228162514264337593543950335",
            ErrorMessage = "A quantidade em estoque não pode ser negativa.",
            ParseLimitsInInvariantCulture = true)]
        public decimal? QuantidadeEstoque { get; init; }

        /// <summary>Valida regras de precisão monetária e consistência do controle de estoque.</summary>
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
