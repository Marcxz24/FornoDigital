using FornoDigitalDomain.Entities.Clientes;
using FornoDigitalDomain.Repositories.Clientes;
using FornoDigitalInfrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalInfrastructure.Repositories.Clientes
{
    /// <summary>
    /// Implementação concreta da interface <see cref="IClienteRepository"/>, 
    /// responsável por realizar as operações de persistência e consulta de clientes 
    /// no banco de dados utilizando o Entity Framework Core (<see cref="FornoDigitalDbContext"/>).
    /// </summary>
    public class ClienteRepository : IClienteRepository
    {
        private readonly FornoDigitalDbContext _context;

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="ClienteRepository"/>.
        /// </summary>
        /// <param name="context">O contexto do banco de dados injetado para gerenciar a conexão e o mapeamento das entidades.</param>
        public ClienteRepository(FornoDigitalDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Busca assincronamente um cliente pelo seu identificador único (ID).
        /// </summary>
        /// <param name="id">O GUID correspondente ao ID do cliente.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Cliente"/> se encontrada, ou <c>null</c> caso contrário.</returns>
        public Task<Cliente?> ObterPorIdAsync(Guid id) =>
            _context.Clientes.FirstOrDefaultAsync(c => c.Id == id);

        /// <summary>
        /// Busca assincronamente um cliente com base no número do seu CPF.
        /// </summary>
        /// <param name="cpf">A string contendo o número do CPF a ser pesquisado.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Cliente"/> correspondente, ou <c>null</c> se não existir.</returns>
        public Task<Cliente?> ObterPorCpfAsync(string cpf) =>
            _context.Clientes.FirstOrDefaultAsync(c => c.Cpf == cpf);

        /// <summary>
        /// Busca assincronamente um cliente com base no endereço de e-mail cadastrado.
        /// </summary>
        /// <param name="email">O e-mail a ser pesquisado.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Cliente"/> correspondente, ou <c>null</c> se não existir.</returns>
        public Task<Cliente?> ObterPorEmailAsync(string email) =>
            _context.Clientes.FirstOrDefaultAsync(c => c.Email == email);

        /// <summary>
        /// Busca assincronamente um cliente com base no número de telefone ou WhatsApp.
        /// </summary>
        /// <param name="telefone">O número de telefone a ser pesquisado.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Cliente"/> correspondente, ou <c>null</c> se não existir.</returns>
        public Task<Cliente?> ObterPorTelefoneAsync(string telefone) =>
            _context.Clientes.FirstOrDefaultAsync(c => c.Telefone == telefone);

        /// <summary>
        /// Recupera assincronamente uma lista somente leitura de todos os clientes cadastrados.
        /// Utiliza <c>AsNoTracking</c> para otimizar a performance em consultas de leitura pura, desativando o rastreamento do EF Core.
        /// </summary>
        /// <returns>Uma tarefa que retorna uma coleção de leitura contendo todos os clientes.</returns>
        public async Task<IReadOnlyList<Cliente>> ObterTodosAsync() =>
            await _context.Clientes.AsNoTracking().ToListAsync();

        /// <summary>
        /// Adiciona de forma assíncrona um novo cliente ao contexto e persiste as alterações imediatamente no banco de dados SQLite.
        /// </summary>
        /// <param name="cliente">A instância da entidade <see cref="Cliente"/> a ser inserida.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de inclusão e salvamento.</returns>
        public async Task AdicionarAsync(Cliente cliente)
        {
            await _context.Clientes.AddAsync(cliente);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Atualiza de forma assíncrona os dados de um cliente existente no contexto e persiste as alterações no banco de dados.
        /// </summary>
        /// <param name="cliente">A instância da entidade <see cref="Cliente"/> com as modificações aplicadas.</param>
        /// <returns>Uma tarefa que representa a operação assíncrona de atualização e salvamento.</returns>
        public async Task AtualizarAsync(Cliente cliente)
        {
            _context.Clientes.Update(cliente);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Verifica assincronamente se já existe algum registro utilizando o CPF informado.
        /// </summary>
        /// <param name="cpf">O número do CPF a ser verificado.</param>
        /// <returns>Uma tarefa que retorna <c>true</c> se o CPF já estiver cadastrado, ou <c>false</c> caso contrário.</returns>
        public Task<bool> ExisteCpfAsync(string cpf) =>
            _context.Clientes.AnyAsync(c => c.Cpf == cpf);
    }
}
