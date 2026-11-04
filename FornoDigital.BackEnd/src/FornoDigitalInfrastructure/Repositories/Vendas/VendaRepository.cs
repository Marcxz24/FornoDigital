using FornoDigitalDomain.Entities.Vendas;
using FornoDigitalDomain.Repositories.Vendas;
using FornoDigitalInfrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalInfrastructure.Repositories.Vendas
{
    /// <summary>
    /// Representa a implementação concreta do repositório <see cref="IVendaRepository"/>, 
    /// utilizando o contexto do Entity Framework Core (<see cref="FornoDigitalDbContext"/>) 
    /// para gerenciar as operações de persistência de vendas no banco de dados.
    /// </summary>
    public sealed class VendaRepository : IVendaRepository
    {
        /// <summary>
        /// Contexto de banco de dados da aplicação utilizado para acesso e manipulação das entidades.
        /// </summary>
        private readonly FornoDigitalDbContext _context;

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="VendaRepository"/> com o contexto de banco de dados injetado.
        /// </summary>
        /// <param name="context">O contexto do banco de dados (<see cref="FornoDigitalDbContext"/>).</param>
        public VendaRepository(FornoDigitalDbContext context)
        {
            _context = context;
        }

        /// <inheritdoc />
        public async Task AdicionarAsync(Venda venda)
        {
            ArgumentNullException.ThrowIfNull(venda);

            await _context.Vendas.AddAsync(venda);
            await _context.SaveChangesAsync();
        }
    }
}
