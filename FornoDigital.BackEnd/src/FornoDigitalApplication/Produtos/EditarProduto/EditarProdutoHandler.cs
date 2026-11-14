using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalDomain.Repositories.Produtos;

namespace FornoDigitalApplication.Produtos.EditarProduto
{
    /// <summary>Executa o caso de uso de edição dos dados de um produto existente.</summary>
    public sealed class EditarProdutoHandler
    {
        private readonly IProdutoRepository _produtoRepository;

        public EditarProdutoHandler(IProdutoRepository produtoRepository)
        {
            _produtoRepository = produtoRepository;
        }

        /// <summary>Aplica as alterações e persiste o produto; retorna null se não existir.</summary>
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

            produto.AlterarDados(
                command.Nome,
                command.Descricao,
                command.Preco,
                command.UnidadeMedida,
                command.ControlaEstoque,
                command.QuantidadeEstoque);

            await _produtoRepository.AtualizarAsync(produto);
            return produto;
        }
    }
}
