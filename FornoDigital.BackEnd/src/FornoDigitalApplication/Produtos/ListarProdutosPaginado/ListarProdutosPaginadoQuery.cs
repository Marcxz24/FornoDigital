using FornoDigitalApplication.Common.Paginacao;

namespace FornoDigitalApplication.Produtos.ListarProdutosPaginado
{
    /// <summary>
    /// Consulta uma página de produtos, com busca, filtro de situação e ordenação opcionais.
    /// </summary>
    /// <param name="Page">Página desejada, iniciando em 1.</param>
    /// <param name="PageSize">Quantidade de registros por página.</param>
    /// <param name="Busca">
    /// Termo pesquisado (contém) no nome, na descrição e nos códigos de barras do produto.
    /// </param>
    /// <param name="Filtro">Filtro de situação do produto.</param>
    /// <param name="OrdenarPor">Campo usado na ordenação.</param>
    /// <param name="Direcao">Direção da ordenação.</param>
    public sealed record ListarProdutosPaginadoQuery(
        int Page = ParametrosPaginacao.PaginaPadrao,
        int PageSize = ParametrosPaginacao.TamanhoPaginaPadrao,
        string? Busca = null,
        FiltroProduto Filtro = FiltroProduto.Todos,
        OrdenacaoProduto OrdenarPor = OrdenacaoProduto.Nome,
        DirecaoOrdenacao Direcao = DirecaoOrdenacao.Asc);
}
