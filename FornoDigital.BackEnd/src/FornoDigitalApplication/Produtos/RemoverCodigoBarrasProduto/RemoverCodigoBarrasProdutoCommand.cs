using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Produtos.RemoverCodigoBarrasProduto
{
    /// <summary>
    /// Dados necessários para remover um código de barras de um produto.
    /// </summary>
    /// <param name="ProdutoId">Identificador do produto.</param>
    /// <param name="CodigoBarras">Código de barras que será removido.</param>
    public sealed record RemoverCodigoBarrasProdutoCommand(
        Guid ProdutoId,
        string CodigoBarras
    );
}
