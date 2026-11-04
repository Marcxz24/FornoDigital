using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalDomain.Entities.Vendas;
using FornoDigitalInfrastructure.Configurations.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalInfrastructure.Configurations.Vendas
{
    /// <summary>
    /// Representa a classe de configuração de mapeamento relacional (<see cref="IEntityTypeConfiguration{TEntity}"/>) 
    /// para a entidade <see cref="ItemVenda"/>, definindo o esquema da tabela, chaves primárias e estrangeiras, 
    /// conversões de tipos monetários, propriedades ignoradas e regras de integridade referencial.
    /// </summary>
    public class ItemVendaConfiguration : IEntityTypeConfiguration<ItemVenda>
    {
        /// <summary>
        /// Configura o mapeamento da entidade <see cref="ItemVenda"/> para o banco de dados relacional.
        /// </summary>
        /// <param name="builder">O construtor de entidades (<see cref="EntityTypeBuilder{ItemVenda}"/>) utilizado para configurar as propriedades e mapeamentos.</param>
        public void Configure(EntityTypeBuilder<ItemVenda> builder)
        {
            builder.ToTable("Itens_Venda");

            builder.HasKey(item => item.Id);

            builder.Property(item => item.Id)
                .HasColumnName("Id")
                .HasColumnType("TEXT");

            builder.Property(item => item.VendaId)
                .HasColumnName("Venda_Id")
                .HasColumnType("TEXT")
                .IsRequired();

            builder.Property(item => item.ProdutoId)
                .HasColumnName("Produto_Id")
                .HasColumnType("TEXT")
                .IsRequired();

            builder.Property(item => item.NomeProduto)
                .HasColumnName("Nome_Produto")
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(item => item.Quantidade)
                .HasColumnName("Quantidade")
                .HasColumnType("TEXT")
                .IsRequired();

            builder.Property(item => item.PrecoUnitario)
                .HasColumnName("Preco_Unitario")
                .HasConversion(new DecimalToCentsConverter())
                .HasColumnType("INTEGER")
                .IsRequired();

            builder.Ignore(item => item.Subtotal);

            builder.Property(item => item.DataCriacao)
                .HasColumnName("Data_Criacao")
                .HasConversion(new UtcDateTimeConverter())
                .IsRequired();

            builder.Ignore(item => item.DataAtualizacao);

            builder.HasOne<Produto>()
                .WithMany()
                .HasForeignKey(item => item.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
