using FornoDigitalDomain.Entities.Produtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Repositories.Produtos
{
    /// <summary>
    /// Define o contrato de repositório (Interface) para o gerenciamento das operações de persistência, 
    /// consultas e manipulação de dados da entidade <see cref="Produto"/> no domínio.
    /// </summary>
    public interface IProdutoRepository
    {
        /// <summary>
        /// Busca e retorna de forma assíncrona um produto com base no seu identificador exclusivo.
        /// </summary>
        /// <param name="id">O identificador único (<see cref="Guid"/>) do produto procurado.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Produto"/> correspondente, ou <c>null</c> se não for encontrada.</returns>
        Task<Produto?> ObterPorIdAsync(Guid id);

        /// <summary>
        /// Retorna de forma assíncrona uma lista somente leitura contendo todos os produtos cadastrados no sistema.
        /// </summary>
        /// <returns>Uma tarefa que representa a operação assíncrona, contendo uma lista somente leitura de <see cref="Produto"/>.</returns>
        Task<IReadOnlyList<Produto>> ObterTodosAsync();

        /// <summary>
        /// Adiciona de forma assíncrona um novo produto ao repositório.
        /// </summary>
        /// <param name="produto">A instância da entidade <see cref="Produto"/> que será adicionada.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de inclusão.</returns>
        Task AdicionarAsync(Produto produto);

        /// <summary>
        /// Atualiza de forma assíncrona os dados de um produto existente no repositório.
        /// </summary>
        /// <param name="produto">A instância da entidade <see cref="Produto"/> contendo as informações atualizadas.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de atualização.</returns>
        Task AtualizarAsync(Produto produto);

        /// <summary>
        /// Remove de forma assíncrona o registro de um produto do repositório.
        /// </summary>
        /// <param name="produto">A instância da entidade <see cref="Produto"/> que será excluída.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de remoção.</returns>
        Task RemoverAsync(Produto produto);
    }
}
