using FornoDigitalApplication.Common.Paginacao;

namespace FornoDigitalApplication.Clientes.ListarClientesPaginado
{
    /// <summary>
    /// Consulta uma página de clientes, com busca e ordenação opcionais.
    /// </summary>
    /// <param name="Page">Página desejada, iniciando em 1.</param>
    /// <param name="PageSize">Quantidade de registros por página.</param>
    /// <param name="Busca">
    /// Termo pesquisado no nome e no e-mail; os dígitos do termo também são
    /// pesquisados no CPF e no telefone.
    /// </param>
    /// <param name="OrdenarPor">Campo usado na ordenação.</param>
    /// <param name="Direcao">Direção da ordenação.</param>
    public sealed record ListarClientesPaginadoQuery(
        int Page = ParametrosPaginacao.PaginaPadrao,
        int PageSize = ParametrosPaginacao.TamanhoPaginaPadrao,
        string? Busca = null,
        OrdenacaoCliente OrdenarPor = OrdenacaoCliente.Nome,
        DirecaoOrdenacao Direcao = DirecaoOrdenacao.Asc);
}
