using FornoDigitalApplication.Common.Paginacao;

namespace FornoDigitalApplication.Clientes.ListarClientesPaginado
{
    /// <summary>
    /// Executa a consulta paginada de clientes.
    /// Valida os parâmetros recebidos e delega a consulta ao repositório de leitura.
    /// </summary>
    public sealed class ListarClientesPaginadoHandler
    {
        private readonly IClienteConsultaRepository _clienteConsultaRepository;

        /// <summary>
        /// Inicializa o handler com o repositório de leitura de clientes.
        /// </summary>
        public ListarClientesPaginadoHandler(IClienteConsultaRepository clienteConsultaRepository)
        {
            _clienteConsultaRepository = clienteConsultaRepository;
        }

        /// <summary>
        /// Retorna a página de clientes solicitada.
        /// </summary>
        /// <exception cref="ArgumentException">
        /// Lançada quando a página, o tamanho da página, a ordenação ou o termo de busca são inválidos.
        /// </exception>
        public Task<ResultadoPaginado<ClienteListagemItem>> ListarAsync(
            ListarClientesPaginadoQuery query,
            CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(query);

            ParametrosPaginacao.Validar(query.Page, query.PageSize);

            if (!Enum.IsDefined(query.OrdenarPor) || !Enum.IsDefined(query.Direcao))
            {
                throw new ArgumentException("A ordenação informada não é válida.", nameof(query));
            }

            var consultaNormalizada = query with
            {
                Busca = ParametrosPaginacao.NormalizarBusca(query.Busca)
            };

            return _clienteConsultaRepository.ListarPaginadoAsync(
                consultaNormalizada,
                cancellationToken);
        }
    }
}
