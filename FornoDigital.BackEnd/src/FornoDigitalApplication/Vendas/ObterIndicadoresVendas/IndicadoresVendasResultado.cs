using FornoDigitalDomain.Enums.Produtos;
using FornoDigitalDomain.Enums.Vendas;

namespace FornoDigitalApplication.Vendas.ObterIndicadoresVendas
{
    /// <summary>
    /// Indicadores de vendas calculados para um período.
    /// </summary>
    public sealed record IndicadoresVendasResultado(
        DateOnly DataInicial,
        DateOnly DataFinal,
        ResumoVendasResultado Resumo,
        IReadOnlyList<ProdutoMaisVendidoResultado> ProdutosMaisVendidos,
        IReadOnlyList<VendasPorFormaPagamentoResultado> VendasPorFormaPagamento,
        IReadOnlyList<SerieDiariaProdutoResultado> VendasDiariasPorProduto);

    /// <summary>
    /// Totais gerais do período. O faturamento considera o total das vendas, já com desconto.
    /// </summary>
    public sealed record ResumoVendasResultado(
        int QuantidadeVendas,
        decimal Faturamento,
        decimal TicketMedio);

    /// <summary>
    /// Produto do ranking. O faturamento é a soma dos subtotais dos itens (antes do desconto da venda).
    /// A unidade vem do cadastro atual e é nula se o produto não existir mais.
    /// </summary>
    public sealed record ProdutoMaisVendidoResultado(
        Guid ProdutoId,
        string NomeProduto,
        UnidadeMedidaProduto? UnidadeMedida,
        decimal Faturamento,
        decimal Quantidade,
        int QuantidadeVendas);

    /// <summary>
    /// Total e quantidade de vendas de uma forma de pagamento.
    /// Vendas anteriores à forma de pagamento aparecem com o valor 0.
    /// </summary>
    public sealed record VendasPorFormaPagamentoResultado(
        FormaPagamento FormaPagamento,
        int QuantidadeVendas,
        decimal Total);

    /// <summary>
    /// Série diária de um produto, com todos os dias do período.
    /// </summary>
    public sealed record SerieDiariaProdutoResultado(
        Guid ProdutoId,
        string NomeProduto,
        IReadOnlyList<PontoDiarioResultado> Pontos);

    /// <summary>
    /// Valores de um produto em um dia; dias sem venda valem zero.
    /// </summary>
    public sealed record PontoDiarioResultado(
        DateOnly Data,
        decimal Faturamento,
        decimal Quantidade);
}