using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalDomain.Repositories.Produtos;

namespace FornoDigitalApplication.Produtos.EditarProduto
{
    /// <summary>
    /// Executa o caso de uso de edição de um produto existente.
    /// </summary>
    public sealed class EditarProdutoHandler
    {
        private readonly IProdutoRepository _produtoRepository;

        public EditarProdutoHandler(IProdutoRepository produtoRepository)
        {
            _produtoRepository = produtoRepository;
        }

        /// <summary>
        /// Aplica as alterações e persiste o produto.
        /// </summary>
        /// <param name="command">Dados para editar o produto.</param>
        /// <returns>Produto atualizado, ou null se não existir.</returns>
        public async Task<Produto?> EditarAsync(EditarProdutoCommand command)
        {
            ArgumentNullException.ThrowIfNull(command);

            if (command.Id == Guid.Empty)
            {
                throw new ArgumentException(
                    "O identificador do produto não pode ser vazio.",
                    nameof(command));
            }

            var produto = await _produtoRepository.ObterPorIdAsync(command.Id);
            if (produto is null)
            {
                return null;
            }

            var nomeAtual = produto.Nome.Trim();
            var novoNome = command.Nome.Trim();

            if (!StringComparer.OrdinalIgnoreCase.Equals(nomeAtual, novoNome)
                && await _produtoRepository.ExisteComNomeAsync(novoNome, produto.Id))
            {
                throw new InvalidOperationException(
                    $"Já existe outro produto cadastrado com o nome '{novoNome}'.");
            }

            if (command.CodigosBarras is { Count: > 0 })
            {
                var codigosEmUso =
                    await _produtoRepository.ObterCodigosBarrasEmUsoAsync(
                        command.CodigosBarras,
                        produto.Id);

                if (codigosEmUso.Count > 0)
                {
                    throw new InvalidOperationException(
                        $"Os seguintes códigos de barras já estão associados a outro produto: " +
                        $"{string.Join(", ", codigosEmUso)}.");
                }
            }

            produto.AlterarDados(
                nome: command.Nome,
                descricao: command.Descricao,
                preco: command.Preco,
                unidadeMedida: command.UnidadeMedida,
                controlaEstoque: command.ControlaEstoque,
                quantidadeEstoque: command.QuantidadeEstoque,
                codigosBarras: command.CodigosBarras);

            await _produtoRepository.AtualizarAsync(produto);

            return produto;
        }
    }
}