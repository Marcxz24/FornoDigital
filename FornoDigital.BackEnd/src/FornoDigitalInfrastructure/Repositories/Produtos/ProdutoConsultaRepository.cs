using FornoDigitalApplication.Common.Paginacao;
using FornoDigitalApplication.Produtos.ListarProdutosPaginado;
using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalInfrastructure.Data;
using FornoDigitalInfrastructure.Repositories.Comum;
using Microsoft.EntityFrameworkCore;

namespace FornoDigitalInfrastructure.Repositories.Produtos
{
    /// <summary>
    /// Implementa as consultas de leitura de produtos com EF Core e SQLite.
    /// Busca, filtros, ordenação e paginação são executados no banco de dados e o resultado
    /// é projetado diretamente para <see cref="ProdutoListagemItem"/>, sem rastreamento.
    /// </summary>
    public sealed class ProdutoConsultaRepository : IProdutoConsultaRepository
    {
        private readonly FornoDigitalDbContext _context;

        /// <summary>
        /// Inicializa o repositório de leitura com o contexto do banco de dados.
        /// </summary>
        public ProdutoConsultaRepository(FornoDigitalDbContext context)
        {
            _context = context;
        }

        /// <inheritdoc />
        public async Task<ResultadoPaginado<ProdutoListagemItem>> ListarPaginadoAsync(
            ListarProdutosPaginadoQuery query,
            CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(query);

            var produtos = AplicarFiltro(_context.Produtos.AsNoTracking(), query.Filtro);
            produtos = AplicarBusca(produtos, query.Busca);

            // O total considera busca e filtro, mas não a paginação.
            var totalCount = await produtos.CountAsync(cancellationToken);
            var deslocamento = (long)(query.Page - 1) * query.PageSize;

            // Evita consultar o banco quando a página pedida está além do último registro.
            if (totalCount == 0 || deslocamento >= totalCount)
            {
                return new ResultadoPaginado<ProdutoListagemItem>(
                    Array.Empty<ProdutoListagemItem>(),
                    query.Page,
                    query.PageSize,
                    totalCount);
            }

            // Os códigos de barras são projetados como texto na mesma consulta,
            // somente para os produtos da página, evitando consultas N+1.
            var itens = await Ordenar(produtos, query.OrdenarPor, query.Direcao)
                .Skip((int)deslocamento)
                .Take(query.PageSize)
                .Select(produto => new ProdutoListagemItem(
                    produto.Id,
                    produto.Nome,
                    produto.Descricao,
                    produto.Preco,
                    produto.Disponivel,
                    produto.UnidadeMedida,
                    produto.ControlaEstoque,
                    produto.QuantidadeEstoque,
                    produto.CodigosBarras
                        .OrderBy(codigo => codigo.CodigoBarras)
                        .Select(codigo => codigo.CodigoBarras)
                        .ToList(),
                    produto.DataCriacao,
                    produto.DataAtualizacao))
                .ToListAsync(cancellationToken);

            return new ResultadoPaginado<ProdutoListagemItem>(
                itens,
                query.Page,
                query.PageSize,
                totalCount);
        }

        /// <summary>
        /// Aplica o filtro de situação, com as mesmas regras usadas anteriormente no frontend.
        /// </summary>
        private static IQueryable<Produto> AplicarFiltro(IQueryable<Produto> produtos, FiltroProduto filtro) =>
            filtro switch
            {
                FiltroProduto.Disponiveis => produtos.Where(produto => produto.Disponivel),
                FiltroProduto.Indisponiveis => produtos.Where(produto => !produto.Disponivel),
                FiltroProduto.EstoqueZerado => produtos.Where(produto =>
                    produto.ControlaEstoque &&
                    (produto.QuantidadeEstoque == null || produto.QuantidadeEstoque <= 0m)),
                _ => produtos
            };

        /// <summary>
        /// Filtra por nome, descrição ou código de barras contendo o termo,
        /// preservando os campos pesquisados anteriormente pela listagem.
        /// </summary>
        /// <remarks>
        /// Um padrão "contém" não utiliza índice; a tabela de produtos é percorrida uma vez
        /// e, para cada produto, os códigos são localizados pela chave (Produto_Id, Codigo_Barras).
        /// </remarks>
        private static IQueryable<Produto> AplicarBusca(IQueryable<Produto> produtos, string? busca)
        {
            if (busca is null)
            {
                return produtos;
            }

            var padrao = PadraoBusca.Contem(busca);

            return produtos.Where(produto =>
                EF.Functions.Like(produto.Nome, padrao, PadraoBusca.CaractereEscape) ||
                (produto.Descricao != null &&
                    EF.Functions.Like(produto.Descricao, padrao, PadraoBusca.CaractereEscape)) ||
                produto.CodigosBarras.Any(codigo =>
                    EF.Functions.Like(codigo.CodigoBarras, padrao, PadraoBusca.CaractereEscape)));
        }

        /// <summary>
        /// Aplica a ordenação solicitada e usa o identificador como desempate,
        /// garantindo que nenhum registro se repita ou desapareça entre páginas.
        /// </summary>
        private static IOrderedQueryable<Produto> Ordenar(
            IQueryable<Produto> produtos,
            OrdenacaoProduto ordenarPor,
            DirecaoOrdenacao direcao)
        {
            var crescente = direcao == DirecaoOrdenacao.Asc;

            return ordenarPor switch
            {
                OrdenacaoProduto.Preco => crescente
                    ? produtos.OrderBy(p => p.Preco).ThenBy(p => p.Nome).ThenBy(p => p.Id)
                    : produtos.OrderByDescending(p => p.Preco).ThenBy(p => p.Nome).ThenBy(p => p.Id),

                OrdenacaoProduto.DataCriacao => crescente
                    ? produtos.OrderBy(p => p.DataCriacao).ThenBy(p => p.Id)
                    : produtos.OrderByDescending(p => p.DataCriacao).ThenByDescending(p => p.Id),

                _ => crescente
                    ? produtos.OrderBy(p => p.Nome).ThenBy(p => p.Id)
                    : produtos.OrderByDescending(p => p.Nome).ThenByDescending(p => p.Id)
            };
        }
    }
}
