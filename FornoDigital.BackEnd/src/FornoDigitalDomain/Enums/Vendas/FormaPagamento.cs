using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Enums.Vendas
{
    /// <summary>
    /// Formas de pagamento aceitas no registro de uma venda.
    /// Os valores são gravados como inteiros no banco: nunca renumere os itens existentes.
    /// </summary>
    public enum FormaPagamento
    {
        /// <summary>Pagamento em espécie.</summary>
        Dinheiro = 1,

        /// <summary>Pagamento com cartão (crédito ou débito).</summary>
        Cartao = 2,

        /// <summary>Pagamento instantâneo via PIX.</summary>
        Pix = 3
    }
}
