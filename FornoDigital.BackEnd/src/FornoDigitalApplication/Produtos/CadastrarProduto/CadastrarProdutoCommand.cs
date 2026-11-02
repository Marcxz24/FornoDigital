using FornoDigitalDomain.Enums.Produtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Produtos.CadastrarProduto
{
    /// <summary>
    /// Representa o comando (Command) utilizado na camada de aplicação para encapsular 
    /// os dados necessários para o cadastro e persistência de um novo produto no sistema.
    /// </summary>
    /// <param name="Nome">O nome obrigatório do produto a ser cadastrado.</param>
    /// <param name="Preco">O preço unitário de venda do produto (deve ser maior que zero).</param>
    /// <param name="Disponivel">Indica se o produto estará inicialmente disponível para comercialização no PDV.</param>
    /// <param name="UnidadeMedida">A unidade de medida comercial associada ao produto (Ex: Quilograma, Unidade, etc.).</param>
    /// <param name="ControlaEstoque">Indica se o produto terá controle quantitativo de estoque monitorado.</param>
    /// <param name="Descricao">A descrição detalhada opcional do produto (opcional, padrão é <c>null</c>).</param>
    /// <param name="QuantidadeEstoque">
    /// Quantidade inicial opcional. Se o controle de estoque estiver ativo e o valor for nulo,
    /// a entidade inicia a quantidade em zero. Se o controle estiver desativado, o valor deve ser nulo.
    /// </param>
    public sealed record CadastrarProdutoCommand(
        string Nome,
        decimal Preco,
        bool Disponivel,
        UnidadeMedidaProduto UnidadeMedida,
        bool ControlaEstoque,
        string? Descricao = null,
        decimal? QuantidadeEstoque = null
    );
}
