using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FornoDigitalInfrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarCodigosBarrasProduto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "produtos_codigo_barras",
                columns: table => new
                {
                    Codigo_Barras = table.Column<string>(type: "TEXT", nullable: false),
                    Produto_Id = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_produtos_codigo_barras", x => new { x.Produto_Id, x.Codigo_Barras });
                    table.ForeignKey(
                        name: "FK_produtos_codigo_barras_Produtos_Produto_Id",
                        column: x => x.Produto_Id,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "UX_produtos_codigo_barras_Codigo_Barras",
                table: "produtos_codigo_barras",
                column: "Codigo_Barras",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "produtos_codigo_barras");
        }
    }
}
