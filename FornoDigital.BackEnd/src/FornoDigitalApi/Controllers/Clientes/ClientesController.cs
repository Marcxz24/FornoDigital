using FornoDigitalApi.Contracts.Clientes;
using FornoDigitalApi.Contracts.Comum;
using FornoDigitalApplication.Clientes.CadastrarCliente;
using FornoDigitalApplication.Clientes.ListarCliente;
using FornoDigitalApplication.Clientes.EditarCliente;
using FornoDigitalApplication.Clientes.ExcluirCliente;
using FornoDigitalApplication.Clientes.ListarClientesPaginado;
using FornoDigitalApplication.Common.Paginacao;
using Microsoft.AspNetCore.Mvc;

namespace FornoDigitalApi.Controllers.Clientes
{
    /// <summary>
    /// Gerencia as rotas relacionadas ao cadastro de clientes.
    /// </summary>
    /// <remarks>
    /// As rotas deste controller começam com <c>/api/clientes</c>.
    /// </remarks>
    [ApiController]
    [Route("api/clientes")]
    public class ClientesController : ControllerBase
    {
        // Dependencia do CadastrarClienteHandler, que é injetada pelo construtor
        private readonly CadastrarClienteHandler _cadastrarClienteHandler;

        // Dependencia do EditarClienteHandler, que é injetada pelo construtor
        private readonly EditarClienteHandler _editarClienteHandler;

        // Dependencia do ExcluirClienteHandler, que é injetada pelo construtor
        private readonly ExcluirClienteHandler _excluirClienteHandler;

        // Dependencia do ListarClientesHandler, que é injetada pelo construtor
        private readonly ListarClientesHandler _listarClientesHandler;

        // Dependencia do ListarClientesPaginadoHandler, que é injetada pelo construtor
        private readonly ListarClientesPaginadoHandler _listarClientesPaginadoHandler;

        // Campos aceitos no parâmetro sortBy da listagem paginada.
        private static readonly IReadOnlyDictionary<string, OrdenacaoCliente> OrdenacoesPermitidas =
            new Dictionary<string, OrdenacaoCliente>(StringComparer.OrdinalIgnoreCase)
            {
                ["nome"] = OrdenacaoCliente.Nome,
                ["cidade"] = OrdenacaoCliente.Cidade,
                ["dataCadastro"] = OrdenacaoCliente.DataCadastro
            };


        /// <summary>
        /// Inicializa o controller de clientes.
        /// </summary>
        /// <param name="cadastrarClienteHandler">
        /// Caso de uso responsável por cadastrar um cliente.
        /// </param>
        /// <param name="editarClienteHandler">
        /// Caso de uso responsável por editar um cliente.
        /// </param>
        /// <param name="excluirClienteHandler">
        /// Caso de uso responsável por excluir um cliente.
        /// </param>
        /// <param name="listarClientesHandler">
        /// Caso de uso responsável por listar os clientes.
        /// </param>
        /// <param name="listarClientesPaginadoHandler">
        /// Caso de uso responsável por listar os clientes de forma paginada.
        /// </param>
        public ClientesController(
            CadastrarClienteHandler cadastrarClienteHandler, 
            EditarClienteHandler editarClienteHandler, 
            ExcluirClienteHandler excluirClienteHandler, 
            ListarClientesHandler listarClientesHandler,
            ListarClientesPaginadoHandler listarClientesPaginadoHandler)
        {
            _cadastrarClienteHandler = cadastrarClienteHandler;
            _editarClienteHandler = editarClienteHandler;
            _excluirClienteHandler = excluirClienteHandler;
            _listarClientesHandler = listarClientesHandler;
            _listarClientesPaginadoHandler = listarClientesPaginadoHandler;
        }

        /// <summary>
        /// Cadastra um novo cliente.
        /// </summary>
        /// <remarks>
        /// Cria um cliente com nome e telefone obrigatórios.
        /// CPF e endereço são opcionais.
        /// </remarks>
        [HttpPost]
        [Route("cadastrar")]
        [ProducesResponseType(typeof(ClienteResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CadastrarCliente([FromBody] CriarClienteRequest request)
        {
            var command = new CadastrarClienteCommand(
                Nome: request.Nome,
                Cpf: request.Cpf,
                Telefone: request.Telefone,
                Email: request.Email,
                Endereco: request.Endereco,
                Bairro: request.Bairro,
                NumeroCasa: request.NumeroCasa,
                Cidade: request.Cidade,
                Estado: request.Estado
            );

            var clienteResponse = await _cadastrarClienteHandler.CadastrarAsync(command);

            var response = new ClienteResponse(
                Id: clienteResponse.Id,
                Nome: clienteResponse.Nome,
                Cpf: clienteResponse.Cpf,
                Email: clienteResponse.Email,
                Telefone: clienteResponse.Telefone,
                Endereco: clienteResponse.Endereco,
                Bairro: clienteResponse.Bairro,
                NumeroCasa: clienteResponse.NumeroCasa,
                Cidade: clienteResponse.Cidade,
                Estado: clienteResponse.Estado,
                DataCadastro: clienteResponse.DataCriacao,
                DataAtualizacao: clienteResponse.DataAtualizacao
            );

            return StatusCode(StatusCodes.Status201Created, response);
        }

        /// <summary>
        /// Lista os clientes cadastrados.
        /// </summary>
        /// <remarks>
        /// Retorna uma coleção vazia quando ainda não há clientes.
        /// </remarks>
        [HttpGet("listar")]
        [ProducesResponseType(typeof(IReadOnlyList<ClienteResponse>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IReadOnlyList<ClienteResponse>>> ListarClientes()
        {
            var query = new ListarClientesQuery();
            var clientes = await _listarClientesHandler.ListarAsync(query);

            var response = clientes
                .Select(cliente => new ClienteResponse(
                    Id: cliente.Id,
                    Nome: cliente.Nome,
                    Cpf: cliente.Cpf,
                    Email: cliente.Email,
                    Telefone: cliente.Telefone,
                    Endereco: cliente.Endereco,
                    Bairro: cliente.Bairro,
                    NumeroCasa: cliente.NumeroCasa,
                    Cidade: cliente.Cidade,
                    Estado: cliente.Estado,
                    DataCadastro: cliente.DataCriacao,
                    DataAtualizacao: cliente.DataAtualizacao))
                .ToList();

            return Ok(response);
        }

        /// <summary>
        /// Lista os clientes de forma paginada, com busca e ordenação.
        /// </summary>
        /// <remarks>
        /// A busca é aplicada ao nome e ao e-mail; os dígitos do termo também são
        /// pesquisados no CPF e no telefone. Busca, ordenação e paginação são
        /// executadas no banco de dados.
        ///
        /// Exemplo: <c>GET /api/clientes?page=1&amp;pageSize=50&amp;search=marco</c>
        /// </remarks>
        /// <param name="page">Página desejada, iniciando em 1. Padrão: 1.</param>
        /// <param name="pageSize">Registros por página, entre 1 e 100. Padrão: 50.</param>
        /// <param name="search">Termo de busca opcional, com até 100 caracteres.</param>
        /// <param name="sortBy">Campo de ordenação: <c>nome</c> (padrão), <c>cidade</c> ou <c>dataCadastro</c>.</param>
        /// <param name="sortDirection">Direção: <c>asc</c> (padrão) ou <c>desc</c>.</param>
        /// <param name="cancellationToken">Cancelado quando o cliente HTTP abandona a requisição.</param>
        /// <response code="200">Página de clientes.</response>
        /// <response code="400">Parâmetros de paginação, busca ou ordenação inválidos.</response>
        [HttpGet]
        [ProducesResponseType(typeof(ResultadoPaginadoResponse<ClienteResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResultadoPaginadoResponse<ClienteResponse>>> ListarClientesPaginado(
            [FromQuery] int page = ParametrosPaginacao.PaginaPadrao,
            [FromQuery] int pageSize = ParametrosPaginacao.TamanhoPaginaPadrao,
            [FromQuery] string? search = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortDirection = null,
            CancellationToken cancellationToken = default)
        {
            if (!ConversorParametrosConsulta.TentarConverterOpcao(
                    sortBy, OrdenacoesPermitidas, OrdenacaoCliente.Nome, out var ordenarPor))
            {
                ModelState.AddModelError(
                    nameof(sortBy),
                    "Ordenação inválida. Use nome, cidade ou dataCadastro.");
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
                var query = new ListarClientesPaginadoQuery(
                    Page: page,
                    PageSize: pageSize,
                    Busca: search,
                    OrdenarPor: ordenarPor,
                    Direcao: direcao);

                var resultado = await _listarClientesPaginadoHandler.ListarAsync(query, cancellationToken);

                var response = new ResultadoPaginadoResponse<ClienteResponse>(
                    Items: resultado.Items
                        .Select(cliente => new ClienteResponse(
                            Id: cliente.Id,
                            Nome: cliente.Nome,
                            Cpf: cliente.Cpf,
                            Email: cliente.Email,
                            Telefone: cliente.Telefone,
                            Endereco: cliente.Endereco,
                            Bairro: cliente.Bairro,
                            NumeroCasa: cliente.NumeroCasa,
                            Cidade: cliente.Cidade,
                            Estado: cliente.Estado,
                            DataCadastro: cliente.DataCriacao,
                            DataAtualizacao: cliente.DataAtualizacao))
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
        /// Edita o cadastro de um cliente existente.
        /// </summary>
        /// <remarks>
        /// Atualiza os dados do cliente identificado pelo ID da rota.
        /// Nome e telefone são obrigatórios; dados opcionais enviados como null serão removidos.
        /// </remarks>
        /// <param name="id">Identificador do cliente a editar.</param>
        /// <param name="request">Novos dados do cliente.</param>
        /// <response code="200">Cadastro atualizado.</response>
        /// <response code="400">Dados inválidos.</response>
        /// <response code="404">Cliente não encontrado.</response>
        [HttpPut("{id:guid}/editar")]
        [ProducesResponseType(typeof(ClienteResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ClienteResponse>> EditarCliente([FromRoute] Guid id, [FromBody] EditarClienteRequest request)
        {
            var command = new EditarClienteCommand(
                Id: id,
                Nome: request.Nome,
                Cpf: request.Cpf,
                Telefone: request.Telefone,
                Email: request.Email,
                Endereco: request.Endereco,
                Bairro: request.Bairro,
                NumeroCasa: request.NumeroCasa,
                Cidade: request.Cidade,
                Estado: request.Estado
            );

            var clienteResponse = await _editarClienteHandler.EditarAsync(command);

            if (clienteResponse is null)
                return NotFound();


            var response = new ClienteResponse(
                Id: clienteResponse.Id,
                Nome: clienteResponse.Nome,
                Cpf: clienteResponse.Cpf,
                Email: clienteResponse.Email,
                Telefone: clienteResponse.Telefone,
                Endereco: clienteResponse.Endereco,
                Bairro: clienteResponse.Bairro,
                NumeroCasa: clienteResponse.NumeroCasa,
                Cidade: clienteResponse.Cidade,
                Estado: clienteResponse.Estado,
                DataCadastro: clienteResponse.DataCriacao,
                DataAtualizacao: clienteResponse.DataAtualizacao
            );

            return Ok(response);
        }

        /// <summary>
        /// Exclui definitivamente um cliente.
        /// </summary>
        /// <remarks>
        /// Remove do banco o cliente identificado pelo ID da rota.
        /// </remarks>
        /// <param name="id">Identificador do cliente a excluir.</param>
        /// <response code="204">Cliente excluído.</response>
        /// <response code="404">Cliente não encontrado.</response>
        [HttpDelete("{id:guid}/excluir")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ExcluirCliente([FromRoute] Guid id)
        {
            var command = new ExcluirClienteCommand(id);

            var excluido = await _excluirClienteHandler.ExcluirAsync(command);

            if (!excluido)
                return NotFound();

            return NoContent();
        }
    }
}
