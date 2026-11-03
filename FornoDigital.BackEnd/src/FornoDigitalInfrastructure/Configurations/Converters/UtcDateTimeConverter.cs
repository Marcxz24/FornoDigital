using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FornoDigitalInfrastructure.Configurations.Converters
{
    /// <summary>
    /// Preserva os valores de data já gerados em UTC ao gravá-los e marca como UTC
    /// os valores lidos do banco de dados.
    /// </summary>
    public sealed class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
    {
        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="UtcDateTimeConverter"/>, 
        /// configurando as regras de conversão para manter o valor original na gravação 
        /// e garantir o fuso horário UTC na leitura do banco de dados.
        /// </summary>
        public UtcDateTimeConverter()
            : base(
                value => value,
                value => DateTime.SpecifyKind(value, DateTimeKind.Utc))
        {
        }
    }
}
