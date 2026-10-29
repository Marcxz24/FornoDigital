using FornoDigitalInfrastructure.Configurations.Clientes;
using FornoDigitalDomain.Entities.Clientes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalInfrastructure.Data
{
    /// <summary>
    /// Representa a sessão de acesso ao banco de dados do FornoDigital.
    /// Gerencia as entidades e suas operações de persistência usando o Entity Framework Core.
    /// </summary>
    public class FornoDigitalDbContext : DbContext
    {
        public FornoDigitalDbContext(
            DbContextOptions<FornoDigitalDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new ClienteConfiguration());
        }

        /// <summary>
        /// Representa a coleção de clientes armazenados no banco de dados.
        /// </summary>
        public DbSet<Cliente> Clientes => Set<Cliente>();
    }
}
