using System.ComponentModel.DataAnnotations;

namespace FornoDigitalApi.Contracts.Produtos
{
    /// <summary>
    /// Informa o novo estado de disponibilidade do produto.
    /// </summary>
    public sealed class AlterarDisponibilidadeProdutoRequest
    {
        /// <summary>True para disponibilizar e false para inativar o produto.</summary>
        [Required(ErrorMessage = "Informe se o produto estará disponível.")]
        public bool? Disponivel { get; init; }
    }
}
