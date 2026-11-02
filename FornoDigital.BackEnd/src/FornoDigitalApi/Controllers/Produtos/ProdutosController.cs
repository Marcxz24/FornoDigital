using FornoDigitalApi.Contracts.Produtos;
using FornoDigitalApplication.Produtos.CadastrarProduto;
using FornoDigitalApplication.Produtos.ListarProdutos;
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

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="ProdutosController"/> injetando as dependências necessárias.
        /// </summary>
        /// <param name="cadastrarProdutoHandler">Manipulador responsável por processar o caso de uso de cadastro de novos produtos.</param>
        /// <param name="listarProdutosHandler">Manipulador responsável por processar o caso de uso de listagem de produtos.</param>
        public ProdutosController(
            CadastrarProdutoHandler cadastrarProdutoHandler,
            ListarProdutosHandler listarProdutosHandler)
        {
            _cadastrarProdutoHandler = cadastrarProdutoHandler;
            _listarProdutosHandler = listarProdutosHandler;
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
        [HttpPost("cadastrar")]
        [ProducesResponseType(typeof(ProdutoResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CadastrarProduto([FromBody] CriarProdutoRequest request)
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

            var response = new ProdutoResponse(
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

            return StatusCode(StatusCodes.Status201Created, response);
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

            var response = produtos.Select(produto => new ProdutoResponse(
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
                DataAtualizacao: produto.DataAtualizacao)).ToList();

            return Ok(response);
        }
    }
}
