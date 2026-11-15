namespace FornoDigitalApplication.Clientes.ListarClientesPaginado
{
    /// <summary>
    /// Dados de um cliente projetados diretamente pela consulta paginada.
    /// Contém os campos necessários para a listagem e para abrir a edição.
    /// </summary>
    public sealed record ClienteListagemItem(
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
        DateTime DataCriacao,
        DateTime? DataAtualizacao);
}
