using FornoDigitalDomain.Enums.Produtos;
using System;
using System.Collections.Generic;

namespace FornoDigitalApi.Contracts.Produtos
{
    /// <summary>
    /// Dados do produto devolvidos pela API.
    /// </summary>
    /// <param name="Id">Identificador do produto.</param>
    /// <param name="Nome">Nome do produto.</param>
    /// <param name="Descricao">Descrição opcional.</param>
    /// <param name="Preco">Preço de venda em reais.</param>
    /// <param name="Disponivel">Indica se está disponível para venda.</param>
    /// <param name="UnidadeMedida">Unidade de medida comercial.</param>
    /// <param name="ControlaEstoque">Indica se o estoque é controlado.</param>
    /// <param name="QuantidadeEstoque">Quantidade atual ou nula se o estoque não for controlado.</param>
    /// <param name="TemEstoque">Indica se há saldo positivo em estoque controlado.</param>
    /// <param name="CodigosBarras">Códigos de barras associados ao produto.</param>
    /// <param name="DataCriacao">Data e hora UTC do cadastro.</param>
    /// <param name="DataAtualizacao">Data e hora UTC da última atualização, se houver.</param>
    public sealed record ProdutoResponse(
        Guid Id,
        string Nome,
        string? Descricao,
        decimal Preco,
        bool Disponivel,
        UnidadeMedidaProduto UnidadeMedida,
        bool ControlaEstoque,
        decimal? QuantidadeEstoque,
        bool TemEstoque,
        IReadOnlyList<string> CodigosBarras,
        DateTime DataCriacao,
        DateTime? DataAtualizacao
    );
}