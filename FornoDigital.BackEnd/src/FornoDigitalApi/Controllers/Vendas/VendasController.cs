using FornoDigitalApi.Contracts.Vendas;
using FornoDigitalApplication.Vendas.RegistrarVenda;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;

namespace FornoDigitalApi.Controllers.Vendas
{
    /// <summary>
    /// Gerencia as rotas relacionadas às vendas.
    /// </summary>
    [ApiController]
    [Route("api/vendas")]
    public sealed class VendasController : ControllerBase
    {
        private readonly RegistrarVendaHandler _registrarVendaHandler;

        /// <summary>
        /// Inicializa o controller com o caso de uso de registro de venda.
        /// </summary>
        public VendasController(RegistrarVendaHandler registrarVendaHandler)
        {
            _registrarVendaHandler = registrarVendaHandler;
        }

        /// <summary>
        /// Registra uma venda com seus itens e valores calculados.
        /// </summary>
        /// <remarks>
        /// O cliente é opcional. Os preços são obtidos do cadastro dos produtos,
        /// e o estoque é atualizado para produtos que controlam estoque.
        /// </remarks>
        /// <param name="request">Cliente opcional, itens e desconto da venda.</param>
        /// <response code="201">Venda registrada.</response>
        /// <response code="400">Dados inválidos ou desconto fora das regras.</response>
        /// <response code="404">Cliente ou produto não encontrado.</response>
        /// <response code="409">Produto indisponível ou estoque insuficiente.</response>
        [HttpPost("registrar")]
        [ProducesResponseType(typeof(VendaResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
        public async Task<ActionResult<VendaResponse>> Registrar(
            [FromBody] RegistrarVendaRequest request)
        {
            var command = new RegistrarVendaCommand(
                ClienteId: request.ClienteId,
                Itens: request.Itens
                    .Select(item => new RegistrarVendaItemCommand(
                        item.ProdutoId,
                        item.Quantidade))
                    .ToList(),
                Desconto: request.Desconto);

            try
            {
                var venda = await _registrarVendaHandler.RegistrarAsync(command);

                var response = new VendaResponse(
                    Id: venda.Id,
                    ClienteId: venda.ClienteId,
                    Itens: venda.Itens
                        .Select(item => new ItemVendaResponse(
                            item.Id,
                            item.ProdutoId,
                            item.NomeProduto,
                            item.Quantidade,
                            item.PrecoUnitario,
                            item.Subtotal))
                        .ToList(),
                    Subtotal: venda.Subtotal,
                    Desconto: venda.Desconto,
                    Total: venda.Total,
                    DataCriacao: venda.DataCriacao);

                return StatusCode(StatusCodes.Status201Created, response);
            }
            catch (KeyNotFoundException exception)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Cliente ou produto não encontrado.",
                    Detail = exception.Message,
                    Status = StatusCodes.Status404NotFound
                });
            }
            catch (ArgumentException exception)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Dados inválidos para registrar a venda.",
                    Detail = exception.Message,
                    Status = StatusCodes.Status400BadRequest
                });
            }
            catch (InvalidOperationException exception)
            {
                return Conflict(new ProblemDetails
                {
                    Title = "Não foi possível registrar a venda.",
                    Detail = exception.Message,
                    Status = StatusCodes.Status409Conflict
                });
            }
        }
    }
}
