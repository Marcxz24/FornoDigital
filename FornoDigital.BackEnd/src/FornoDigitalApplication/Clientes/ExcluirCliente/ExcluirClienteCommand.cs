using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Clientes.ExcluirCliente
{
    /// <summary>
    /// Representa o comando (Command) utilizado na camada de aplicação para encapsular 
    /// o identificador necessário para a exclusão de um cliente do sistema.
    /// </summary>
    /// <param name="Id">Identificador único exclusivo (GUID) do cliente que será excluído.</param>
    public sealed record ExcluirClienteCommand(Guid Id);
}
