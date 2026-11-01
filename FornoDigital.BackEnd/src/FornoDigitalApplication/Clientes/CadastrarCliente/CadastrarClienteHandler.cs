using FornoDigitalDomain.Entities.Clientes;
using FornoDigitalDomain.Repositories.Clientes;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Clientes.CadastrarCliente
{
    /// <summary>
    /// Manipulador (Handler) responsável por processar o caso de uso de cadastro de um novo cliente no sistema.
    /// Executa validações de regras de negócio, instancia a entidade <see cref="Cliente"/> 
    /// e realiza a persistência através do repositório.
    /// </summary>
    public sealed class CadastrarClienteHandler
    {
        private readonly IClienteRepository _clienteRepository;

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="CadastrarClienteHandler"/>.
        /// </summary>
        /// <param name="clienteRepository">Repositório injetado para gerenciar o acesso aos dados dos clientes.</param>
        public CadastrarClienteHandler(IClienteRepository clienteRepository)
        {
            _clienteRepository = clienteRepository;
        }

        /// <summary>
        /// Executa assincronamente a lógica de negócio para cadastrar um novo cliente com base no comando fornecido.
        /// </summary>
        /// <param name="command">O comando (<see cref="CadastrarClienteCommand"/>) contendo os dados para o cadastro.</param>
        /// <param name="cancellationToken">Token opcional para propagar notificações de cancelamento da operação assíncrona.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Cliente"/> recém-criada e persistida com sucesso.</returns>
        /// <exception cref="ArgumentNullException">Lançado se o objeto <paramref name="command"/> for nulo.</exception>
        /// <exception cref="ArgumentException">Lançado se o nome ou o telefone obrigatório do cliente estiverem vazios ou inválidos.</exception>
        public async Task<Cliente> CadastrarAsync(CadastrarClienteCommand command)
        {
            ArgumentNullException.ThrowIfNull(command);

            var cliente = new Cliente(
                nome: command.Nome,
                telefone: command.Telefone,
                cpf: command.Cpf,
                email: command.Email,
                endereco: command.Endereco,
                numeroCasa: command.NumeroCasa,
                bairro: command.Bairro,
                cidade: command.Cidade,
                estado: command.Estado);

            await _clienteRepository.AdicionarAsync(cliente);

            return cliente;
        }
    }
}
