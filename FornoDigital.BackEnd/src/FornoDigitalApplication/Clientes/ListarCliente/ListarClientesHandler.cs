using FornoDigitalDomain.Entities.Clientes;
using FornoDigitalDomain.Repositories.Clientes;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Clientes.ListarCliente
{
    /// <summary>
    /// Executa a consulta de listagem de clientes.
    /// </summary>
    public sealed class ListarClientesHandler
    {
        private readonly IClienteRepository _clienteRepository;

        public ListarClientesHandler(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        /// <summary>
        /// Retorna todos os clientes cadastrados.
        /// </summary>
        public Task<IReadOnlyList<Cliente>> ListarAsync(ListarClientesQuery query)
        {
            ArgumentNullException.ThrowIfNull(query);

            return _clienteRepository.ObterTodosAsync();
        }
    }
}
