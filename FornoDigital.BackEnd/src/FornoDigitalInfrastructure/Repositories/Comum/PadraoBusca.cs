using System.Text;

namespace FornoDigitalInfrastructure.Repositories.Comum
{
    /// <summary>
    /// Monta padrões seguros para o operador LIKE do SQLite usados nas consultas de listagem.
    /// </summary>
    internal static class PadraoBusca
    {
        /// <summary>
        /// Caractere de escape informado ao LIKE para que %, _ e \ digitados
        /// pela pessoa sejam tratados como texto literal.
        /// </summary>
        public const string CaractereEscape = "\\";

        /// <summary>
        /// Cria um padrão "contém" (<c>%termo%</c>) escapando os caracteres especiais do LIKE.
        /// </summary>
        public static string Contem(string termo)
        {
            var padrao = new StringBuilder(termo.Length + 2);
            padrao.Append('%');

            foreach (var caractere in termo)
            {
                if (caractere is '%' or '_' or '\\')
                {
                    padrao.Append('\\');
                }

                padrao.Append(caractere);
            }

            padrao.Append('%');

            return padrao.ToString();
        }

        /// <summary>
        /// Retorna somente os dígitos do termo, usados para pesquisar CPF e telefone.
        /// </summary>
        public static string ObterDigitos(string termo)
        {
            var digitos = new StringBuilder(termo.Length);

            foreach (var caractere in termo)
            {
                if (char.IsAsciiDigit(caractere))
                {
                    digitos.Append(caractere);
                }
            }

            return digitos.ToString();
        }
    }
}
