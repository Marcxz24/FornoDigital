using FornoDigitalApplication.Common.Paginacao;

namespace FornoDigitalApplication.Clientes.ListarClientesPaginado
{
    /// <summary>
    /// Contrato de leitura para consultas de clientes que retornam dados projetados.
    /// A implementação deve aplicar busca, ordenação e paginação no banco de dados.
    /// </summary>
    public interface IClienteConsultaRepository
    {
        /// <summary>
        /// Retorna uma página de clientes conforme os parâmetros já validados.
        /// </summary>
        /// <param name="query">Parâmetros validados de busca, ordenação e paginação.</param>
        /// <param name="cancellationToken">Token para cancelar a consulta.</param>
        Task<ResultadoPaginado<ClienteListagemItem>> ListarPaginadoAsync(
            ListarClientesPaginadoQuery query,
            CancellationToken cancellationToken = default);
    }
}
