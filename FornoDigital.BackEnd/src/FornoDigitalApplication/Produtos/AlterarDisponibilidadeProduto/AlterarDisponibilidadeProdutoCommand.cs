namespace FornoDigitalApplication.Produtos.AlterarDisponibilidadeProduto
{
    /// <summary>Dados necessários para disponibilizar ou inativar um produto.</summary>
    public sealed record AlterarDisponibilidadeProdutoCommand(Guid Id, bool Disponivel);
}
