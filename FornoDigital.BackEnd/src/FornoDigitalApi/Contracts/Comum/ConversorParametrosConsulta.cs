using FornoDigitalApplication.Common.Paginacao;

namespace FornoDigitalApi.Contracts.Comum
{
    /// <summary>
    /// Converte os parâmetros textuais recebidos na query string das listagens.
    /// </summary>
    public static class ConversorParametrosConsulta
    {
        /// <summary>
        /// Converte <c>asc</c> ou <c>desc</c> (sem diferenciar maiúsculas) para <see cref="DirecaoOrdenacao"/>.
        /// Quando o valor não é informado, usa ordem crescente.
        /// </summary>
        /// <returns><c>true</c> se o valor é vazio ou válido; caso contrário, <c>false</c>.</returns>
        public static bool TentarConverterDirecao(string? valor, out DirecaoOrdenacao direcao)
        {
            direcao = DirecaoOrdenacao.Asc;

            if (string.IsNullOrWhiteSpace(valor))
            {
                return true;
            }

            switch (valor.Trim().ToLowerInvariant())
            {
                case "asc":
                    return true;
                case "desc":
                    direcao = DirecaoOrdenacao.Desc;
                    return true;
                default:
                    return false;
            }
        }

        /// <summary>
        /// Converte um valor textual para uma opção da lista permitida, sem diferenciar maiúsculas.
        /// Quando o valor não é informado, retorna a opção padrão.
        /// </summary>
        /// <returns><c>true</c> se o valor é vazio ou está na lista; caso contrário, <c>false</c>.</returns>
        public static bool TentarConverterOpcao<TOpcao>(
            string? valor,
            IReadOnlyDictionary<string, TOpcao> opcoesPermitidas,
            TOpcao padrao,
            out TOpcao opcao)
        {
            opcao = padrao;

            if (string.IsNullOrWhiteSpace(valor))
            {
                return true;
            }

            if (opcoesPermitidas.TryGetValue(valor.Trim(), out var opcaoEncontrada))
            {
                opcao = opcaoEncontrada;
                return true;
            }

            return false;
        }
    }
}
