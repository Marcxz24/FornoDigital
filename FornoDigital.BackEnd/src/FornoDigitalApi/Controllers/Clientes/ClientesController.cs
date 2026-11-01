using FornoDigitalApi.Contracts.Clientes;
using FornoDigitalApplication.Clientes.CadastrarCliente;
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
        private readonly CadastrarClienteHandler _handler;


        /// <summary>
        /// Inicializa o controller de clientes.
        /// </summary>
        /// <param name="handler">
        /// Caso de uso responsável por cadastrar um cliente.
        /// </param>
        public ClientesController(CadastrarClienteHandler handler)
        {
            _handler = handler;
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

            var clienteResponse = await _handler.CadastrarAsync(command);

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
    }
}
