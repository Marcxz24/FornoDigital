using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Entities.Produtos
{
    public sealed class CodigoBarrasProduto
    {
        /// <summary>
        /// Código de barras normalizado, sem espaços nas extremidades.
        /// </summary>
        public string CodigoBarras { get; private set; } = string.Empty;

        /// <summary>
        /// Construtor sem parâmetros utilizado pelo Entity Framework Core.
        /// </summary>
        private CodigoBarrasProduto()
        {
        }

        /// <summary>
        /// Cria um código de barras após remover espaços das extremidades.
        /// </summary>
        /// <param name="codigoBarras">Código recebido como texto.</param>
        /// <exception cref="ArgumentException">
        /// Lançada quando o código é nulo, vazio ou composto somente por espaços.
        /// </exception>
        public CodigoBarrasProduto(string codigoBarras)
        {
            if (string.IsNullOrWhiteSpace(codigoBarras))
            {
                throw new ArgumentException(
                    "O código de barras é obrigatório.",
                    nameof(codigoBarras));
            }

            CodigoBarras = codigoBarras.Trim();
        }
    }
}
