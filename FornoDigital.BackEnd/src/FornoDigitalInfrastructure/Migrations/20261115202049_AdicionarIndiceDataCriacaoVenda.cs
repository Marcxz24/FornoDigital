using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FornoDigitalInfrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarIndiceDataCriacaoVenda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Vendas_Data_Criacao",
                table: "Vendas",
                column: "Data_Criacao");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Vendas_Data_Criacao",
                table: "Vendas");
        }
    }
}
