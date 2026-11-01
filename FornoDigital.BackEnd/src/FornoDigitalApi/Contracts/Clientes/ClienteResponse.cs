namespace FornoDigitalApi.Contracts.Clientes
{
    /// <summary>
    /// Dados do cliente devolvidos pela API após o cadastro.
    /// </summary>
    public sealed record ClienteResponse(
        Guid Id,
        string Nome,
        string? Cpf,
        string? Email,
        string? Telefone,
        string? Endereco,
        string? Bairro,
        string? NumeroCasa,
        string? Cidade,
        string? Estado,
        DateTime DataCadastro,
        DateTime? DataAtualizacao
    );
}
