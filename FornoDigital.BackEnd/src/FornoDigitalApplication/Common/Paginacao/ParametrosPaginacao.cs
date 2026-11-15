namespace FornoDigitalApplication.Common.Paginacao
{
    /// <summary>
    /// Centraliza os valores padrão e os limites aceitos nas consultas paginadas.
    /// </summary>
    public static class ParametrosPaginacao
    {
        /// <summary>Página utilizada quando nenhuma é informada.</summary>
        public const int PaginaPadrao = 1;

        /// <summary>Quantidade de registros por página utilizada quando nenhuma é informada.</summary>
        public const int TamanhoPaginaPadrao = 50;

        /// <summary>Maior quantidade de registros aceita em uma única página.</summary>
        public const int TamanhoPaginaMaximo = 100;

        /// <summary>Maior quantidade de caracteres aceita no termo de busca.</summary>
        public const int TamanhoMaximoBusca = 100;

        /// <summary>
        /// Valida a página e a quantidade de registros solicitadas.
        /// </summary>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada quando a página é menor que 1 ou o tamanho está fora do intervalo permitido.
        /// </exception>
        public static void Validar(int page, int pageSize)
        {
            if (page < 1)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(page),
                    "A página deve ser maior ou igual a 1.");
            }

            if (pageSize < 1 || pageSize > TamanhoPaginaMaximo)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(pageSize),
                    $"A quantidade de registros por página deve estar entre 1 e {TamanhoPaginaMaximo}.");
            }
        }

        /// <summary>
        /// Remove espaços externos do termo de busca e retorna <c>null</c> quando estiver vazio.
        /// </summary>
        /// <exception cref="ArgumentException">
        /// Lançada quando o termo ultrapassa <see cref="TamanhoMaximoBusca"/> caracteres.
        /// </exception>
        public static string? NormalizarBusca(string? busca)
        {
            if (string.IsNullOrWhiteSpace(busca))
            {
                return null;
            }

            var termo = busca.Trim();

            if (termo.Length > TamanhoMaximoBusca)
            {
                throw new ArgumentException(
                    $"O termo de busca deve ter no máximo {TamanhoMaximoBusca} caracteres.",
                    nameof(busca));
            }

            return termo;
        }
    }
}
