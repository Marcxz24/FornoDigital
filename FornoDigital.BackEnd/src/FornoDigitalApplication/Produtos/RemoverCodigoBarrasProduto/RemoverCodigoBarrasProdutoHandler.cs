using FornoDigitalDomain.Repositories.Produtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Produtos.RemoverCodigoBarrasProduto
{
    /// <summary>
    /// Executa a remoção de um código de barras associado a um produto.
    /// </summary>
    public sealed class RemoverCodigoBarrasProdutoHandler(
        IProdutoRepository produtoRepository
        )
    {
        /// <summary>
        /// Remove o código do produto e persiste a alteração.
        /// </summary>
        /// <param name="command">Identificador do produto e código a remover.</param>
        /// <returns>
        /// <c>true</c> se o código foi removido; <c>false</c> se o produto ou o código não foi encontrado.
        /// </returns>
        public async Task<bool> RemoverAsync(RemoverCodigoBarrasProdutoCommand command)
        {
            ArgumentNullException.ThrowIfNull(command);

            if (command.ProdutoId == Guid.Empty)
            {
                throw new ArgumentException(
                    "O identificador do produto não pode ser vazio.",
                    nameof(command));
            }

            var produto = await produtoRepository.ObterPorIdAsync(command.ProdutoId);

            if (produto is null)
            {
                return false;
            }

            var removido = produto.RemoverCodigoBarras(command.CodigoBarras);

            if (!removido)
            {
                return false;
            }

            await produtoRepository.AtualizarAsync(produto);

            return true;
        }
    }
}
