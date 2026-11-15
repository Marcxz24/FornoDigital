using FornoDigitalDomain.Enums.Produtos;
using FornoDigitalDomain.Enums.Vendas;

namespace FornoDigitalApi.Contracts.Indicadores
{
    /// <summary>Indicadores de vendas de um período, devolvidos pela API.</summary>
    public sealed record IndicadoresVendasResponse(
        DateOnly DataInicial,
        DateOnly DataFinal,
        ResumoVendasResponse Resumo,
        IReadOnlyList<ProdutoMaisVendidoResponse> ProdutosMaisVendidos,
        IReadOnlyList<VendasPorFormaPagamentoResponse> VendasPorFormaPagamento,
        IReadOnlyList<SerieDiariaProdutoResponse> VendasDiariasPorProduto);

    /// <summary>Totais gerais do período.</summary>
    public sealed record ResumoVendasResponse(
        int QuantidadeVendas,
        decimal Faturamento,
        decimal TicketMedio);

    /// <summary>Produto do ranking por faturamento.</summary>
    public sealed record ProdutoMaisVendidoResponse(
        Guid ProdutoId,
        string NomeProduto,
        UnidadeMedidaProduto? UnidadeMedida,
        decimal Faturamento,
        decimal Quantidade,
        int QuantidadeVendas);

    /// <summary>Total de vendas de uma forma de pagamento (0 = não informada).</summary>
    public sealed record VendasPorFormaPagamentoResponse(
        FormaPagamento FormaPagamento,
        int QuantidadeVendas,
        decimal Total);

    /// <summary>Série diária de um produto.</summary>
    public sealed record SerieDiariaProdutoResponse(
        Guid ProdutoId,
        string NomeProduto,
        IReadOnlyList<PontoDiarioResponse> Pontos);

    /// <summary>Valores de um produto em um dia.</summary>
    public sealed record PontoDiarioResponse(
        DateOnly Data,
        decimal Faturamento,
        decimal Quantidade);
}