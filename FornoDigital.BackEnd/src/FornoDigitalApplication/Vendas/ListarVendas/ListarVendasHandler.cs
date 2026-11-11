using FornoDigitalDomain.Entities.Vendas;
using FornoDigitalDomain.Repositories.Vendas;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Vendas.ListarVendas
{
    /// <summary>
    /// Representa o manipulador de consultas (<see cref="ListarVendasHandler"/>) responsável por processar 
    /// a solicitação de listagem de vendas (<see cref="ListarVendasQuery"/>), obtendo os dados através do repositório.
    /// </summary>
    /// <remarks>
    /// Inicializa uma nova instância da classe <see cref="ListarVendasHandler"/> com o repositório de vendas injetado.
    /// </remarks>
    /// <param name="vendaRepository">O repositório de vendas (<see cref="IVendaRepository"/>) utilizado para acesso aos dados.</param>
    public sealed class ListarVendasHandler(IVendaRepository vendaRepository)
    {
        /// <summary>
        /// Processa de forma assíncrona a consulta para listar todas as vendas registradas no sistema.
        /// </summary>
        /// <param name="query">A consulta (<see cref="ListarVendasQuery"/>) solicitando a listagem.</param>
        /// <param name="cancellationToken">O token de cancelamento (<see cref="CancellationToken"/>) para a operação assíncrona.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona, contendo uma lista somente leitura (<see cref="IReadOnlyList{Venda}"/>) com as vendas encontradas.</returns>
        /// <exception cref="ArgumentNullException">Lançado se a <paramref name="query"/> fornecida for nula.</exception>
        public async Task<IReadOnlyList<Venda>> HandleAsync(
            ListarVendasQuery query,
            CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(query);

            return await vendaRepository.ObterTodasAsync(cancellationToken);
        }
    }
}
