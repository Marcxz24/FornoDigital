namespace FornoDigitalApplication.Common.Paginacao
{
    /// <summary>
    /// Representa uma página de resultados de uma consulta paginada.
    /// </summary>
    /// <typeparam name="T">Tipo dos itens retornados.</typeparam>
    /// <param name="Items">Itens da página solicitada.</param>
    /// <param name="Page">Número da página (iniciando em 1).</param>
    /// <param name="PageSize">Quantidade máxima de itens por página.</param>
    /// <param name="TotalCount">Total de registros que atendem aos filtros, considerando todas as páginas.</param>
    public sealed record ResultadoPaginado<T>(
        IReadOnlyList<T> Items,
        int Page,
        int PageSize,
        int TotalCount)
    {
        /// <summary>
        /// Quantidade total de páginas para os filtros aplicados.
        /// Retorna zero quando nenhum registro foi encontrado.
        /// </summary>
        public int TotalPages =>
            TotalCount == 0 ? 0 : (int)Math.Ceiling(TotalCount / (double)PageSize);
    }
}
