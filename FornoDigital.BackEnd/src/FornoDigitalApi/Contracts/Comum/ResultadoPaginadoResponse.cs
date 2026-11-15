namespace FornoDigitalApi.Contracts.Comum
{
    /// <summary>
    /// Página de resultados devolvida pelas listagens paginadas da API.
    /// </summary>
    /// <typeparam name="T">Tipo dos itens da página.</typeparam>
    /// <param name="Items">Itens da página solicitada.</param>
    /// <param name="Page">Número da página retornada (iniciando em 1).</param>
    /// <param name="PageSize">Quantidade máxima de itens por página.</param>
    /// <param name="TotalCount">Total de registros encontrados com os filtros aplicados.</param>
    /// <param name="TotalPages">Total de páginas; zero quando nenhum registro foi encontrado.</param>
    public sealed record ResultadoPaginadoResponse<T>(
        IReadOnlyList<T> Items,
        int Page,
        int PageSize,
        int TotalCount,
        int TotalPages
    );
}
