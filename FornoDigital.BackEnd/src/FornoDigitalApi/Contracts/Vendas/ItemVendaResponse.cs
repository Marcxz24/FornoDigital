namespace FornoDigitalApi.Contracts.Vendas
{
    /// <summary>
    /// Representa o objeto de transferência de dados (DTO) em formato record <see cref="ItemVendaResponse"/> 
    /// utilizado para retornar os detalhes de um item de venda nas respostas da API.
    /// </summary>
    /// <param name="Id">O identificador único universal (UUID) do item de venda.</param>
    /// <param name="ProdutoId">O identificador único universal (UUID) do produto comercializado.</param>
    /// <param name="NomeProduto">O nome descritivo do produto no momento da venda.</param>
    /// <param name="Quantidade">A quantidade comercializada do produto.</param>
    /// <param name="PrecoUnitario">O preço unitário de venda do produto.</param>
    /// <param name="Subtotal">O valor subtotal calculado para o item.</param>
    public sealed record ItemVendaResponse(
        Guid Id,
        Guid ProdutoId,
        string NomeProduto,
        decimal Quantidade,
        decimal PrecoUnitario,
        decimal Subtotal);
}
