using FornoDigitalDomain.Common;
using FornoDigitalDomain.Enums.Produtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalDomain.Entities.Produtos
{
    /// <summary>
    /// Representa a entidade de domínio <see cref="Produto"/> no sistema, contendo as regras de negócio, 
    /// validações e o estado encapsulado referentes aos itens comercializados no PDV/ERP.
    /// </summary>
    public class Produto : EntityBase
    {
        /// <summary>
        /// Obtém o nome obrigatório do produto.
        /// </summary>
        public string Nome { get; private set; } = string.Empty;

        /// <summary>
        /// Obtém a descrição detalhada opcional do produto.
        /// </summary>
        public string? Descricao { get; private set; }

        /// <summary>
        /// Obtém o preço de venda comercial do produto.
        /// </summary>
        public decimal Preco { get; private set; }

        /// <summary>
        /// Obtém um valor que indica se o produto está atualmente disponível para venda.
        /// </summary>
        public bool Disponivel { get; private set; }

        /// <summary>
        /// Obtém a unidade de medida comercial associada ao produto (Ex: Quilograma, Unidade, etc.).
        /// </summary>
        public UnidadeMedidaProduto UnidadeMedida { get; private set; }

        /// <summary>
        /// Obtém um valor que indica se a entidade gerencia controle de estoque para este item.
        /// </summary>
        public bool ControlaEstoque { get; private set; }

        /// <summary>
        /// Obtém a quantidade atual disponível em estoque (quando o controle está habilitado).
        /// </summary>
        public decimal? QuantidadeEstoque { get; private set; }

        /// <summary>
        /// Obtém um valor que indica se o produto possui estoque positivo e controla estoque.
        /// </summary>
        public bool TemEstoque =>
            ControlaEstoque && QuantidadeEstoque > 0;

        /// <summary>
        /// Construtor protegido sem parâmetros utilizado exclusivamente pelo Entity Framework Core para materialização das entidades.
        /// </summary>
        private Produto() { /* Construtor utilizado pelo Entity Framework Core. */ }

        /// <summary>
        /// Cria um produto após validar seus dados e regras de estoque.
        /// </summary>
        /// <param name="nome">Nome obrigatório do produto.</param>
        /// <param name="descricao">Descrição opcional; pode ser nula ou vazia.</param>
        /// <param name="preco">Preço de venda, que deve ser maior que zero.</param>
        /// <param name="disponivel">Indica se o produto estará disponível para venda inicialmente.</param>
        /// <param name="unidadeMedida">Unidade de medida do produto.</param>
        /// <param name="controlaEstoque">Indica se o sistema acompanhará o estoque do produto.</param>
        /// <param name="quantidadeEstoque">
        /// Quantidade inicial. Pode ser nula. Se <paramref name="controlaEstoque"/> for <c>true</c>
        /// e a quantidade for nula, o estoque começa em zero. Se <paramref name="controlaEstoque"/>
        /// for <c>false</c>, informe <c>null</c>.
        /// </param>
        /// <exception cref="ArgumentException">
        /// Lançada se o nome for inválido ou se for informada uma quantidade quando o controle
        /// de estoque estiver desativado.
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada se o preço não for positivo, a quantidade for negativa ou a unidade de medida
        /// não estiver definida no enum.
        /// </exception>
        public Produto(
            string nome,
            string? descricao,
            decimal preco,
            bool disponivel,
            UnidadeMedidaProduto unidadeMedida,
            bool controlaEstoque,
            decimal? quantidadeEstoque)
        {
            ValidarNome(nome);
            ValidarPreco(preco);
            ValidarUnidadeMedida(unidadeMedida);

            if (!controlaEstoque && quantidadeEstoque.HasValue)
            {
                throw new ArgumentException(
                    "Não informe quantidade quando o estoque não é controlado.",
                    nameof(quantidadeEstoque));
            }

            if (quantidadeEstoque < 0)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(quantidadeEstoque),
                    "A quantidade em estoque não pode ser negativa.");
            }

            Nome = nome.Trim();
            Descricao = NormalizarOpcional(descricao);
            Preco = preco;
            Disponivel = disponivel;
            UnidadeMedida = unidadeMedida;
            ControlaEstoque = controlaEstoque;
            QuantidadeEstoque = controlaEstoque
                ? quantidadeEstoque ?? 0
                : null;
        }

        /// <summary>
        /// Altera os dados cadastrais principais de um produto existente, validando as novas informações.
        /// </summary>
        /// <param name="nome">Novo nome do produto.</param>
        /// <param name="descricao">Nova descrição do produto.</param>
        /// <param name="preco">Novo preço de venda.</param>
        /// <param name="unidadeMedida">Nova unidade de medida comercial.</param>
        /// <exception cref="ArgumentException">Lançado se o novo nome for inválido.</exception>
        /// <exception cref="ArgumentOutOfRangeException">Lançado se o preço ou a unidade de medida forem inválidos.</exception>
        public void AlterarDados(
        string nome,
        string? descricao,
        decimal preco,
        UnidadeMedidaProduto unidadeMedida)
        {
            ValidarNome(nome);
            ValidarPreco(preco);
            ValidarUnidadeMedida(unidadeMedida);

            Nome = nome.Trim();
            Descricao = NormalizarOpcional(descricao);
            Preco = preco;
            UnidadeMedida = unidadeMedida;

            RegistrarAtualizacao();
        }

        /// <summary>
        /// Altera o status de disponibilidade do produto para comercialização no PDV.
        /// </summary>
        /// <param name="disponivel">Novo estado de disponibilidade (<c>true</c> para disponível, <c>false</c> para indisponível).</param>
        public void AlterarDisponibilidade(bool disponivel)
        {
            Disponivel = disponivel;
            RegistrarAtualizacao();
        }

        /// <summary>
        /// Ajusta manualmente a quantidade física do estoque para o produto.
        /// </summary>
        /// <param name="quantidade">A nova quantidade a ser definida no estoque.</param>
        /// <exception cref="InvalidOperationException">Lançado se o produto não estiver configurado para controlar estoque.</exception>
        /// <exception cref="ArgumentOutOfRangeException">Lançado se a quantidade informada for negativa.</exception>
        public void AjustarEstoque(decimal quantidade)
        {
            if (!ControlaEstoque)
            {
                throw new InvalidOperationException(
                    "O controle de estoque não está habilitado para este produto.");
            }

            if (quantidade < 0)
            {
                throw new ArgumentOutOfRangeException(
                    nameof(quantidade),
                    "A quantidade em estoque não pode ser negativa.");
            }

            QuantidadeEstoque = quantidade;
            RegistrarAtualizacao();
        }

        /// <summary>
        /// Método de validação privada que garante que o nome informado não seja nulo ou vazio.
        /// </summary>
        /// <param name="nome">String contendo o nome do produto.</param>
        /// <exception cref="ArgumentException">Lançado se o nome for nulo, vazio ou composto apenas por espaços.</exception>
        private static void ValidarNome(string nome)
        {
            if (string.IsNullOrWhiteSpace(nome))
            {
                throw new ArgumentException(
                    "O nome do produto é obrigatório.",
                    nameof(nome));
            }
        }

        /// <summary>
        /// Valida que o preço de venda seja positivo e tenha no máximo duas casas decimais.
        /// </summary>
        /// <param name="preco">Valor numérico do preço.</param>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada se o preço for menor ou igual a zero ou tiver mais de duas casas decimais.
        /// </exception>
        private static void ValidarPreco(decimal preco)
        {
            if (preco <= 0 || preco != decimal.Round(preco, 2))
            {
                throw new ArgumentOutOfRangeException(
                    nameof(preco),
                    "O preço deve ser maior que zero.");
            }
        }

        /// <summary>
        /// Valida se o valor informado corresponde a uma opção existente dentro do enum de unidades de medida.
        /// </summary>
        /// <param name="unidadeMedida">A unidade de medida a ser validada.</param>
        /// <exception cref="ArgumentOutOfRangeException">Lançado se o enum informado for inválido ou não mapeado.</exception>
        private static void ValidarUnidadeMedida(UnidadeMedidaProduto unidadeMedida)
        {
            if (!Enum.IsDefined(unidadeMedida))
            {
                throw new ArgumentOutOfRangeException(
                    nameof(unidadeMedida),
                    "A unidade de medida informada não é válida.");
            }
        }

        /// <summary>
        /// Remove espaços em branco redundantes de uma string opcional e retorna <c>null</c> se estiver vazia.
        /// </summary>
        /// <param name="valor">A string a ser tratada.</param>
        /// <returns>A string limpa com <c>Trim()</c> ou <c>null</c>.</returns>
        private static string? NormalizarOpcional(string? valor) =>
            string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();
    }
}