using FornoDigitalDomain.Common;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Entities.Vendas
{
    /// <summary>
    /// Representa a entidade de domínio <see cref="Venda"/> no sistema, responsável por gerenciar 
    /// as informações financeiras (subtotal, descontos e total final), o cliente associado 
    /// e a coleção encapsulada de itens que compõem a transação comercial.
    /// </summary>
    public class Venda : EntityBase
    {
        /// <summary>
        /// Obtém o identificador único universal (UUID) opcional do cliente vinculado a esta venda.
        /// </summary>
        public Guid? ClienteId { get; private set; }

        /// <summary>
        /// Obtém uma visualização somente leitura (<see cref="IReadOnlyCollection{T}"/>) 
        /// dos itens que compõem esta venda, garantindo a proteção e integridade do encapsulamento interno.
        /// </summary>
        public IReadOnlyCollection<ItemVenda> Itens => _itens.AsReadOnly();

        /// <summary>
        /// Coleção interna mutável de itens (<see cref="ItemVenda"/>) associados à venda.
        /// </summary>
        private readonly List<ItemVenda> _itens = new();

        /// <summary>
        /// Obtém o valor subtotal acumulado.
        /// </summary>
        public decimal Subtotal { get; private set; }

        /// <summary>
        /// Obtém o valor monetário total concedido como desconto sobre o subtotal da venda.
        /// </summary>
        public decimal Desconto { get; private set; }

        /// <summary>
        /// Valor final da venda, armazenado e recalculado ao adicionar itens
        /// ou aplicar desconto.
        /// </summary>
        public decimal Total { get; private set; }

        // Construtor usado pelo Entity Framework Core.
        private Venda()
        {
        }

        /// <summary>
        /// Inicia uma venda, opcionalmente associada a um cliente.
        /// </summary>
        public Venda(Guid? clienteId = null)
        {
            if (clienteId == Guid.Empty)
            {
                throw new ArgumentException(
                    "O identificador do cliente não pode ser vazio.",
                    nameof(clienteId));
            }

            ClienteId = clienteId;
        }

        /// <summary>
        /// Adiciona um item à venda.
        /// </summary>
        public void AdicionarItem(ItemVenda item)
        {
            ArgumentNullException.ThrowIfNull(item);

            item.AssociarAVenda(Id);
            _itens.Add(item);

            RecalcularValores();
        }

        /// <summary>
        /// Define o desconto total da venda.
        /// </summary>
        public void AplicarDesconto(decimal desconto)
        {
            if (desconto < 0)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(desconto),
                    "O desconto não pode ser negativo.");
            }

            if (desconto > Subtotal)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(desconto),
                    "O desconto não pode ser maior que o subtotal da venda.");
            }

            if (desconto != decimal.Round(desconto, 2))
            {
                throw new ArgumentOutOfRangeException(
                    nameof(desconto),
                    "O desconto deve ter no máximo duas casas decimais.");
            }

            Desconto = desconto;

            RecalcularValores();
        }

        /// <summary>
        /// Recalcula de forma centralizada os valores financeiros da transação, 
        /// atualizando o <see cref="Subtotal"/> com base na soma dos itens e o <see cref="Total"/> 
        /// deduzindo os descontos aplicados.
        /// </summary>
        private void RecalcularValores()
        {
            Subtotal = _itens.Sum(item => item.Subtotal);
            Total = Subtotal - Desconto;
        }
    }
}
