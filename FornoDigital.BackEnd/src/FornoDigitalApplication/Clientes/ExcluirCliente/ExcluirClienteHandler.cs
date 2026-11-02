using FornoDigitalDomain.Repositories.Clientes;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Clientes.ExcluirCliente
{
    /// <summary>
    /// Manipulador (Handler) responsável por processar o caso de uso de exclusão de um cliente do sistema.
    /// Localiza o registro por ID através do repositório, verifica sua existência e executa a remoção.
    /// </summary>
    public sealed class ExcluirClienteHandler
    {
        private readonly IClienteRepository _clienteRepository;

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="ExcluirClienteHandler"/>.
        /// </summary>
        /// <param name="clienteRepository">Repositório injetado para gerenciar o acesso e a remoção dos dados dos clientes.</param>
        public ExcluirClienteHandler(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        /// <summary>
        /// Executa assincronamente a lógica de negócio para excluir um cliente existente com base no comando fornecido.
        /// </summary>
        /// <param name="command">O comando (<see cref="ExcluirClienteCommand"/>) contendo o ID do cliente que será removido.</param>
        /// <returns>
        /// Uma tarefa que retorna <c>true</c> se o cliente foi encontrado e excluído com sucesso, 
        /// ou <c>false</c> caso o cliente não exista no banco de dados.
        /// </returns>
        /// <exception cref="ArgumentNullException">Lançado se o objeto <paramref name="command"/> for nulo.</exception>
        public async Task<bool> ExcluirAsync(ExcluirClienteCommand command)
        {
            ArgumentNullException.ThrowIfNull(command);

            var cliente = await _clienteRepository.ObterPorIdAsync(command.Id);

            if (cliente is null)
                return false;

            await _clienteRepository.RemoverAsync(cliente);
            return true;
        }
    }
}
