using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalDomain.Repositories.Produtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Produtos.CadastrarProduto
{
    /// <summary>
    /// Processa o cadastro de um produto e solicita sua persistência ao repositório.
    /// </summary>
    public sealed class CadastrarProdutoHandler
    {
        private readonly IProdutoRepository _produtoRepository;

        /// <summary>
        /// Inicializa o handler com o repositório de produtos.
        /// </summary>
        /// <param name="produtoRepository">Repositório usado para consultar e salvar produtos.</param>
        public CadastrarProdutoHandler(IProdutoRepository produtoRepository)
        {
            _produtoRepository = produtoRepository;
        }

        /// <summary>
        /// Cria e persiste um produto com seus códigos de barras iniciais.
        /// </summary>
        /// <param name="command">Dados necessários para o cadastro.</param>
        /// <returns>O produto criado.</returns>
        /// <exception cref="ArgumentNullException">Lançada se o comando for nulo.</exception>
        /// <exception cref="ArgumentException">
        /// Lançada se os dados do produto forem inválidos ou se a lista contiver códigos repetidos.
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada se o preço, a quantidade ou a unidade de medida forem inválidos.
        /// </exception>
        /// <exception cref="InvalidOperationException">
        /// Lançada se já existir outro produto com o mesmo nome ou se algum código de barras
        /// informado já estiver associado a outro produto.
        /// </exception>
        public async Task<Produto> CadastrarAsync(CadastrarProdutoCommand command)
        {
            ArgumentNullException.ThrowIfNull(command);

            if (await _produtoRepository.ExisteComNomeAsync(command.Nome))
            {
                throw new InvalidOperationException(
                    $"Já existe um produto cadastrado com o nome '{command.Nome.Trim()}'.");
            }

            var codigosBarras = command.CodigosBarras ?? Array.Empty<string>();

            if (codigosBarras.Count > 0)
            {
                var codigosEmUso =
                    await _produtoRepository.ObterCodigosBarrasEmUsoAsync(codigosBarras);

                if (codigosEmUso.Count > 0)
                {
                    throw new InvalidOperationException(
                        $"Os seguintes códigos de barras já estão associados a outro produto: " +
                        $"{string.Join(", ", codigosEmUso)}.");
                }
            }

            var produto = new Produto(
                nome: command.Nome,
                descricao: command.Descricao,
                preco: command.Preco,
                disponivel: command.Disponivel,
                unidadeMedida: command.UnidadeMedida,
                controlaEstoque: command.ControlaEstoque,
                quantidadeEstoque: command.QuantidadeEstoque,
                codigosBarras: command.CodigosBarras);

            await _produtoRepository.AdicionarAsync(produto);

            return produto;
        }
    }
}