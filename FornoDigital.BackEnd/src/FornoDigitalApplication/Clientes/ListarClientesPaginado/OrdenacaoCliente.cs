namespace FornoDigitalApplication.Clientes.ListarClientesPaginado
{
    /// <summary>
    /// Campos aceitos para ordenar a listagem paginada de clientes.
    /// O identificador é sempre usado como critério de desempate.
    /// </summary>
    public enum OrdenacaoCliente
    {
        /// <summary>Ordena pelo nome do cliente.</summary>
        Nome = 0,

        /// <summary>Ordena pela cidade do cliente.</summary>
        Cidade = 1,

        /// <summary>Ordena pela data de cadastro.</summary>
        DataCadastro = 2
    }
}
