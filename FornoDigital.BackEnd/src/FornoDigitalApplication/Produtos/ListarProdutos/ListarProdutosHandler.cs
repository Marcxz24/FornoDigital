using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalDomain.Repositories.Produtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Produtos.ListarProdutos
{
    /// <summary>
    /// Executa a consulta de listagem de produtos.
    /// </summary>
    public sealed class ListarProdutosHandler
    {
        private readonly IProdutoRepository _produtoRepository;

        public ListarProdutosHandler(IProdutoRepository produtoRepository)
        {
            _produtoRepository = produtoRepository;
        }

        /// <summary>
        /// Retorna os produtos cadastrados.
        /// </summary>
        public Task<IReadOnlyList<Produto>> ListarAsync(ListarProdutosQuery query)
        {
            ArgumentNullException.ThrowIfNull(query);

            return _produtoRepository.ObterTodosAsync();
        }
    }
}
