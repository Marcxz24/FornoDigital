namespace FornoDigitalApplication.Produtos.ListarProdutosPaginado
{
    /// <summary>
    /// Campos aceitos para ordenar a listagem paginada de produtos.
    /// O identificador é sempre usado como critério de desempate.
    /// </summary>
    public enum OrdenacaoProduto
    {
        /// <summary>Ordena pelo nome do produto.</summary>
        Nome = 0,

        /// <summary>Ordena pelo preço de venda.</summary>
        Preco = 1,

        /// <summary>Ordena pela data de cadastro.</summary>
        DataCriacao = 2
    }
}
