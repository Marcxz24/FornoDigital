using FornoDigitalDomain.Enums.Produtos;

namespace FornoDigitalApplication.Produtos.ListarProdutosPaginado
{
    /// <summary>
    /// Dados de um produto projetados diretamente pela consulta paginada.
    /// Contém os campos necessários para a listagem e para abrir a edição.
    /// </summary>
    public sealed record ProdutoListagemItem(
        Guid Id,
        string Nome,
        string? Descricao,
        decimal Preco,
        bool Disponivel,
        UnidadeMedidaProduto UnidadeMedida,
        bool ControlaEstoque,
        decimal? QuantidadeEstoque,
        IReadOnlyList<string> CodigosBarras,
        DateTime DataCriacao,
        DateTime? DataAtualizacao)
    {
        /// <summary>
        /// Indica se há saldo positivo em estoque controlado,
        /// seguindo a mesma regra de <c>Produto.TemEstoque</c>.
        /// </summary>
        public bool TemEstoque => ControlaEstoque && QuantidadeEstoque > 0;
    }
}
