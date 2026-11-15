using FornoDigitalDomain.Entities.Vendas;
using FornoDigitalDomain.Repositories.Produtos;
using FornoDigitalDomain.Repositories.Vendas;

namespace FornoDigitalApplication.Vendas.ObterIndicadoresVendas
{
    /// <summary>
    /// Calcula os indicadores de vendas de um período: resumo, produtos mais vendidos
    /// por faturamento, vendas por forma de pagamento e faturamento diário por produto.
    /// </summary>
    public sealed class ObterIndicadoresVendasHandler
    {
        /// <summary>Maior período aceito, em dias (incluindo o inicial e o final).</summary>
        public const int MaximoDiasPeriodo = 366;

        /// <summary>Maior quantidade de produtos aceita no ranking.</summary>
        public const int LimiteProdutosMaximo = 10;

        private readonly IVendaRepository _vendaRepository;
        private readonly IProdutoRepository _produtoRepository;

        /// <summary>
        /// Inicializa o handler com os repositórios de vendas e de produtos.
        /// </summary>
        public ObterIndicadoresVendasHandler(
            IVendaRepository vendaRepository,
            IProdutoRepository produtoRepository)
        {
            _vendaRepository = vendaRepository;
            _produtoRepository = produtoRepository;
        }

        /// <summary>
        /// Valida o período, busca as vendas e calcula os indicadores.
        /// </summary>
        /// <exception cref="ArgumentException">Lançada quando o período ou o limite são inválidos.</exception>
        public async Task<IndicadoresVendasResultado> ObterAsync(
            ObterIndicadoresVendasQuery query,
            CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(query);
            ValidarConsulta(query);

            // As datas do filtro são locais; no banco, as vendas estão em UTC.
            var fusoHorario = TimeZoneInfo.Local;
            var inicioUtc = ConverterInicioDoDiaParaUtc(query.DataInicial, fusoHorario);
            var fimUtc = ConverterInicioDoDiaParaUtc(query.DataFinal.AddDays(1), fusoHorario);

            var vendas = await _vendaRepository.ObterPorPeriodoAsync(
                inicioUtc,
                fimUtc,
                cancellationToken);

            // Cada item recebe o dia local da venda, usado no gráfico diário.
            var itens = vendas
                .SelectMany(venda => venda.Itens.Select(item => new ItemDoPeriodo(
                    venda.Id,
                    DateOnly.FromDateTime(
                        TimeZoneInfo.ConvertTimeFromUtc(venda.DataCriacao, fusoHorario)),
                    item)))
                .ToList();

            var produtosMaisVendidos = await CalcularProdutosMaisVendidosAsync(
                itens,
                query.LimiteProdutos);

            return new IndicadoresVendasResultado(
                query.DataInicial,
                query.DataFinal,
                CalcularResumo(vendas),
                produtosMaisVendidos,
                CalcularVendasPorFormaPagamento(vendas),
                CalcularSeriesDiarias(itens, produtosMaisVendidos, query.DataInicial, query.DataFinal));
        }

        /// <summary>
        /// Item de venda acompanhado do identificador e do dia local da venda.
        /// </summary>
        private sealed record ItemDoPeriodo(Guid VendaId, DateOnly Data, ItemVenda Item);

        /// <summary>
        /// Valida o período (data inicial menor ou igual à final, no máximo
        /// MaximoDiasPeriodo dias) e o limite de produtos do ranking.
        /// </summary>
        private static void ValidarConsulta(ObterIndicadoresVendasQuery query)
        {
            if (query.DataInicial > query.DataFinal)
            {
                throw new ArgumentException("A data inicial não pode ser maior que a data final.");
            }

            var dias = query.DataFinal.DayNumber - query.DataInicial.DayNumber + 1;

            if (dias > MaximoDiasPeriodo)
            {
                throw new ArgumentException(
                    $"O período pode ter no máximo {MaximoDiasPeriodo} dias.");
            }

            if (query.LimiteProdutos < 1 || query.LimiteProdutos > LimiteProdutosMaximo)
            {
                throw new ArgumentException(
                    $"O limite de produtos deve estar entre 1 e {LimiteProdutosMaximo}.");
            }
        }

        /// <summary>
        /// Converte a meia-noite de uma data local para UTC, formato em que as vendas são gravadas.
        /// </summary>
        private static DateTime ConverterInicioDoDiaParaUtc(DateOnly data, TimeZoneInfo fusoHorario) =>
            TimeZoneInfo.ConvertTimeToUtc(
                data.ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified),
                fusoHorario);

        /// <summary>
        /// Calcula a quantidade de vendas, o faturamento (total já com desconto) e o ticket médio.
        /// </summary>
        private static ResumoVendasResultado CalcularResumo(IReadOnlyList<Venda> vendas)
        {
            var quantidade = vendas.Count;
            var faturamento = vendas.Sum(venda => venda.Total);
            var ticketMedio = quantidade == 0
                ? 0m
                : decimal.Round(faturamento / quantidade, 2, MidpointRounding.AwayFromZero);

            return new ResumoVendasResultado(quantidade, faturamento, ticketMedio);
        }

        /// <summary>
        /// Agrupa os itens por produto, ordena pelo faturamento e completa os primeiros
        /// colocados com a unidade de medida atual do cadastro.
        /// </summary>
        private async Task<IReadOnlyList<ProdutoMaisVendidoResultado>> CalcularProdutosMaisVendidosAsync(
            IReadOnlyList<ItemDoPeriodo> itens,
            int limite)
        {
            var ranking = itens
                .GroupBy(registro => registro.Item.ProdutoId)
                .Select(grupo => new
                {
                    ProdutoId = grupo.Key,
                    // Usa o nome gravado na venda mais recente, caso o produto tenha sido renomeado.
                    NomeProduto = grupo.MaxBy(registro => registro.Data)!.Item.NomeProduto,
                    Faturamento = grupo.Sum(registro => registro.Item.Subtotal),
                    Quantidade = grupo.Sum(registro => registro.Item.Quantidade),
                    QuantidadeVendas = grupo.Select(registro => registro.VendaId).Distinct().Count()
                })
                .OrderByDescending(produto => produto.Faturamento)
                .ThenBy(produto => produto.NomeProduto)
                .ThenBy(produto => produto.ProdutoId)
                .Take(limite)
                .ToList();

            var resultado = new List<ProdutoMaisVendidoResultado>(ranking.Count);

            // No máximo LimiteProdutosMaximo consultas, só para obter a unidade atual.
            foreach (var produto in ranking)
            {
                var cadastro = await _produtoRepository.ObterPorIdAsync(produto.ProdutoId);

                resultado.Add(new ProdutoMaisVendidoResultado(
                    produto.ProdutoId,
                    produto.NomeProduto,
                    cadastro?.UnidadeMedida,
                    produto.Faturamento,
                    produto.Quantidade,
                    produto.QuantidadeVendas));
            }

            return resultado;
        }

        /// <summary>
        /// Soma o total e conta as vendas de cada forma de pagamento.
        /// </summary>
        private static IReadOnlyList<VendasPorFormaPagamentoResultado> CalcularVendasPorFormaPagamento(
            IReadOnlyList<Venda> vendas) =>
            vendas
                .GroupBy(venda => venda.FormaPagamento)
                .Select(grupo => new VendasPorFormaPagamentoResultado(
                    grupo.Key,
                    grupo.Count(),
                    grupo.Sum(venda => venda.Total)))
                // Formas conhecidas na ordem do enum; vendas sem forma (valor 0) por último.
                .OrderBy(forma => Enum.IsDefined(forma.FormaPagamento)
                    ? (int)forma.FormaPagamento
                    : int.MaxValue)
                .ToList();

        /// <summary>
        /// Monta, para cada produto do ranking, o faturamento e a quantidade de todos os
        /// dias do período, preenchendo com zero os dias sem venda.
        /// </summary>
        private static IReadOnlyList<SerieDiariaProdutoResultado> CalcularSeriesDiarias(
            IReadOnlyList<ItemDoPeriodo> itens,
            IReadOnlyList<ProdutoMaisVendidoResultado> produtos,
            DateOnly dataInicial,
            DateOnly dataFinal)
        {
            var produtosDoGrafico = produtos.Select(produto => produto.ProdutoId).ToHashSet();

            var totaisPorDia = itens
                .Where(registro => produtosDoGrafico.Contains(registro.Item.ProdutoId))
                .GroupBy(registro => (registro.Item.ProdutoId, registro.Data))
                .ToDictionary(
                    grupo => grupo.Key,
                    grupo => (
                        Faturamento: grupo.Sum(registro => registro.Item.Subtotal),
                        Quantidade: grupo.Sum(registro => registro.Item.Quantidade)));

            var dias = Enumerable
                .Range(0, dataFinal.DayNumber - dataInicial.DayNumber + 1)
                .Select(dataInicial.AddDays)
                .ToList();

            return produtos
                .Select(produto => new SerieDiariaProdutoResultado(
                    produto.ProdutoId,
                    produto.NomeProduto,
                    dias
                        .Select(dia => totaisPorDia.TryGetValue((produto.ProdutoId, dia), out var total)
                            ? new PontoDiarioResultado(dia, total.Faturamento, total.Quantidade)
                            : new PontoDiarioResultado(dia, 0m, 0m))
                        .ToList()))
                .ToList();
        }
    }
}