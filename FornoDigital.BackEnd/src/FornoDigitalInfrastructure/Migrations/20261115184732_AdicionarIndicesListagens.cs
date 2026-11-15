using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FornoDigitalInfrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarIndicesListagens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Produtos_Nome_Id",
                table: "Produtos",
                columns: new[] { "Nome", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_Nome_Id",
                table: "Clientes",
                columns: new[] { "Nome", "Id" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Produtos_Nome_Id",
                table: "Produtos");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_Nome_Id",
                table: "Clientes");
        }
    }
}
