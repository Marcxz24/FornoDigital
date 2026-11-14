namespace FornoDigitalApi.Contracts.Produtos
{
    /// <summary>
    /// Dados recebidos pela API para cadastrar um produto.
    /// </summary>
    public sealed class CriarProdutoRequest : ProdutoDadosRequest
    {
        /// <summary>Indica se o produto estará disponível para venda inicialmente.</summary>
        public bool Disponivel { get; init; } = true;
    }
}
