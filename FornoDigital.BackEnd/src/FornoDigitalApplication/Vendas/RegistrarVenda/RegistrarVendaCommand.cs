using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Vendas.RegistrarVenda
{
    /// <summary>
    /// Dados necessários para registrar uma venda.
    /// </summary>
    /// <param name="ClienteId">Identificador opcional do cliente.</param>
    /// <param name="Itens">Produtos e quantidades incluídos na venda.</param>
    /// <param name="Desconto">Desconto total em moeda, com padrão zero.</param>
    public sealed record RegistrarVendaCommand(
        Guid? ClienteId,
        IReadOnlyCollection<RegistrarVendaItemCommand> Itens,
        decimal Desconto = 0m);

    /// <summary>
    /// Identifica um produto e a quantidade vendida.
    /// O preço será obtido do cadastro do produto pelo Handler.
    /// </summary>
    public sealed record RegistrarVendaItemCommand(
        Guid ProdutoId,
        decimal Quantidade);

}
