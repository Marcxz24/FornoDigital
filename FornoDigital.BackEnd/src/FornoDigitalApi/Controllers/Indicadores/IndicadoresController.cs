using FornoDigitalApi.Contracts.Indicadores;
using FornoDigitalApplication.Vendas.ObterIndicadoresVendas;
using Microsoft.AspNetCore.Mvc;

namespace FornoDigitalApi.Controllers.Indicadores
{
    /// <summary>
    /// Disponibiliza os indicadores usados na tela de análise.
    /// </summary>
    [ApiController]
    [Route("api/indicadores")]
    public sealed class IndicadoresController : ControllerBase
    {
        private readonly ObterIndicadoresVendasHandler _obterIndicadoresVendasHandler;

        /// <summary>
        /// Inicializa o controller com o caso de uso de indicadores de vendas.
        /// </summary>
        public IndicadoresController(ObterIndicadoresVendasHandler obterIndicadoresVendasHandler)
        {
            _obterIndicadoresVendasHandler = obterIndicadoresVendasHandler;
        }

        /// <summary>
        /// Retorna os indicadores de vendas do período.
        /// </summary>
        /// <remarks>
        /// Exemplo: <c>GET /api/indicadores/vendas?dataInicial=2026-11-01&amp;dataFinal=2026-11-15&amp;limiteProdutos=5</c>
        /// </remarks>
        /// <param name="dataInicial">Primeiro dia do período (yyyy-MM-dd).</param>
        /// <param name="dataFinal">Último dia do período (yyyy-MM-dd), incluído.</param>
        /// <param name="limiteProdutos">Produtos no ranking e no gráfico diário (1 a 10). Padrão: 5.</param>
        /// <param name="cancellationToken">Cancelado quando o cliente abandona a requisição.</param>
        /// <response code="200">Indicadores do período.</response>
        /// <response code="400">Período ou limite inválidos.</response>
        [HttpGet("vendas")]
        [ProducesResponseType(typeof(IndicadoresVendasResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IndicadoresVendasResponse>> ObterIndicadoresVendas(
            [FromQuery] DateOnly? dataInicial,
            [FromQuery] DateOnly? dataFinal,
            [FromQuery] int limiteProdutos = 5,
            CancellationToken cancellationToken = default)
        {
            if (dataInicial is null || dataFinal is null)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Período inválido.",
                    Detail = "Informe a data inicial e a data final.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            try
            {
                var query = new ObterIndicadoresVendasQuery(
                    dataInicial.Value,
                    dataFinal.Value,
                    limiteProdutos);

                var resultado = await _obterIndicadoresVendasHandler.ObterAsync(
                    query,
                    cancellationToken);

                return Ok(ParaResponse(resultado));
            }
            catch (ArgumentException exception)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Parâmetros inválidos para os indicadores.",
                    Detail = exception.Message,
                    Status = StatusCodes.Status400BadRequest
                });
            }
        }

        /// <summary>
        /// Converte o resultado do caso de uso no contrato de resposta da API.
        /// </summary>
        private static IndicadoresVendasResponse ParaResponse(IndicadoresVendasResultado resultado) => new(
            DataInicial: resultado.DataInicial,
            DataFinal: resultado.DataFinal,
            Resumo: new ResumoVendasResponse(
                resultado.Resumo.QuantidadeVendas,
                resultado.Resumo.Faturamento,
                resultado.Resumo.TicketMedio),
            ProdutosMaisVendidos: resultado.ProdutosMaisVendidos
                .Select(produto => new ProdutoMaisVendidoResponse(
                    produto.ProdutoId,
                    produto.NomeProduto,
                    produto.UnidadeMedida,
                    produto.Faturamento,
                    produto.Quantidade,
                    produto.QuantidadeVendas))
                .ToList(),
            VendasPorFormaPagamento: resultado.VendasPorFormaPagamento
                .Select(forma => new VendasPorFormaPagamentoResponse(
                    forma.FormaPagamento,
                    forma.QuantidadeVendas,
                    forma.Total))
                .ToList(),
            VendasDiariasPorProduto: resultado.VendasDiariasPorProduto
                .Select(serie => new SerieDiariaProdutoResponse(
                    serie.ProdutoId,
                    serie.NomeProduto,
                    serie.Pontos
                        .Select(ponto => new PontoDiarioResponse(
                            ponto.Data,
                            ponto.Faturamento,
                            ponto.Quantidade))
                        .ToList()))
                .ToList());
    }
}