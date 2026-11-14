using FornoDigitalApi.Contracts.Produtos;
using FornoDigitalApplication.Produtos.CadastrarProduto;
using FornoDigitalApplication.Produtos.AlterarDisponibilidadeProduto;
using FornoDigitalApplication.Produtos.EditarProduto;
using FornoDigitalApplication.Produtos.ListarProdutos;
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

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="ProdutosController"/> injetando as dependências necessárias.
        /// </summary>
        /// <param name="cadastrarProdutoHandler">Manipulador responsável por processar o caso de uso de cadastro de novos produtos.</param>
        /// <param name="listarProdutosHandler">Manipulador responsável por processar o caso de uso de listagem de produtos.</param>
        /// <param name="editarProdutoHandler">Manipulador responsável por processar o caso de uso de edição de produtos.</param>
        /// <param name="alterarDisponibilidadeProdutoHandler">Manipulador responsável por processar o caso de uso de alteração de disponibilidade de produtos.</param>
        public ProdutosController(
            CadastrarProdutoHandler cadastrarProdutoHandler,
            ListarProdutosHandler listarProdutosHandler,
            EditarProdutoHandler editarProdutoHandler,
            AlterarDisponibilidadeProdutoHandler alterarDisponibilidadeProdutoHandler)
        {
            _cadastrarProdutoHandler = cadastrarProdutoHandler;
            _listarProdutosHandler = listarProdutosHandler;
            _editarProdutoHandler = editarProdutoHandler;
            _alterarDisponibilidadeProdutoHandler = alterarDisponibilidadeProdutoHandler;
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
                    QuantidadeEstoque: request.QuantidadeEstoque);

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
                    QuantidadeEstoque: request.QuantidadeEstoque);

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
                    Title = "Já existe outro produto com esse nome.",
                    Detail = exception.Message,
                    Status = StatusCodes.Status409Conflict
                });
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
            DataCriacao: produto.DataCriacao,
            DataAtualizacao: produto.DataAtualizacao);
    }
}
