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
    }
}
