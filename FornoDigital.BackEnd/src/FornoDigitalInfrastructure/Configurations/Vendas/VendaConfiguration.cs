using FornoDigitalDomain.Entities.Clientes;
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
    /// para a entidade <see cref="Venda"/>, definindo o esquema da tabela, chaves primárias, conversões de tipos 
    /// para centavos, chaves estrangeiras, relacionamentos e regras de exclusão em cascata.
    /// </summary>
    public sealed class VendaConfiguration : IEntityTypeConfiguration<Venda>
    {
        /// <summary>
        /// Configura o mapeamento da entidade <see cref="Venda"/> para o banco de dados relacional.
        /// </summary>
        /// <param name="builder">O construtor de entidades (<see cref="EntityTypeBuilder{Venda}"/>) utilizado para configurar as propriedades e mapeamentos.</param>
        public void Configure(EntityTypeBuilder<Venda> builder)
        {
            builder.ToTable("Vendas");

            builder.HasKey(v => v.Id);

            builder.Property(v => v.Id)
                .HasColumnName("Id")
                .HasColumnType("TEXT");

            builder.Property(v => v.ClienteId)
                .HasColumnName("Cliente_Id")
                .HasColumnType("TEXT")
                .IsRequired(false);

            builder.Property(v => v.Subtotal)
                .HasColumnName("Subtotal")
                .HasConversion(new DecimalToCentsConverter())
                .HasColumnType("INTEGER")
                .IsRequired();

            builder.Property(v => v.Desconto)
                .HasColumnName("Desconto")
                .HasConversion(new DecimalToCentsConverter())
                .HasColumnType("INTEGER")
                .IsRequired();

            builder.Property(v => v.Total)
                .HasColumnName("Total")
                .HasConversion(new DecimalToCentsConverter())
                .HasColumnType("INTEGER")
                .IsRequired();

            builder.Property(v => v.DataCriacao)
            .HasColumnName("Data_Criacao")
            .HasConversion(new UtcDateTimeConverter())
            .IsRequired();

            builder.Navigation(v => v.Itens)
                .HasField("_itens")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.HasMany(v => v.Itens)
                .WithOne()
                .HasForeignKey(item => item.VendaId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne<Cliente>()
                .WithMany()
                .HasForeignKey(v => v.ClienteId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Ignore(v => v.DataAtualizacao);
        }
    }
}
