using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalInfrastructure.Configurations.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FornoDigitalInfrastructure.Configurations.Produtos
{
    /// <summary>
    /// Configura o mapeamento relacional e as convenções de persistência da entidade <see cref="Produto"/> 
    /// para o banco de dados utilizando o Entity Framework Core.
    /// </summary>
    public class ProdutoConfiguration : IEntityTypeConfiguration<Produto>
    {
        /// <summary>
        /// Configura a estrutura da tabela, chaves primárias, restrições, nomes de colunas e tipos de dados para <see cref="Produto"/>.
        /// </summary>
        /// <param name="builder">O construtor de entidades utilizado para configurar o mapeamento (<see cref="EntityTypeBuilder{TEntity}"/>).</param>
        public void Configure(EntityTypeBuilder<Produto> builder)
        {
            // Define o nome da tabela no banco de dados SQLite
            builder.ToTable("Produtos");

            // Configura a chave primária da entidade
            builder.HasKey(p => p.Id);

            // Configura a propriedade de identificação única (GUID armazenado como TEXT no SQLite)
            builder.Property(p => p.Id)
                .HasColumnName("Id")
                .HasColumnType("TEXT");

            // Configura o nome do produto (obrigatório, máximo de 150 caracteres)
            builder.Property(p => p.Nome)
                .HasColumnName("Nome")
                .IsRequired()
                .HasMaxLength(150);

            // Configura a descrição detalhada do produto (opcional, máximo de 500 caracteres)
            builder.Property(p => p.Descricao)
                .HasColumnName("Descricao")
                .HasMaxLength(500)
                .IsRequired(false);

            // Configura o preço de venda do produto
            builder.Property(p => p.Preco)
                .HasColumnName("Preco_Venda")
                .IsRequired();

            // Configura o status de disponibilidade para comercialização
            builder.Property(p => p.Disponivel)
                .HasColumnName("Disponivel")
                .IsRequired();

            // Configura a unidade de medida convertendo o Enum para o seu valor inteiro correspondente
            builder.Property(p => p.UnidadeMedida)
                .HasColumnName("Unidade_Medida")
                .HasConversion<int>()
                .IsRequired();

            // Configura a flag que indica se o produto controla estoque
            builder.Property(p => p.ControlaEstoque)
                .HasColumnName("Controla_Estoque")
                .IsRequired();

            // Configura a quantidade atual disponível em estoque
            builder.Property(p => p.QuantidadeEstoque)
                .HasColumnName("Quantidade_Estoque")
                .IsRequired(false);

            // Configura a propriedade de auditoria que armazena a data e hora exatas da criação do registro do produto.
            builder.Property(p => p.DataCriacao)
                .HasColumnName("Data_Criacao")
                .HasConversion(new UtcDateTimeConverter())
                .IsRequired();

            // Configura a propriedade de auditoria que armazena a data e hora da última alteração nos dados do produto (opcional).
            builder.Property(p => p.DataAtualizacao)
                .HasColumnName("Data_Atualizacao")
                .HasConversion(new UtcDateTimeConverter())
                .IsRequired(false);

            // Ignora a propriedade calculada de domínio para que o EF Core não tente mapeá-la como coluna na tabela
            builder.Ignore(produto => produto.TemEstoque);
        }
    }
}