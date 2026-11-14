using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalDomain.Repositories.Produtos;

namespace FornoDigitalApplication.Produtos.AlterarDisponibilidadeProduto
{
    /// <summary>Executa o caso de uso de alteração de disponibilidade de um produto.</summary>
    public sealed class AlterarDisponibilidadeProdutoHandler
    {
        private readonly IProdutoRepository _produtoRepository;

        public AlterarDisponibilidadeProdutoHandler(IProdutoRepository produtoRepository)
        {
            _produtoRepository = produtoRepository;
        }

        /// <summary>Altera a disponibilidade e persiste o produto; retorna null se não existir.</summary>
        public async Task<Produto?> AlterarAsync(AlterarDisponibilidadeProdutoCommand command)
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

            produto.AlterarDisponibilidade(command.Disponivel);
            await _produtoRepository.AtualizarAsync(produto);
            return produto;
        }
    }
}
