using System.ComponentModel.DataAnnotations;

namespace FornoDigitalApi.Contracts.Vendas
{
    /// <summary>
    /// Representa a classe de requisição e transferência de dados para um item no registro de venda 
    /// (<see cref="RegistrarVendaItemRequest"/>), implementando validações de modelo personalizadas 
    /// através de <see cref="IValidatableObject"/>.
    /// </summary>
    public sealed class RegistrarVendaItemRequest : IValidatableObject
    {
        /// <summary>
        /// Obtém ou inicializa o identificador único universal (UUID) do produto associado ao item da requisição.
        /// </summary>
        public Guid ProdutoId { get; init; }

        /// <summary>
        /// Obtém ou inicializa a quantidade comercializada do produto.
        /// </summary>
        public decimal Quantidade { get; init; }

        /// <summary>
        /// Realiza a validação personalizada do objeto de requisição, garantindo que o identificador do produto 
        /// seja válido e que a quantidade seja estritamente maior que zero.
        /// </summary>
        /// <param name="validationContext">O contexto de validação atual (<see cref="ValidationContext"/>).</param>
        /// <returns>Uma coleção de resultados de validação (<see cref="IEnumerable{ValidationResult}"/>) contendo eventuais erros encontrados.</returns>
        public IEnumerable<ValidationResult> Validate(
        ValidationContext validationContext)
        {
            if (ProdutoId == Guid.Empty)
            {
                yield return new ValidationResult(
                    "O produto deve ser informado.",
                    new[] { nameof(ProdutoId) });
            }

            if (Quantidade <= 0)
            {
                yield return new ValidationResult(
                    "A quantidade deve ser maior que zero.",
                    new[] { nameof(Quantidade) });
            }
        }
    }
}
