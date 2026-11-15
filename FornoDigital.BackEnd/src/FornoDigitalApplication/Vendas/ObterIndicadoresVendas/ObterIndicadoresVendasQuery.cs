using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Vendas.ObterIndicadoresVendas
{
    /// <summary>
    /// Solicita os indicadores de vendas de um período.
    /// As datas são locais e o dia final é incluído.
    /// </summary>
    /// <param name="DataInicial">Primeiro dia do período.</param>
    /// <param name="DataFinal">Último dia do período.</param>
    /// <param name="LimiteProdutos">Quantidade de produtos no ranking e no gráfico diário.</param>
    public sealed record ObterIndicadoresVendasQuery(
        DateOnly DataInicial,
        DateOnly DataFinal,
        int LimiteProdutos = 5);
}
