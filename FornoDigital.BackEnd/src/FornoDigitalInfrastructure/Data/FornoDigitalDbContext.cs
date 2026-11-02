using FornoDigitalDomain.Entities.Clientes;
using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalInfrastructure.Configurations.Clientes;
using FornoDigitalInfrastructure.Configurations.Produtos;
using Microsoft.EntityFrameworkCore;

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
            modelBuilder.ApplyConfiguration(new ProdutoConfiguration());
        }

        /// <summary>
        /// Representa a coleção de clientes armazenados no banco de dados.
        /// </summary>
        public DbSet<Cliente> Clientes => Set<Cliente>();

        /// <summary>
        /// Representa a coleção de produtos armazenados no banco de dados.
        /// </summary>
        public DbSet<Produto> Produtos => Set<Produto>();
    }
}
