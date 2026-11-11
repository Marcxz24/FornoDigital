using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Vendas.ObterVenda
{
    /// <summary>
    /// Representa a consulta (<see cref="ObterVendaQuery"/>) utilizada para solicitar os dados 
    /// detalhados de uma venda específica com base em seu identificador único.
    /// </summary>
    /// <param name="Id">O identificador único universal (UUID) da venda que se deseja consultar.</param>
    public sealed record ObterVendaQuery(Guid Id);
}
