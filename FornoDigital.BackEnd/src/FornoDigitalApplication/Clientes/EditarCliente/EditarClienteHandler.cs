using FornoDigitalDomain.Entities.Clientes;
using FornoDigitalDomain.Repositories.Clientes;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Clientes.EditarCliente
{
    /// <summary>
    /// Manipulador (Handler) responsável por processar o caso de uso de edição e atualização de um cliente existente no sistema.
    /// Localiza o registro por ID, aplica as alterações na entidade e persiste as modificações através do repositório.
    /// </summary>
    public sealed class EditarClienteHandler
    {
        private readonly IClienteRepository _clienteRepository;

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="EditarClienteHandler"/>.
        /// </summary>
        /// <param name="clienteRepository">Repositório injetado para gerenciar o acesso aos dados dos clientes.</param>
        public EditarClienteHandler(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        /// <summary>
        /// Executa assincronamente a lógica de negócio para atualizar os dados de um cliente existente com base no comando fornecido.
        /// </summary>
        /// <param name="command">O comando (<see cref="EditarClienteCommand"/>) contendo o ID e os novos dados para a alteração.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Cliente"/> atualizada e persistida com sucesso.</returns>
        /// <exception cref="ArgumentNullException">Lançado se o objeto <paramref name="command"/> for nulo.</exception>
        /// <exception cref="InvalidOperationException">Lançado se nenhum cliente for encontrado com o ID especificado no comando.</exception>
        public async Task<Cliente> EditarAsync(EditarClienteCommand command)
        {
            ArgumentNullException.ThrowIfNull(command);

            var cliente = await _clienteRepository.ObterPorIdAsync(command.Id);
            if (cliente == null)
            {
                throw new InvalidOperationException($"Cliente com ID {command.Id} não encontrado.");
            }

            cliente.AlterarNome(command.Nome);
            cliente.AtualizarContato(command.Telefone, command.Email);
            cliente.AtualizarEndereco(command.Endereco, command.NumeroCasa, command.Bairro, command.Cidade, command.Estado);
            cliente.DefinirCpf(command.Cpf);

            await _clienteRepository.AtualizarAsync(cliente);

            return cliente;
        }
    }
}
