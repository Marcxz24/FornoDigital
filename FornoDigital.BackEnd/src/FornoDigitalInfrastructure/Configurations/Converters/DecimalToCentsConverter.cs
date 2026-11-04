using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FornoDigitalInfrastructure.Configurations.Converters;

/// <summary>
/// Representa um conversor de valor personalizado do Entity Framework Core (<see cref="ValueConverter{TModel, TProvider}"/>) 
/// responsável por mapear e converter valores monetários do tipo <see cref="decimal"/> para inteiros de 64 bits (<see cref="long"/>) 
/// armazenados como centavos na base de dados, e vice-versa.
/// </summary>
public sealed class DecimalToCentsConverter : ValueConverter<decimal, long>
{
    /// <summary>
    /// Inicializa uma nova instância da classe <see cref="DecimalToCentsConverter"/>, 
    /// configurando as regras de conversão bidirecional entre o modelo de domínio e o provedor de banco de dados.
    /// </summary>
    public DecimalToCentsConverter()
       : base(
           valor => decimal.ToInt64(valor * 100m),
           centavos => centavos / 100m)
    {
    }
}