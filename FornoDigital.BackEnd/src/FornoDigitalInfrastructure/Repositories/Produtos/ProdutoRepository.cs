using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalDomain.Repositories.Produtos;
using FornoDigitalInfrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FornoDigitalInfrastructure.Repositories.Produtos
{
    /// <summary>
    /// Implementação concreta do repositório de produtos (<see cref="IProdutoRepository"/>), 
    /// responsável por gerenciar as operações de persistência e consulta utilizando o Entity Framework Core e o SQLite.
    /// </summary>
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly FornoDigitalDbContext _context;

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="ProdutoRepository"/>.
        /// </summary>
        /// <param name="context">O contexto de banco de dados da aplicação (<see cref="FornoDigitalDbContext"/>) injetado via DI.</param>
        public ProdutoRepository(FornoDigitalDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Busca e retorna de forma assíncrona um produto específico com base no seu identificador único.
        /// </summary>
        /// <param name="id">O identificador único exclusivo (<see cref="Guid"/>) do produto.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Produto"/> se encontrada, ou <c>null</c> caso contrário.</returns>
        public async Task<Produto?> ObterPorIdAsync(Guid id)
        {
            return await _context.Produtos.FindAsync(id);
        }

        /// <summary>
        /// Retorna de forma assíncrona uma lista somente leitura com todos os produtos cadastrados.
        /// Utiliza o modo <c>AsNoTracking</c> para otimizar consultas de leitura sem rastreamento de estado.
        /// </summary>
        /// <returns>Uma tarefa que representa a operação assíncrona, contendo uma lista somente leitura de <see cref="Produto"/>.</returns>
        public async Task<IReadOnlyList<Produto>> ObterTodosAsync()
        {
            return await _context.Produtos.AsNoTracking().ToListAsync();
        }

        /// <summary>
        /// Adiciona de forma assíncrona um novo produto ao contexto de persistência e grava as alterações no banco de dados.
        /// </summary>
        /// <param name="produto">A instância da entidade <see cref="Produto"/> que será adicionada.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de inclusão e salvamento.</returns>
        public async Task AdicionarAsync(Produto produto)
        {
            await _context.Produtos.AddAsync(produto);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Atualiza de forma assíncrona os dados de um produto existente no contexto e persiste as alterações no banco de dados.
        /// </summary>
        /// <param name="produto">A instância da entidade <see cref="Produto"/> com os dados atualizados.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de atualização e salvamento.</returns>
        public async Task AtualizarAsync(Produto produto)
        {
            _context.Produtos.Update(produto);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Remove de forma assíncrona o registro de um produto do contexto de persistência e grava as alterações no banco de dados.
        /// </summary>
        /// <param name="produto">A instância da entidade <see cref="Produto"/> que será excluída.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de remoção e salvamento.</returns>
        public async Task RemoverAsync(Produto produto)
        {
            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();
        }
    }
}
