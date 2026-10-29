using FornoDigitalDomain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Entities.Clientes
{
    /// <summary>
    /// Representa a entidade de Clientes no sistema, armazenando dados cadastrais, 
    /// informações de contato e o endereço para faturamento e entregas.
    /// Herda propriedades de auditoria e identificação de <see cref="EntityBase"/>.
    /// </summary>
    public class Cliente : EntityBase
    {
        /// <summary>
        /// Obtém ou define o nome completo do cliente. 
        /// Este campo é obrigatório e inicializado como vazio por padrão.
        /// </summary>
        public string Nome { get; private set; } = string.Empty;

        /// <summary>
        /// Obtém ou define o número de CPF do cliente (opcional). 
        /// Utilizado para identificação fiscal e emissão de notas.
        /// </summary>
        public string? Cpf { get; private set; }

        /// <summary>
        /// Obtém ou define o número de telefone ou WhatsApp de contato do cliente (opcional). 
        /// Utilizado para comunicação e envio de comprovantes/pedidos.
        /// </summary>
        public string? Telefone { get; private set; }

        /// <summary>
        /// Obtém ou define o endereço de e-mail do cliente (opcional). 
        /// Utilizado para envio de comunicações e notificações do sistema.
        /// </summary>
        public string? Email { get; private set; }

        /// <summary>
        /// Obtém ou define a cidade onde o cliente reside (opcional).
        /// </summary>
        public string? Cidade { get; private set; }

        /// <summary>
        /// Obtém ou define a sigla do estado (UF) onde o cliente reside (opcional).
        /// </summary>
        public string? Estado { get; private set; }

        /// <summary>
        /// Obtém ou define o logradouro (rua, avenida, travessa, etc.) do endereço do cliente (opcional).
        /// </summary>
        public string? Endereco { get; private set; }

        /// <summary>
        /// Obtém ou define o bairro correspondente ao endereço do cliente (opcional).
        /// </summary>
        public string? Bairro { get; private set; }

        /// <summary>
        /// Obtém ou define o número da residência ou imóvel do cliente (opcional).
        /// </summary>
        public string? NumeroCasa { get; private set; }

        /// <summary>
        /// Construtor utilizado pelo Entity Framework Core.
        /// </summary>
        private Cliente()
        {
        }

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="Cliente"/> exigindo um nome válido.
        /// </summary>
        /// <param name="nome">Nome completo obrigatório do cliente.</param>
        /// <exception cref="ArgumentException">Lançado se o nome for nulo, vazio ou composto apenas por espaços em branco.</exception>
        public Cliente(string nome)
        {
            if (string.IsNullOrWhiteSpace(nome))
            {
                throw new ArgumentException(
                    "O nome do cliente é obrigatório.",
                    nameof(nome));
            }

            Nome = nome.Trim();
        }

        /// <summary>
        /// Altera o nome do cliente aplicando validação de preenchimento obrigatório e registra a data da atualização.
        /// </summary>
        /// <param name="nome">Novo nome completo do cliente.</param>
        /// <exception cref="ArgumentException">Lançado se o novo nome for nulo, vazio ou composto apenas por espaços em branco.</exception>
        public void AlterarNome(string nome)
        {
            if (string.IsNullOrWhiteSpace(nome))
            {
                throw new ArgumentException(
                    "O nome do cliente é obrigatório.",
                    nameof(nome));
            }

            Nome = nome.Trim();
            RegistrarAtualizacao();
        }

        /// <summary>
        /// Atualiza as informações de contato do cliente (telefone e e-mail) e registra a data da alteração.
        /// </summary>
        /// <param name="telefone">Novo número de telefone ou WhatsApp (opcional).</param>
        /// <param name="email">Novo endereço de e-mail (opcional).</param>
        public void AtualizarContato(string? telefone, string? email)
        {
            Telefone = telefone?.Trim();
            Email = email?.Trim();

            RegistrarAtualizacao();
        }

        /// <summary>
        /// Atualiza os dados completos de endereço do cliente e registra a data da alteração.
        /// O estado é padronizado automaticamente para letras maiúsculas.
        /// </summary>
        /// <param name="endereco">Logradouro, rua ou avenida (opcional).</param>
        /// <param name="numeroCasa">Número do imóvel ou residência (opcional).</param>
        /// <param name="bairro">Bairro correspondente (opcional).</param>
        /// <param name="cidade">Cidade de residência (opcional).</param>
        /// <param name="estado">Sigla do estado (UF), convertida automaticamente para maiúsculas (opcional).</param>
        public void AtualizarEndereco(
            string? endereco,
            string? numeroCasa,
            string? bairro,
            string? cidade,
            string? estado)
        {
            Endereco = endereco?.Trim();
            NumeroCasa = numeroCasa?.Trim();
            Bairro = bairro?.Trim();
            Cidade = cidade?.Trim();
            Estado = estado?.Trim().ToUpperInvariant();

            RegistrarAtualizacao();
        }

        /// <summary>
        /// Define ou limpa o número de CPF do cliente, registrando a data da alteração.
        /// </summary>
        /// <param name="cpf">Número do CPF a ser cadastrado ou nulo para remover (opcional).</param>
        public void DefinirCpf(string? cpf)
        {
            Cpf = string.IsNullOrWhiteSpace(cpf)
                ? null
                : cpf.Trim();

            RegistrarAtualizacao();
        }
    }
}
