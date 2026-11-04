using FornoDigitalDomain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Entities.Vendas
{
    /// <summary>
    /// Representa a entidade de domínio selada <see cref="ItemVenda"/>, que especifica 
    /// um produto comercializado dentro de uma venda, incluindo quantidades, preços unitários 
    /// e validações de integridade das regras de negócio.
    /// </summary>
    public sealed class ItemVenda : EntityBase
    {
        /// <summary>
        /// Obtém o identificador único universal (UUID) da venda à qual este item pertence.
        /// </summary>
        public Guid VendaId { get; private set; }

        /// <summary>
        /// Obtém o identificador único universal (UUID) do produto comercializado.
        /// </summary>
        public Guid ProdutoId { get; private set; }

        /// <summary>
        /// Obtém o nome descritivo do produto no momento da transação.
        /// </summary>
        public string NomeProduto { get; private set; } = string.Empty;

        /// <summary>
        /// Obtém a quantidade comercializada do produto.
        /// </summary>
        public decimal Quantidade { get; private set; }

        /// <summary>
        /// Obtém o preço unitário de venda do produto.
        /// </summary>
        public decimal PrecoUnitario { get; private set; }

        /// <summary>
        /// Obtém o valor subtotal calculado do item (<see cref="Quantidade"/> multiplicada por <see cref="PrecoUnitario"/>), 
        /// arredondado para duas casas decimais utilizando o arredondamento matemático padrão.
        /// </summary>
        public decimal Subtotal => decimal.Round(Quantidade * PrecoUnitario, 2, MidpointRounding.AwayFromZero);

        /// <summary>
        /// Construtor privado sem parâmetros utilizado pelo Entity Framework Core
        /// para materializar a entidade a partir dos dados persistidos.
        /// </summary>
        private ItemVenda()
        {
        }

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="ItemVenda"/> validando os parâmetros obrigatórios 
        /// de produto, quantidade e preço unitário.
        /// </summary>
        /// <param name="produtoId">O identificador único do produto (<see cref="Guid"/>).</param>
        /// <param name="nomeProduto">O nome descritivo do produto.</param>
        /// <param name="quantidade">A quantidade do produto (deve ser maior que zero).</param>
        /// <param name="precoUnitario">O preço unitário do produto (deve ser maior que zero e possuir no máximo duas casas decimais).</param>
        /// <exception cref="ArgumentException">Lançado se o <paramref name="produtoId"/> for vazio ou o <paramref name="nomeProduto"/> for nulo/vazio.</exception>
        /// <exception cref="ArgumentOutOfRangeException">Lançado se a <paramref name="quantidade"/> ou o <paramref name="precoUnitario"/> forem inválidos.</exception>
        public ItemVenda(
        Guid produtoId,
        string nomeProduto,
        decimal quantidade,
        decimal precoUnitario)
        {
            if (produtoId == Guid.Empty)
                throw new ArgumentException("O produto é obrigatório.", nameof(produtoId));

            if (string.IsNullOrWhiteSpace(nomeProduto))
                throw new ArgumentException("O nome do produto é obrigatório.", nameof(nomeProduto));

            if (quantidade <= 0)
                throw new ArgumentOutOfRangeException(
                    nameof(quantidade),
                    "A quantidade deve ser maior que zero.");

            if (precoUnitario <= 0)
                throw new ArgumentOutOfRangeException(
                    nameof(precoUnitario),
                    "O preço unitário deve ser maior que zero.");

            if (precoUnitario != decimal.Round(precoUnitario, 2))
                throw new ArgumentOutOfRangeException(
                    nameof(precoUnitario),
                    "O preço unitário deve ter no máximo duas casas decimais.");

            ProdutoId = produtoId;
            NomeProduto = nomeProduto.Trim();
            Quantidade = quantidade;
            PrecoUnitario = precoUnitario;
        }

        /// <summary>
        /// Associa o item à venda que o contém.
        /// </summary>
        internal void AssociarAVenda(Guid vendaId)
        {
            if (vendaId == Guid.Empty)
                throw new ArgumentException(
                    "O identificador da venda não pode ser vazio.",
                    nameof(vendaId));

            if (VendaId != Guid.Empty && VendaId != vendaId)
                throw new InvalidOperationException(
                    "O item já está associado a outra venda.");

            VendaId = vendaId;
        }
    }
}
