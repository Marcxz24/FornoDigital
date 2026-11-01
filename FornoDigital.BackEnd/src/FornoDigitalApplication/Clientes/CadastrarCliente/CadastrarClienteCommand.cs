using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Clientes.CadastrarCliente
{
    /// <summary>
    /// Representa o comando (Command) utilizado na camada de aplicação para encapsular 
    /// os dados necessários para o cadastro de um novo cliente no sistema.
    /// </summary>
    /// <param name="Nome">Nome completo obrigatório do cliente.</param>
    /// <param name="Telefone">Número de telefone ou WhatsApp de contato do cliente.</param>
    /// <param name="Cpf">Número do CPF do cliente para fins de identificação fiscal (opcional).</param>
    /// <param name="Email">Endereço de e-mail do cliente para comunicações (opcional).</param>
    /// <param name="Endereco">Logradouro, rua ou avenida do endereço do cliente (opcional).</param>
    /// <param name="Bairro">Bairro correspondente ao endereço do cliente (opcional).</param>
    /// <param name="NumeroCasa">Número da residência ou imóvel do cliente (opcional).</param>
    /// <param name="Cidade">Cidade onde o cliente reside (opcional).</param>
    /// <param name="Estado">Sigla do estado (UF) onde o cliente reside (opcional).</param>
    public sealed record CadastrarClienteCommand(
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
