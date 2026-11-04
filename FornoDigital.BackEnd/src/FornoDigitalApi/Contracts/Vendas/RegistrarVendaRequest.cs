using System.ComponentModel.DataAnnotations;

namespace FornoDigitalApi.Contracts.Vendas
{
    /// <summary>
    /// Representa a classe de requisição e transferência de dados para o registro de uma venda 
    /// (<see cref="RegistrarVendaRequest"/>), contendo informações do cliente, a lista de itens 
    /// e o desconto, além de implementar validações de modelo através de <see cref="IValidatableObject"/>.
    /// </summary>
    public sealed class RegistrarVendaRequest : IValidatableObject
    {
        /// <summary>
        /// Obtém ou inicializa o identificador único universal (UUID) opcional do cliente vinculado à venda.
        /// </summary>
        public Guid? ClienteId { get; init; }

        /// <summary>
        /// Obtém ou inicializa a lista de itens (<see cref="RegistrarVendaItemRequest"/>) que compõem a venda.
        /// </summary>
        [Required(ErrorMessage = "Informe os itens da venda.")]
        [MinLength(1, ErrorMessage = "A venda deve possuir pelo menos um item.")]
        public List<RegistrarVendaItemRequest> Itens { get; init; } = [];

        /// <summary>
        /// Obtém ou inicializa o valor do desconto aplicado sobre o total da venda.
        /// </summary>
        public decimal Desconto { get; init; }

        /// <summary>
        /// Realiza a validação personalizada do objeto de requisição, verificando se o identificador do cliente 
        /// fornecido é válido e se o valor do desconto atende aos critérios de negócio (não negativo e com até duas casas decimais).
        /// </summary>
        /// <param name="validationContext">O contexto de validação atual (<see cref="ValidationContext"/>).</param>
        /// <returns>Uma coleção de resultados de validação (<see cref="IEnumerable{ValidationResult}"/>) contendo eventuais erros encontrados.</returns>
        public IEnumerable<ValidationResult> Validate(
            ValidationContext validationContext)
        {
            if (ClienteId == Guid.Empty)
            {
                yield return new ValidationResult(
                    "O identificador do cliente não pode ser vazio.",
                    new[] { nameof(ClienteId) });
            }

            if (Desconto < 0)
            {
                yield return new ValidationResult(
                    "O desconto não pode ser negativo.",
                    new[] { nameof(Desconto) });
            }

            if (Desconto != decimal.Round(Desconto, 2))
            {
                yield return new ValidationResult(
                    "O desconto deve ter no máximo duas casas decimais.",
                    new[] { nameof(Desconto) });
            }
        }
    }
}
