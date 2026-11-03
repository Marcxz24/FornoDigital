using FornoDigitalDomain.Entities.Clientes;
using FornoDigitalInfrastructure.Configurations.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalInfrastructure.Configurations.Clientes
{
    public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
    {
        /// <summary>
        /// Configura o mapeamento relacional e as restrições da entidade <see cref="Cliente"/> 
        /// para o banco de dados utilizando a Fluent API do Entity Framework Core.
        /// </summary>
        /// <param name="builder">O construtor de tipo de entidade utilizado para configurar o mapeamento da tabela <see cref="Cliente"/>.</param>
        public void Configure(EntityTypeBuilder<Cliente> builder)
        {
            // Define o nome da tabela física no banco de dados SQLite.
            builder.ToTable("Clientes");

            // Define a propriedade Id como a chave primária da tabela.
            builder.HasKey(clientes => clientes.Id);

            // Configuração da coluna de identificação única (Id).
            builder.Property(cliente => cliente.Id)
                .HasColumnName("Id")
                .HasColumnType("TEXT") // Mapeia o GUID para texto, padrão recomendado no SQLite.
                .IsRequired();

            // Configuração da coluna de nome completo (obrigatório com limite de 150 caracteres).
            builder.Property(cliente => cliente.Nome)
                .HasColumnName("Nome")
                .HasMaxLength(150)
                .IsRequired();

            // Configuração da coluna de CPF (opcional com limite de 11 caracteres).
            builder.Property(cliente => cliente.Cpf)
                .HasColumnName("Cpf")
                .HasMaxLength(11)
                .IsRequired(false);

            // Configuração da coluna de telefone ou WhatsApp de contato (opcional).
            builder.Property(cliente => cliente.Telefone)
                .HasColumnName("Telefone")
                .HasMaxLength(20)
                .IsRequired(false);

            // Configuração da coluna de e-mail (opcional com limite padrão de 254 caracteres).
            builder.Property(cliente => cliente.Email)
                .HasColumnName("Email")
                .HasMaxLength(254)
                .IsRequired(false);

            // Configuração da coluna de logradouro do endereço (opcional).
            builder.Property(cliente => cliente.Endereco)
                .HasColumnName("Endereco")
                .HasMaxLength(200)
                .IsRequired(false);

            // Configuração da coluna do número do imóvel/residência (opcional).
            builder.Property(cliente => cliente.NumeroCasa)
                .HasColumnName("Numero_Casa")
                .HasMaxLength(20)
                .IsRequired(false);

            // Configuração da coluna de bairro (opcional).
            builder.Property(cliente => cliente.Bairro)
                .HasColumnName("Bairro")
                .HasMaxLength(100)
                .IsRequired(false);

            // Configuração da coluna de cidade (opcional).
            builder.Property(cliente => cliente.Cidade)
                .HasColumnName("Cidade")
                .HasMaxLength(100)
                .IsRequired(false);

            // Configuração da coluna de sigla do estado UF (opcional com limite de 2 caracteres).
            builder.Property(cliente => cliente.Estado)
                .HasColumnName("Estado")
                .HasMaxLength(2)
                .IsRequired(false);

            // Configuração da coluna de auditoria para data de criação (obrigatória).
            builder.Property(cliente => cliente.DataCriacao)
                .HasColumnName("Data_Criacao")
                .HasConversion(new UtcDateTimeConverter())
                .IsRequired();

            // Configuração da coluna de auditoria para data de última atualização (opcional, preenchida apenas após alterações).
            builder.Property(cliente => cliente.DataAtualizacao)
                .HasColumnName("Data_Atualizacao")
                .HasConversion(new UtcDateTimeConverter())
                .IsRequired(false);

            // Cria um índice no banco de dados para acelerar buscas e consultas por CPF.
            builder.HasIndex(cliente => cliente.Cpf)
                .HasDatabaseName("IX_Clientes_Cpf");
        }
    }
}
