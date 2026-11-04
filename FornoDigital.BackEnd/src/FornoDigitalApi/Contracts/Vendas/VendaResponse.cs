namespace FornoDigitalApi.Contracts.Vendas
{
    /// <summary>
    /// Representa o objeto de transferência de dados (DTO) em formato record <see cref="VendaResponse"/> 
    /// utilizado para retornar os detalhes completos de uma venda consolidada nas respostas da API.
    /// </summary>
    /// <param name="Id">O identificador único universal (UUID) da venda.</param>
    /// <param name="ClienteId">O identificador único universal (UUID) opcional do cliente associado à venda.</param>
    /// <param name="Itens">A coleção somente leitura (<see cref="IReadOnlyList{T}"/>) contendo os itens que compõem a venda (<see cref="ItemVendaResponse"/>).</param>
    /// <param name="Subtotal">O valor subtotal acumulado dos itens da venda.</param>
    /// <param name="Desconto">O valor do desconto aplicado sobre a venda.</param>
    /// <param name="Total">O valor financeiro total final da transação.</param>
    /// <param name="DataCriacao">A data e horário (em formato UTC) em que a venda foi registrada.</param>
    public sealed record VendaResponse(
        Guid Id,
        Guid? ClienteId,
        IReadOnlyList<ItemVendaResponse> Itens,
        decimal Subtotal,
        decimal Desconto,
        decimal Total,
        DateTime DataCriacao);
}
