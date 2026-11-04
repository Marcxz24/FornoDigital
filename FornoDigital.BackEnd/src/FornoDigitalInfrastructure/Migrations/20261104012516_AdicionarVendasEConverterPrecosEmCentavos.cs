using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FornoDigitalInfrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarVendasEConverterPrecosEmCentavos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "UPDATE \"Produtos\" " +
                "SET \"Preco_Venda\" = CAST(ROUND(CAST(\"Preco_Venda\" AS REAL) * 100) AS INTEGER);");

            migrationBuilder.AlterColumn<long>(
                name: "Preco_Venda",
                table: "Produtos",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "TEXT");

            migrationBuilder.CreateTable(
                name: "Vendas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Cliente_Id = table.Column<Guid>(type: "TEXT", nullable: true),
                    Subtotal = table.Column<long>(type: "INTEGER", nullable: false),
                    Desconto = table.Column<long>(type: "INTEGER", nullable: false),
                    Total = table.Column<long>(type: "INTEGER", nullable: false),
                    Data_Criacao = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vendas_Clientes_Cliente_Id",
                        column: x => x.Cliente_Id,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Itens_Venda",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Venda_Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Produto_Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome_Produto = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Quantidade = table.Column<decimal>(type: "TEXT", nullable: false),
                    Preco_Unitario = table.Column<long>(type: "INTEGER", nullable: false),
                    Data_Criacao = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Itens_Venda", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Itens_Venda_Produtos_Produto_Id",
                        column: x => x.Produto_Id,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Itens_Venda_Vendas_Venda_Id",
                        column: x => x.Venda_Id,
                        principalTable: "Vendas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Itens_Venda_Produto_Id",
                table: "Itens_Venda",
                column: "Produto_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Itens_Venda_Venda_Id",
                table: "Itens_Venda",
                column: "Venda_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Vendas_Cliente_Id",
                table: "Vendas",
                column: "Cliente_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Itens_Venda");

            migrationBuilder.DropTable(
                name: "Vendas");

            migrationBuilder.AlterColumn<decimal>(
                name: "Preco_Venda",
                table: "Produtos",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "INTEGER");

            migrationBuilder.Sql(
                "UPDATE \"Produtos\" " +
                "SET \"Preco_Venda\" = printf('%.2f', CAST(\"Preco_Venda\" AS INTEGER) / 100.0);");
        }
    }
}
