using FornoDigitalApi.Contracts.Clientes;
using FornoDigitalApplication.Clientes.CadastrarCliente;
using FornoDigitalApplication.Clientes.EditarCliente;
using FornoDigitalApplication.Clientes.ExcluirCliente;
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
        public ClientesController(CadastrarClienteHandler cadastrarClienteHandler, EditarClienteHandler editarClienteHandler, ExcluirClienteHandler excluirClienteHandler)
        {
            _cadastrarClienteHandler = cadastrarClienteHandler;
            _editarClienteHandler = editarClienteHandler;
            _excluirClienteHandler = excluirClienteHandler;
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
