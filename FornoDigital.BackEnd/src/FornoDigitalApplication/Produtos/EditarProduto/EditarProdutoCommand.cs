using FornoDigitalDomain.Enums.Produtos;
using System.Collections.Generic;

namespace FornoDigitalApplication.Produtos.EditarProduto
{
    /// <summary>
    /// Dados necessários para editar um produto existente.
    /// </summary>
    /// <param name="Id">Identificador do produto.</param>
    /// <param name="Nome">Novo nome do produto.</param>
    /// <param name="Descricao">Nova descrição opcional.</param>
    /// <param name="Preco">Novo preço de venda.</param>
    /// <param name="UnidadeMedida">Nova unidade de medida comercial.</param>
    /// <param name="ControlaEstoque">Indica se o estoque será controlado.</param>
    /// <param name="QuantidadeEstoque">Nova quantidade de estoque.</param>
    /// <param name="CodigosBarras">
    /// Coleção opcional. Nulo preserva os códigos atuais; coleção vazia remove todos.
    /// </param>
    public sealed record EditarProdutoCommand(
        Guid Id,
        string Nome,
        string? Descricao,
        decimal Preco,
        UnidadeMedidaProduto UnidadeMedida,
        bool ControlaEstoque,
        decimal? QuantidadeEstoque,
        IReadOnlyCollection<string>? CodigosBarras = null);
}