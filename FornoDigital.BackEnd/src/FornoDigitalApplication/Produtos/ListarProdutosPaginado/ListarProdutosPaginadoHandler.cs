using FornoDigitalApplication.Common.Paginacao;

namespace FornoDigitalApplication.Produtos.ListarProdutosPaginado
{
    /// <summary>
    /// Executa a consulta paginada de produtos.
    /// Valida os parâmetros recebidos e delega a consulta ao repositório de leitura.
    /// </summary>
    public sealed class ListarProdutosPaginadoHandler
    {
        private readonly IProdutoConsultaRepository _produtoConsultaRepository;

        /// <summary>
        /// Inicializa o handler com o repositório de leitura de produtos.
        /// </summary>
        public ListarProdutosPaginadoHandler(IProdutoConsultaRepository produtoConsultaRepository)
        {
            _produtoConsultaRepository = produtoConsultaRepository;
        }

        /// <summary>
        /// Retorna a página de produtos solicitada.
        /// </summary>
        /// <exception cref="ArgumentException">
        /// Lançada quando a página, o tamanho da página, o filtro, a ordenação ou o termo de busca são inválidos.
        /// </exception>
        public Task<ResultadoPaginado<ProdutoListagemItem>> ListarAsync(
            ListarProdutosPaginadoQuery query,
            CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(query);

            ParametrosPaginacao.Validar(query.Page, query.PageSize);

            if (!Enum.IsDefined(query.Filtro))
            {
                throw new ArgumentException("O filtro informado não é válido.", nameof(query));
            }

            if (!Enum.IsDefined(query.OrdenarPor) || !Enum.IsDefined(query.Direcao))
            {
                throw new ArgumentException("A ordenação informada não é válida.", nameof(query));
            }

            var consultaNormalizada = query with
            {
                Busca = ParametrosPaginacao.NormalizarBusca(query.Busca)
            };

            return _produtoConsultaRepository.ListarPaginadoAsync(
                consultaNormalizada,
                cancellationToken);
        }
    }
}
