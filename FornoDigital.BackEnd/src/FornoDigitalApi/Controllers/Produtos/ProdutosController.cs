using FornoDigitalApi.Contracts.Comum;
using FornoDigitalApi.Contracts.Produtos;
using FornoDigitalApplication.Common.Paginacao;
using FornoDigitalApplication.Produtos.CadastrarProduto;
using FornoDigitalApplication.Produtos.AlterarDisponibilidadeProduto;
using FornoDigitalApplication.Produtos.EditarProduto;
using FornoDigitalApplication.Produtos.ListarProdutos;
using FornoDigitalApplication.Produtos.ListarProdutosPaginado;
using FornoDigitalApplication.Produtos.RemoverCodigoBarrasProduto;
using FornoDigitalDomain.Entities.Produtos;
using Microsoft.AspNetCore.Mvc;

namespace FornoDigitalApi.Controllers.Produtos
{
    /// <summary>
    /// Gerencia as rotas do catálogo de produtos.
    /// </summary>
    [ApiController]
    [Route("api/produtos")]
    public class ProdutosController : ControllerBase
    {
        private readonly CadastrarProdutoHandler _cadastrarProdutoHandler;
        private readonly ListarProdutosHandler _listarProdutosHandler;
        private readonly EditarProdutoHandler _editarProdutoHandler;
        private readonly AlterarDisponibilidadeProdutoHandler _alterarDisponibilidadeProdutoHandler;
        private readonly RemoverCodigoBarrasProdutoHandler _removerCodigoBarrasProdutoHandler;
        private readonly ListarProdutosPaginadoHandler _listarProdutosPaginadoHandler;

        // Valores aceitos no parâmetro filtro da listagem paginada.
        // Os nomes correspondem aos filtros já existentes no frontend.
        private static readonly IReadOnlyDictionary<string, FiltroProduto> FiltrosPermitidos =
            new Dictionary<string, FiltroProduto>(StringComparer.OrdinalIgnoreCase)
            {
                ["todos"] = FiltroProduto.Todos,
                ["disponiveis"] = FiltroProduto.Disponiveis,
                ["indisponiveis"] = FiltroProduto.Indisponiveis,
                ["estoque-zerado"] = FiltroProduto.EstoqueZerado
            };

        // Campos aceitos no parâmetro sortBy da listagem paginada.
        private static readonly IReadOnlyDictionary<string, OrdenacaoProduto> OrdenacoesPermitidas =
            new Dictionary<string, OrdenacaoProduto>(StringComparer.OrdinalIgnoreCase)
            {
                ["nome"] = OrdenacaoProduto.Nome,
                ["preco"] = OrdenacaoProduto.Preco,
                ["dataCriacao"] = OrdenacaoProduto.DataCriacao
            };

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="ProdutosController"/> injetando as dependências necessárias.
        /// </summary>
        /// <param name="cadastrarProdutoHandler">Manipulador responsável por processar o caso de uso de cadastro de novos produtos.</param>
        /// <param name="listarProdutosHandler">Manipulador responsável por processar o caso de uso de listagem de produtos.</param>
        /// <param name="editarProdutoHandler">Manipulador responsável por processar o caso de uso de edição de produtos.</param>
        /// <param name="alterarDisponibilidadeProdutoHandler">Manipulador responsável por processar o caso de uso de alteração de disponibilidade de produtos.</param>
        /// <param name="removerCodigoBarrasProdutoHandler">Manipulador responsável por processar o caso de uso de remoção de códigos de barras de produtos.</param>
        /// <param name="listarProdutosPaginadoHandler">Manipulador responsável por processar o caso de uso de listagem paginada de produtos.</param>
        public ProdutosController(
            CadastrarProdutoHandler cadastrarProdutoHandler,
            ListarProdutosHandler listarProdutosHandler,
            EditarProdutoHandler editarProdutoHandler,
            AlterarDisponibilidadeProdutoHandler alterarDisponibilidadeProdutoHandler,
            RemoverCodigoBarrasProdutoHandler removerCodigoBarrasProdutoHandler,
            ListarProdutosPaginadoHandler listarProdutosPaginadoHandler)
        {
            _cadastrarProdutoHandler = cadastrarProdutoHandler;
            _listarProdutosHandler = listarProdutosHandler;
            _editarProdutoHandler = editarProdutoHandler;
            _alterarDisponibilidadeProdutoHandler = alterarDisponibilidadeProdutoHandler;
            _removerCodigoBarrasProdutoHandler = removerCodigoBarrasProdutoHandler;
            _listarProdutosPaginadoHandler = listarProdutosPaginadoHandler;
        }

        /// <summary>
        /// Cadastra um novo produto no catálogo.
        /// </summary>
        /// <remarks>
        /// O preço deve ser positivo e ter até duas casas decimais.
        /// A descrição é opcional. A quantidade de estoque só pode ser informada
        /// quando o controle de estoque estiver ativo.
        /// </remarks>
        /// <response code="201">Produto cadastrado.</response>
        /// <response code="400">Dados inválidos.</response>
        /// <response code="409">Já existe um produto cadastrado com esse nome.</response>
        [HttpPost("cadastrar")]
        [ProducesResponseType(typeof(ProdutoResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CadastrarProduto([FromBody] CriarProdutoRequest request)
        {
            try
            {
                var command = new CadastrarProdutoCommand(
                    Nome: request.Nome,
                    Preco: request.Preco,
                    Disponivel: request.Disponivel,
                    UnidadeMedida: request.UnidadeMedida,
                    ControlaEstoque: request.ControlaEstoque,
                    Descricao: request.Descricao,
                    QuantidadeEstoque: request.QuantidadeEstoque,
                    CodigosBarras: request.CodigosBarras);

                var produto = await _cadastrarProdutoHandler.CadastrarAsync(command);

                return StatusCode(StatusCodes.Status201Created, ParaResponse(produto));
            }
            catch (InvalidOperationException exception)
            {
                return Conflict(new ProblemDetails
                {
                    Title = "Já existe um produto com esse nome.",
                    Detail = exception.Message,
                    Status = StatusCodes.Status409Conflict
                });
            }
        }

        /// <summary>
        /// Lista os produtos cadastrados no catálogo.
        /// </summary>
        /// <remarks>
        /// Retorna também os produtos indisponíveis. Se não houver produtos, retorna uma lista vazia.
        /// </remarks>
        [HttpGet("listar-produtos")]
        [ProducesResponseType(
            typeof(IReadOnlyList<ProdutoResponse>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<IReadOnlyList<ProdutoResponse>>> ListarProdutos()
        {
            var query = new ListarProdutosQuery();
            var produtos = await _listarProdutosHandler.ListarAsync(query);

            var response = produtos.Select(ParaResponse).ToList();

            return Ok(response);
        }

        /// <summary>
        /// Lista os produtos de forma paginada, com busca, filtro de situação e ordenação.
        /// </summary>
        /// <remarks>
        /// A busca procura o termo no nome, na descrição e nos códigos de barras do produto.
        /// Busca, filtro, ordenação e paginação são executados no banco de dados.
        ///
        /// Exemplo: <c>GET /api/produtos?page=1&amp;pageSize=50&amp;search=pão&amp;filtro=disponiveis</c>
        /// </remarks>
        /// <param name="page">Página desejada, iniciando em 1. Padrão: 1.</param>
        /// <param name="pageSize">Registros por página, entre 1 e 100. Padrão: 50.</param>
        /// <param name="search">Termo de busca opcional, com até 100 caracteres.</param>
        /// <param name="filtro">
        /// Situação: <c>todos</c> (padrão), <c>disponiveis</c>, <c>indisponiveis</c> ou <c>estoque-zerado</c>.
        /// </param>
        /// <param name="sortBy">Campo de ordenação: <c>nome</c> (padrão), <c>preco</c> ou <c>dataCriacao</c>.</param>
        /// <param name="sortDirection">Direção: <c>asc</c> (padrão) ou <c>desc</c>.</param>
        /// <param name="cancellationToken">Cancelado quando o cliente HTTP abandona a requisição.</param>
        /// <response code="200">Página de produtos.</response>
        /// <response code="400">Parâmetros de paginação, busca, filtro ou ordenação inválidos.</response>
        [HttpGet]
        [ProducesResponseType(typeof(ResultadoPaginadoResponse<ProdutoResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResultadoPaginadoResponse<ProdutoResponse>>> ListarProdutosPaginado(
            [FromQuery] int page = ParametrosPaginacao.PaginaPadrao,
            [FromQuery] int pageSize = ParametrosPaginacao.TamanhoPaginaPadrao,
            [FromQuery] string? search = null,
            [FromQuery] string? filtro = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortDirection = null,
            CancellationToken cancellationToken = default)
        {
            if (!ConversorParametrosConsulta.TentarConverterOpcao(
                    filtro, FiltrosPermitidos, FiltroProduto.Todos, out var filtroProduto))
            {
                ModelState.AddModelError(
                    nameof(filtro),
                    "Filtro inválido. Use todos, disponiveis, indisponiveis ou estoque-zerado.");
            }

            if (!ConversorParametrosConsulta.TentarConverterOpcao(
                    sortBy, OrdenacoesPermitidas, OrdenacaoProduto.Nome, out var ordenarPor))
            {
                ModelState.AddModelError(
                    nameof(sortBy),
                    "Ordenação inválida. Use nome, preco ou dataCriacao.");
            }

            if (!ConversorParametrosConsulta.TentarConverterDirecao(sortDirection, out var direcao))
            {
                ModelState.AddModelError(
                    nameof(sortDirection),
                    "Direção inválida. Use asc ou desc.");
            }

            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            try
            {
                var query = new ListarProdutosPaginadoQuery(
                    Page: page,
                    PageSize: pageSize,
                    Busca: search,
                    Filtro: filtroProduto,
                    OrdenarPor: ordenarPor,
                    Direcao: direcao);

                var resultado = await _listarProdutosPaginadoHandler.ListarAsync(query, cancellationToken);

                var response = new ResultadoPaginadoResponse<ProdutoResponse>(
                    Items: resultado.Items
                        .Select(produto => new ProdutoResponse(
                            Id: produto.Id,
                            Nome: produto.Nome,
                            Descricao: produto.Descricao,
                            Preco: produto.Preco,
                            Disponivel: produto.Disponivel,
                            UnidadeMedida: produto.UnidadeMedida,
                            ControlaEstoque: produto.ControlaEstoque,
                            QuantidadeEstoque: produto.QuantidadeEstoque,
                            TemEstoque: produto.TemEstoque,
                            CodigosBarras: produto.CodigosBarras,
                            DataCriacao: produto.DataCriacao,
                            DataAtualizacao: produto.DataAtualizacao))
                        .ToList(),
                    Page: resultado.Page,
                    PageSize: resultado.PageSize,
                    TotalCount: resultado.TotalCount,
                    TotalPages: resultado.TotalPages);

                return Ok(response);
            }
            catch (ArgumentException exception)
            {
                ModelState.AddModelError(exception.ParamName ?? "consulta", exception.Message);
                return ValidationProblem(ModelState);
            }
        }

        /// <summary>
        /// Edita os dados cadastrais e a configuração de estoque de um produto.
        /// </summary>
        /// <remarks>
        /// A disponibilidade não é alterada por esta operação. Use a rota de disponibilidade
        /// para inativar ou reativar o produto. Se o controle de estoque estiver ativo e a
        /// quantidade for nula, o estoque será definido como zero.
        /// </remarks>
        /// <param name="id">Identificador do produto.</param>
        /// <param name="request">Novos dados editáveis do produto.</param>
        /// <response code="200">Produto atualizado.</response>
        /// <response code="400">ID ou dados inválidos.</response>
        /// <response code="404">Produto não encontrado.</response>
        /// <response code="409">Outro produto já utiliza esse nome.</response>
        /// <response code="409">
        /// Outro produto já utiliza o nome ou algum código de barras informado.
        /// </response>
        [HttpPut("{id}/editar")]
        [ProducesResponseType(typeof(ProdutoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
        public async Task<ActionResult<ProdutoResponse>> EditarProduto(
            [FromRoute] Guid id,
            [FromBody] EditarProdutoRequest request)
        {
            try
            {
                var command = new EditarProdutoCommand(
                    Id: id,
                    Nome: request.Nome,
                    Descricao: request.Descricao,
                    Preco: request.Preco,
                    UnidadeMedida: request.UnidadeMedida,
                    ControlaEstoque: request.ControlaEstoque,
                    QuantidadeEstoque: request.QuantidadeEstoque,
                    CodigosBarras: request.CodigosBarras);

                var produto = await _editarProdutoHandler.EditarAsync(command);
                if (produto is null)
                {
                    return NotFound();
                }

                return Ok(ParaResponse(produto));
            }
            catch (ArgumentException exception)
            {
                ModelState.AddModelError("produto", exception.Message);
                return ValidationProblem(ModelState);
            }
            catch (InvalidOperationException exception)
            {
                return Conflict(new ProblemDetails
                {
                    Title = "Não foi possível editar o produto.",
                    Detail = exception.Message,
                    Status = StatusCodes.Status409Conflict
                });
            }
        }

        /// <summary>
        /// Remove um código de barras associado a um produto.
        /// </summary>
        /// <param name="produtoId">Identificador do produto.</param>
        /// <param name="codigoBarras">Código de barras a remover.</param>
        /// <response code="204">Código removido.</response>
        /// <response code="400">Identificador inválido.</response>
        /// <response code="404">Produto ou código não encontrado.</response>
        [HttpDelete("{produtoId:guid}/codigos-barras/{codigoBarras}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoverCodigoBarras(
            [FromRoute] Guid produtoId,
            [FromRoute] string codigoBarras)
        {
            try
            {
                var command = new RemoverCodigoBarrasProdutoCommand(
                    produtoId,
                    codigoBarras);

                var removido = await _removerCodigoBarrasProdutoHandler.RemoverAsync(command);

                return removido ? NoContent() : NotFound();
            }
            catch (ArgumentException exception)
            {
                ModelState.AddModelError("codigoBarras", exception.Message);
                return ValidationProblem(ModelState);
            }
        }

        /// <summary>
        /// Altera a disponibilidade de venda de um produto sem excluir seu cadastro.
        /// </summary>
        /// <remarks>
        /// Informe <c>false</c> para inativar e <c>true</c> para reativar. Os demais dados
        /// do produto são preservados e a data de atualização é registrada.
        /// </remarks>
        /// <param name="id">Identificador do produto.</param>
        /// <param name="request">Novo estado de disponibilidade.</param>
        /// <response code="200">Disponibilidade alterada; retorna o produto atualizado.</response>
        /// <response code="400">ID ou corpo inválido.</response>
        /// <response code="404">Produto não encontrado.</response>
        [HttpPatch("{id}/disponibilidade")]
        [ProducesResponseType(typeof(ProdutoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProdutoResponse>> AlterarDisponibilidade(
            [FromRoute] Guid id,
            [FromBody] AlterarDisponibilidadeProdutoRequest request)
        {
            try
            {
                var command = new AlterarDisponibilidadeProdutoCommand(
                    id,
                    request.Disponivel!.Value);

                var produto = await _alterarDisponibilidadeProdutoHandler.AlterarAsync(command);
                if (produto is null)
                {
                    return NotFound();
                }

                return Ok(ParaResponse(produto));
            }
            catch (ArgumentException exception)
            {
                ModelState.AddModelError("produto", exception.Message);
                return ValidationProblem(ModelState);
            }
        }

        private static ProdutoResponse ParaResponse(Produto produto) => new(
            Id: produto.Id,
            Nome: produto.Nome,
            Preco: produto.Preco,
            Disponivel: produto.Disponivel,
            UnidadeMedida: produto.UnidadeMedida,
            ControlaEstoque: produto.ControlaEstoque,
            Descricao: produto.Descricao,
            QuantidadeEstoque: produto.QuantidadeEstoque,
            TemEstoque: produto.TemEstoque,
            CodigosBarras: produto.CodigosBarras
                .Select(codigo => codigo.CodigoBarras)
                .ToList(),
            DataCriacao: produto.DataCriacao,
            DataAtualizacao: produto.DataAtualizacao);
    }
}
