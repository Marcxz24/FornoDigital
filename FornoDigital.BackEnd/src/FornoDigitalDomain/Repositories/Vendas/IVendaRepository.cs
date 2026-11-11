using FornoDigitalDomain.Entities.Vendas;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Repositories.Vendas
{
    /// <summary>
    /// Define o contrato do repositório para o gerenciamento de operações de persistência 
    /// e acesso a dados relacionados à entidade <see cref="Venda"/>.
    /// </summary>
    public interface IVendaRepository
    {
        /// <summary>
        /// Adiciona de forma assíncrona uma nova entidade de venda ao contexto de persistência.
        /// </summary>
        /// <param name="venda">A instância da entidade <see cref="Venda"/> a ser adicionada.</param>
        /// <returns>Uma tarefa (<see cref="Task"/>) que representa a operação assíncrona de inserção.</returns>
        Task AdicionarAsync(Venda venda);

        /// <summary>
        /// Obtém de forma assíncrona uma entidade de venda pelo seu identificador único.
        /// </summary>
        /// <param name="id">O identificador único da entidade <see cref="Venda"/>.</param>
        /// <returns>Uma tarefa (<see cref="Task"/>) que representa a operação assíncrona de obtenção. O resultado contém a entidade <see cref="Venda"/> correspondente ao identificador fornecido, ou <c>null</c> se não for encontrada.</returns>
        Task<Venda?> ObterPorIdAsync(Guid id, CancellationToken cancellationToken = default);

        /// <summary>
        /// Obtém de forma assíncrona todas as entidades de venda disponíveis no contexto de persistência.
        /// Retorna uma lista com todas as instâncias da entidade <see cref="Venda"/>.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<IReadOnlyList<Venda>> ObterTodasAsync(
            CancellationToken cancellationToken = default);
    }
}
