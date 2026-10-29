using FornoDigitalDomain.Entities.Clientes;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Repositories.Clientes
{
    /// <summary>
    /// Define o contrato de repositório para operações de acesso a dados da entidade <see cref="Cliente"/>.
    /// Segue o padrão de projeto Repository, desacoplando a camada de persistência (EF Core/SQLite) da regra de negócio.
    /// </summary>
    public interface IClienteRepository
    {
        /// <summary>
        /// Busca assincronamente um cliente pelo seu identificador único exclusivo (ID).
        /// </summary>
        /// <param name="id">O GUID correspondente ao ID do cliente.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Cliente"/> se encontrada, ou <c>null</c> caso contrário.</returns>
        Task<Cliente?> ObterPorIdAsync(Guid id);

        /// <summary>
        /// Busca assincronamente um cliente com base no número do seu CPF.
        /// </summary>
        /// <param name="cpf">A string contendo o número do CPF a ser pesquisado.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Cliente"/> correspondente, ou <c>null</c> se não existir.</returns>
        Task<Cliente?> ObterPorCpfAsync(string cpf);

        /// <summary>
        /// Recupera assincronamente uma lista somente leitura com todos os clientes cadastrados no sistema.
        /// </summary>
        /// <returns>Uma tarefa que retorna uma coleção de leitura otimizada contendo todos os clientes.</returns>
        Task<IReadOnlyList<Cliente>> ObterTodosAsync();

        /// <summary>
        /// Adiciona de forma assíncrona um novo cliente ao contexto de persistência.
        /// </summary>
        /// <param name="cliente">A instância da entidade <see cref="Cliente"/> a ser inserida.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de adição.</returns>
        Task AdicionarAsync(Cliente cliente);

        /// <summary>
        /// Atualiza de forma assíncrona os dados de um cliente existente no contexto de persistência.
        /// </summary>
        /// <param name="cliente">A instância da entidade <see cref="Cliente"/> com os dados modificados.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de atualização.</returns>
        Task AtualizarAsync(Cliente cliente);

        /// <summary>
        /// Verifica assincronamente se já existe algum cliente cadastrado utilizando o CPF informado.
        /// Útil para validações de unicidade antes de cadastros ou edições.
        /// </summary>
        /// <param name="cpf">O número do CPF a ser verificado.</param>
        /// <returns>Uma tarefa que retorna <c>true</c> se o CPF já estiver cadastrado, ou <c>false</c> caso contrário.</returns>
        Task<bool> ExisteCpfAsync(string cpf);
    }
}
