using FornoDigitalDomain.Common;
using FornoDigitalDomain.Enums.Produtos;
using System;
using System.Collections.Generic;
using System.Linq;
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
        /// Obtém a unidade de medida comercial associada ao produto.
        /// </summary>
        public UnidadeMedidaProduto UnidadeMedida { get; private set; }

        /// <summary>
        /// Obtém um valor que indica se a entidade gerencia controle de estoque para este item.
        /// </summary>
        public bool ControlaEstoque { get; private set; }

        /// <summary>
        /// Obtém a quantidade atual disponível em estoque quando o controle está habilitado.
        /// </summary>
        public decimal? QuantidadeEstoque { get; private set; }

        /// <summary>
        /// Obtém um valor que indica se o produto possui estoque positivo e controla estoque.
        /// </summary>
        public bool TemEstoque =>
            ControlaEstoque && QuantidadeEstoque > 0;

        /// <summary>
        /// Obtém uma coleção somente leitura dos códigos de barras associados ao produto.
        /// </summary>
        public IReadOnlyCollection<CodigoBarrasProduto> CodigosBarras =>
            _codigosBarras.AsReadOnly();

        /// <summary>
        /// Coleção interna usada para manter os códigos de barras do produto.
        /// </summary>
        private readonly List<CodigoBarrasProduto> _codigosBarras = new();

        /// <summary>
        /// Construtor sem parâmetros utilizado pelo Entity Framework Core.
        /// </summary>
        private Produto()
        {
        }

        /// <summary>
        /// Cria um produto após validar seus dados e regras de estoque.
        /// </summary>
        /// <param name="nome">Nome obrigatório do produto.</param>
        /// <param name="descricao">Descrição opcional; pode ser nula ou vazia.</param>
        /// <param name="preco">Preço de venda, que deve ser maior que zero.</param>
        /// <param name="disponivel">Indica se o produto estará disponível para venda inicialmente.</param>
        /// <param name="unidadeMedida">Unidade de medida comercial do produto.</param>
        /// <param name="controlaEstoque">Indica se o sistema acompanhará o estoque do produto.</param>
        /// <param name="quantidadeEstoque">
        /// Quantidade inicial. Se o controle estiver ativo e a quantidade for nula, o estoque começa em zero.
        /// Se o controle estiver desativado, informe <c>null</c>.
        /// </param>
        /// <param name="codigosBarras">
        /// Códigos de barras iniciais. Se nulo, o produto começa sem códigos.
        /// </param>
        /// <exception cref="ArgumentException">
        /// Lançada se o nome for inválido, se for informada quantidade sem controle de estoque,
        /// ou se houver código vazio ou repetido.
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada se o preço não for positivo, a quantidade for negativa ou a unidade de medida for inválida.
        /// </exception>
        public Produto(
            string nome,
            string? descricao,
            decimal preco,
            bool disponivel,
            UnidadeMedidaProduto unidadeMedida,
            bool controlaEstoque,
            decimal? quantidadeEstoque,
            IEnumerable<string>? codigosBarras = null)
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

            var codigosBarrasNormalizados = NormalizarCodigosBarras(
                codigosBarras ?? Enumerable.Empty<string>());

            Nome = nome.Trim();
            Descricao = NormalizarOpcional(descricao);
            Preco = preco;
            Disponivel = disponivel;
            UnidadeMedida = unidadeMedida;
            ControlaEstoque = controlaEstoque;
            QuantidadeEstoque = controlaEstoque
                ? quantidadeEstoque ?? 0m
                : null;

            // Adiciona os códigos recebidos durante a criação do produto.
            _codigosBarras.AddRange(codigosBarrasNormalizados);
        }

        /// <summary>
        /// Altera os dados cadastrais e a configuração de estoque do produto.
        /// A disponibilidade continua sendo alterada por uma operação independente.
        /// </summary>
        /// <param name="nome">Novo nome do produto.</param>
        /// <param name="descricao">Nova descrição opcional.</param>
        /// <param name="preco">Novo preço de venda.</param>
        /// <param name="unidadeMedida">Nova unidade de medida comercial.</param>
        /// <param name="controlaEstoque">Indica se o produto passará a controlar estoque.</param>
        /// <param name="quantidadeEstoque">
        /// Nova quantidade; se o controle estiver ativo e for nula, será zero.
        /// </param>
        /// <param name="codigosBarras">
        /// Se nulo, mantém os códigos atuais. Se informado, substitui a coleção inteira;
        /// uma coleção vazia remove todos os códigos.
        /// </param>
        /// <exception cref="ArgumentException">
        /// Lançada se o nome for inválido, se houver quantidade sem controle de estoque,
        /// ou se houver código vazio ou repetido.
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada se preço, quantidade ou unidade de medida forem inválidos.
        /// </exception>
        public void AlterarDados(
            string nome,
            string? descricao,
            decimal preco,
            UnidadeMedidaProduto unidadeMedida,
            bool controlaEstoque,
            decimal? quantidadeEstoque,
            IEnumerable<string>? codigosBarras = null)
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

            // Só prepara uma nova coleção se os códigos tiverem sido enviados.
            // Null mantém a coleção atual; uma lista vazia representa remoção de todos.
            var codigosBarrasNormalizados = codigosBarras is null
                ? null
                : NormalizarCodigosBarras(codigosBarras);

            Nome = nome.Trim();
            Descricao = NormalizarOpcional(descricao);
            Preco = preco;
            UnidadeMedida = unidadeMedida;
            ControlaEstoque = controlaEstoque;
            QuantidadeEstoque = controlaEstoque
                ? quantidadeEstoque ?? 0m
                : null;

            if (codigosBarrasNormalizados is not null)
            {
                // Substitui a coleção atual pelos códigos recebidos.
                _codigosBarras.Clear();
                _codigosBarras.AddRange(codigosBarrasNormalizados);
            }

            RegistrarAtualizacao();
        }

        /// <summary>
        /// Altera o status de disponibilidade de venda do produto.
        /// </summary>
        /// <param name="disponivel">Novo estado de disponibilidade.</param>
        public void AlterarDisponibilidade(bool disponivel)
        {
            Disponivel = disponivel;
            RegistrarAtualizacao();
        }

        /// <summary>
        /// Ajusta manualmente a quantidade física em estoque.
        /// </summary>
        /// <param name="quantidade">Nova quantidade em estoque.</param>
        /// <exception cref="InvalidOperationException">
        /// Lançada se o controle de estoque estiver desativado.
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada se a quantidade for negativa.
        /// </exception>
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
        /// Cria os objetos de domínio dos códigos e valida duplicidades dentro da coleção.
        /// </summary>
        /// <param name="codigosBarras">Códigos que serão associados ao produto.</param>
        /// <returns>Lista normalizada de códigos de barras.</returns>
        /// <exception cref="ArgumentException">
        /// Lançada quando existe código vazio ou repetido na coleção.
        /// </exception>
        private static List<CodigoBarrasProduto> NormalizarCodigosBarras(
            IEnumerable<string> codigosBarras)
        {
            ArgumentNullException.ThrowIfNull(codigosBarras);

            var codigosNormalizados = codigosBarras
                .Select(codigo => new CodigoBarrasProduto(codigo))
                .ToList();

            var quantidadeDeCodigosUnicos = codigosNormalizados
                .Select(codigo => codigo.CodigoBarras)
                .Distinct(StringComparer.Ordinal)
                .Count();

            if (quantidadeDeCodigosUnicos != codigosNormalizados.Count)
            {
                throw new ArgumentException(
                    "A lista contém códigos de barras repetidos.",
                    nameof(codigosBarras));
            }

            return codigosNormalizados;
        }

        /// <summary>
        /// Valida que o nome informado não seja nulo ou vazio.
        /// </summary>
        /// <param name="nome">Nome do produto.</param>
        /// <exception cref="ArgumentException">
        /// Lançada se o nome for nulo, vazio ou composto apenas por espaços.
        /// </exception>
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
        /// Valida que o preço seja positivo e tenha no máximo duas casas decimais.
        /// </summary>
        /// <param name="preco">Preço do produto.</param>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada se o preço não for positivo ou tiver mais de duas casas decimais.
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
        /// Valida se a unidade corresponde a uma opção definida no enum.
        /// </summary>
        /// <param name="unidadeMedida">Unidade informada.</param>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada se a unidade de medida não for válida.
        /// </exception>
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
        /// Normaliza um texto opcional, retornando null quando estiver vazio.
        /// </summary>
        private static string? NormalizarOpcional(string? valor) =>
            string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();
    }
}