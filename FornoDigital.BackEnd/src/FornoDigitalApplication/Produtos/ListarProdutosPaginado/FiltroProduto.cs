namespace FornoDigitalApplication.Produtos.ListarProdutosPaginado
{
    /// <summary>
    /// Filtros de situação aceitos pela listagem paginada de produtos.
    /// </summary>
    public enum FiltroProduto
    {
        /// <summary>Todos os produtos.</summary>
        Todos = 0,

        /// <summary>Somente produtos disponíveis para venda.</summary>
        Disponiveis = 1,

        /// <summary>Somente produtos indisponíveis para venda.</summary>
        Indisponiveis = 2,

        /// <summary>Produtos que controlam estoque e estão com quantidade zero ou sem quantidade.</summary>
        EstoqueZerado = 3
    }
}
