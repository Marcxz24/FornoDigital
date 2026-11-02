using FornoDigitalDomain.Enums.Produtos;

namespace FornoDigitalApi.Contracts.Produtos
{
    /// <summary>
    /// Dados do produto devolvidos pela API.
    /// </summary>
    public sealed record ProdutoResponse(
        Guid Id,
        string Nome,
        string? Descricao,
        decimal Preco,
        bool Disponivel,
        UnidadeMedidaProduto UnidadeMedida,
        bool ControlaEstoque,
        decimal? QuantidadeEstoque,
        bool TemEstoque,
        DateTime DataCriacao,
        DateTime? DataAtualizacao
    );
}
