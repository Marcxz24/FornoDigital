using FornoDigitalDomain.Entities.Clientes;
using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalDomain.Entities.Vendas;
using FornoDigitalInfrastructure.Configurations.Clientes;
using FornoDigitalInfrastructure.Configurations.Produtos;
using FornoDigitalInfrastructure.Configurations.Vendas;
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
            modelBuilder.ApplyConfiguration(new VendaConfiguration());
            modelBuilder.ApplyConfiguration(new ItemVendaConfiguration());
        }

        /// <summary>
        /// Representa a coleção de clientes armazenados no banco de dados.
        /// </summary>
        public DbSet<Cliente> Clientes => Set<Cliente>();

        /// <summary>
        /// Representa a coleção de produtos armazenados no banco de dados.
        /// </summary>
        public DbSet<Produto> Produtos => Set<Produto>();

        /// <summary>
        /// Obtém ou define o conjunto de entidades (<see cref="DbSet{TEntity}"/>) correspondente às vendas registradas no sistema.
        /// </summary>
        public DbSet<Venda> Vendas => Set<Venda>();

        /// <summary>
        /// Obtém ou define o conjunto de entidades (<see cref="DbSet{TEntity}"/>) correspondente aos itens individuais vinculados às vendas.
        /// </summary>
        public DbSet<ItemVenda> ItensVenda => Set<ItemVenda>();
    }
}
