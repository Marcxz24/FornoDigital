using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FornoDigitalInfrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarCatalogoProdutos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Produtos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Preco_Venda = table.Column<decimal>(type: "TEXT", nullable: false),
                    Disponivel = table.Column<bool>(type: "INTEGER", nullable: false),
                    Unidade_Medida = table.Column<int>(type: "INTEGER", nullable: false),
                    Controla_Estoque = table.Column<bool>(type: "INTEGER", nullable: false),
                    Quantidade_Estoque = table.Column<decimal>(type: "TEXT", nullable: true),
                    Data_Criacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Data_Atualizacao = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produtos", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Produtos");
        }
    }
}
