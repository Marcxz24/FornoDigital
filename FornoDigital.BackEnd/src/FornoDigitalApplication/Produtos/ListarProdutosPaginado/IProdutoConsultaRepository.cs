using FornoDigitalApplication.Common.Paginacao;

namespace FornoDigitalApplication.Produtos.ListarProdutosPaginado
{
    /// <summary>
    /// Contrato de leitura para consultas de produtos que retornam dados projetados.
    /// A implementação deve aplicar busca, filtros, ordenação e paginação no banco de dados.
    /// </summary>
    public interface IProdutoConsultaRepository
    {
        /// <summary>
        /// Retorna uma página de produtos conforme os parâmetros já validados.
        /// </summary>
        /// <param name="query">Parâmetros validados de busca, filtro, ordenação e paginação.</param>
        /// <param name="cancellationToken">Token para cancelar a consulta.</param>
        Task<ResultadoPaginado<ProdutoListagemItem>> ListarPaginadoAsync(
            ListarProdutosPaginadoQuery query,
            CancellationToken cancellationToken = default);
    }
}
