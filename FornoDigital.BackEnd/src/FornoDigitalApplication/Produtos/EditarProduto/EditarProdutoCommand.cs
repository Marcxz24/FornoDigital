using FornoDigitalDomain.Enums.Produtos;

namespace FornoDigitalApplication.Produtos.EditarProduto
{
    /// <summary>Dados necessários para editar os dados e a configuração de estoque de um produto.</summary>
    public sealed record EditarProdutoCommand(
        Guid Id,
        string Nome,
        string? Descricao,
        decimal Preco,
        UnidadeMedidaProduto UnidadeMedida,
        bool ControlaEstoque,
        decimal? QuantidadeEstoque);
}
