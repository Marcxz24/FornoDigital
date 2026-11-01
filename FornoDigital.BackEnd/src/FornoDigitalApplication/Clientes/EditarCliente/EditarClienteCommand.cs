using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Clientes.EditarCliente
{
    /// <summary>
    /// Representa o comando (Command) utilizado na camada de aplicação para encapsular 
    /// os dados necessários para a atualização e edição de um cliente existente no sistema.
    /// </summary>
    /// <param name="Id">Identificador único exclusivo (GUID) do cliente que será editado.</param>
    /// <param name="Nome">Novo nome completo obrigatório do cliente.</param>
    /// <param name="Telefone">Novo número de telefone ou WhatsApp de contato obrigatório do cliente.</param>
    /// <param name="Cpf">Novo número do CPF do cliente para fins de identificação fiscal (opcional).</param>
    /// <param name="Email">Novo endereço de e-mail do cliente para comunicações (opcional).</param>
    /// <param name="Endereco">Novo logradouro, rua ou avenida do endereço do cliente (opcional).</param>
    /// <param name="Bairro">Novo bairro correspondente ao endereço do cliente (opcional).</param>
    /// <param name="NumeroCasa">Novo número da residência ou imóvel do cliente (opcional).</param>
    /// <param name="Cidade">Nova cidade onde o cliente reside (opcional).</param>
    /// <param name="Estado">Nova sigla do estado (UF) onde o cliente reside (opcional).</param>
    public sealed record EditarClienteCommand(
        Guid Id,
        string Nome,
        string Telefone,
        string? Cpf = null,
        string? Email = null,
        string? Endereco = null,
        string? Bairro = null,
        string? NumeroCasa = null,
        string? Cidade = null,
        string? Estado = null
    );
}
