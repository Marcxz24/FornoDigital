using FornoDigitalDomain.Entities.Vendas;
using FornoDigitalDomain.Repositories.Vendas;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Vendas.ObterVenda
{
    /// <summary>
    /// Consulta uma venda pelo identificador, incluindo os itens associados.
    /// </summary>
    public sealed class ObterVendaHandler
    {
        private readonly IVendaRepository _vendaRepository;

        public ObterVendaHandler(IVendaRepository vendaRepository)
        {
            _vendaRepository = vendaRepository;
        }

        /// <summary>
        /// Busca a venda correspondente à consulta.
        /// </summary>
        /// <param name="query">Consulta com o ID da venda.</param>
        /// <param name="cancellationToken">Token para cancelar a operação, se necessário.</param>
        /// <returns>A venda encontrada ou <c>null</c> quando não existir.</returns>
        public async Task<Venda?> HandleAsync(
            ObterVendaQuery query,
            CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(query);

            if (query.Id == Guid.Empty)
            {
                throw new ArgumentException(
                    "O ID da venda não pode ser vazio.", 
                    nameof(query));
            }

            return await _vendaRepository.ObterPorIdAsync(query.Id, cancellationToken);
        }
    }
}
