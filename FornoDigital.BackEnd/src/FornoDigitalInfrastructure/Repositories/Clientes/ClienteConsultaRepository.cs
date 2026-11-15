using FornoDigitalApplication.Clientes.ListarClientesPaginado;
using FornoDigitalApplication.Common.Paginacao;
using FornoDigitalDomain.Entities.Clientes;
using FornoDigitalInfrastructure.Data;
using FornoDigitalInfrastructure.Repositories.Comum;
using Microsoft.EntityFrameworkCore;

namespace FornoDigitalInfrastructure.Repositories.Clientes
{
    /// <summary>
    /// Implementa as consultas de leitura de clientes com EF Core e SQLite.
    /// Busca, ordenação e paginação são executadas no banco de dados e o resultado
    /// é projetado diretamente para <see cref="ClienteListagemItem"/>, sem rastreamento.
    /// </summary>
    public sealed class ClienteConsultaRepository : IClienteConsultaRepository
    {
        private readonly FornoDigitalDbContext _context;

        /// <summary>
        /// Inicializa o repositório de leitura com o contexto do banco de dados.
        /// </summary>
        public ClienteConsultaRepository(FornoDigitalDbContext context)
        {
            _context = context;
        }

        /// <inheritdoc />
        public async Task<ResultadoPaginado<ClienteListagemItem>> ListarPaginadoAsync(
            ListarClientesPaginadoQuery query,
            CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(query);

            var clientes = AplicarBusca(_context.Clientes.AsNoTracking(), query.Busca);

            // O total considera a busca, mas não a paginação.
            var totalCount = await clientes.CountAsync(cancellationToken);
            var deslocamento = (long)(query.Page - 1) * query.PageSize;

            // Evita consultar o banco quando a página pedida está além do último registro.
            if (totalCount == 0 || deslocamento >= totalCount)
            {
                return new ResultadoPaginado<ClienteListagemItem>(
                    Array.Empty<ClienteListagemItem>(),
                    query.Page,
                    query.PageSize,
                    totalCount);
            }

            var itens = await Ordenar(clientes, query.OrdenarPor, query.Direcao)
                .Skip((int)deslocamento)
                .Take(query.PageSize)
                .Select(cliente => new ClienteListagemItem(
                    cliente.Id,
                    cliente.Nome,
                    cliente.Cpf,
                    cliente.Email,
                    cliente.Telefone,
                    cliente.Endereco,
                    cliente.Bairro,
                    cliente.NumeroCasa,
                    cliente.Cidade,
                    cliente.Estado,
                    cliente.DataCriacao,
                    cliente.DataAtualizacao))
                .ToListAsync(cancellationToken);

            return new ResultadoPaginado<ClienteListagemItem>(
                itens,
                query.Page,
                query.PageSize,
                totalCount);
        }

        /// <summary>
        /// Filtra por nome ou e-mail contendo o termo. Quando o termo possui dígitos,
        /// também filtra CPF e telefone contendo esses dígitos.
        /// </summary>
        private static IQueryable<Cliente> AplicarBusca(IQueryable<Cliente> clientes, string? busca)
        {
            if (busca is null)
            {
                return clientes;
            }

            var padraoTexto = PadraoBusca.Contem(busca);
            var digitos = PadraoBusca.ObterDigitos(busca);

            if (digitos.Length == 0)
            {
                return clientes.Where(cliente =>
                    EF.Functions.Like(cliente.Nome, padraoTexto, PadraoBusca.CaractereEscape) ||
                    (cliente.Email != null &&
                        EF.Functions.Like(cliente.Email, padraoTexto, PadraoBusca.CaractereEscape)));
            }

            var padraoDigitos = $"%{digitos}%";

            return clientes.Where(cliente =>
                EF.Functions.Like(cliente.Nome, padraoTexto, PadraoBusca.CaractereEscape) ||
                (cliente.Email != null &&
                    EF.Functions.Like(cliente.Email, padraoTexto, PadraoBusca.CaractereEscape)) ||
                (cliente.Cpf != null && EF.Functions.Like(cliente.Cpf, padraoDigitos)) ||
                (cliente.Telefone != null && EF.Functions.Like(cliente.Telefone, padraoDigitos)));
        }

        /// <summary>
        /// Aplica a ordenação solicitada e usa o identificador como desempate,
        /// garantindo que nenhum registro se repita ou desapareça entre páginas.
        /// </summary>
        private static IOrderedQueryable<Cliente> Ordenar(
            IQueryable<Cliente> clientes,
            OrdenacaoCliente ordenarPor,
            DirecaoOrdenacao direcao)
        {
            var crescente = direcao == DirecaoOrdenacao.Asc;

            return ordenarPor switch
            {
                OrdenacaoCliente.Cidade => crescente
                    ? clientes.OrderBy(c => c.Cidade).ThenBy(c => c.Nome).ThenBy(c => c.Id)
                    : clientes.OrderByDescending(c => c.Cidade).ThenBy(c => c.Nome).ThenBy(c => c.Id),

                OrdenacaoCliente.DataCadastro => crescente
                    ? clientes.OrderBy(c => c.DataCriacao).ThenBy(c => c.Id)
                    : clientes.OrderByDescending(c => c.DataCriacao).ThenByDescending(c => c.Id),

                _ => crescente
                    ? clientes.OrderBy(c => c.Nome).ThenBy(c => c.Id)
                    : clientes.OrderByDescending(c => c.Nome).ThenByDescending(c => c.Id)
            };
        }
    }
}
