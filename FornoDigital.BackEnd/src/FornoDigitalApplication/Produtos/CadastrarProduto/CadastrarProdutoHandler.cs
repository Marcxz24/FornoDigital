using FornoDigitalDomain.Entities.Produtos;
using FornoDigitalDomain.Repositories.Produtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Produtos.CadastrarProduto
{
    /// <summary>
    /// Manipulador (Handler) responsável por processar o caso de uso de cadastro e persistência 
    /// de um novo produto no sistema, instanciando a entidade de domínio e delegando o salvamento ao repositório.
    /// </summary>
    public sealed class CadastrarProdutoHandler
    {
        private readonly IProdutoRepository _produtoRepository;

        /// <summary>
        /// Inicializa uma nova instância da classe <see cref="CadastrarProdutoHandler"/>.
        /// </summary>
        /// <param name="produtoRepository">Repositório injetado para gerenciar o acesso e a persistência dos dados dos produtos.</param>
        public CadastrarProdutoHandler(IProdutoRepository produtoRepository)
        {
            _produtoRepository = produtoRepository;
        }

        /// <summary>
        /// Executa assincronamente a lógica de negócio para instanciar, validar e persistir um novo produto 
        /// com base nos dados fornecidos pelo comando de entrada.
        /// </summary>
        /// <param name="command">O comando (<see cref="CadastrarProdutoCommand"/>) contendo as informações para o cadastro do produto.</param>
        /// <returns>Uma tarefa que retorna a entidade <see cref="Produto"/> recém-criada e persistida no banco de dados.</returns>
        /// <exception cref="ArgumentNullException">Lançado se o objeto <paramref name="command"/> for nulo.</exception>
        /// <exception cref="ArgumentException">Lançado se o nome for inválido ou se houver quantidade informada sem o controle de estoque ativo.</exception>
        /// <exception cref="ArgumentOutOfRangeException">Lançado se o preço for menor/igual a zero, se a quantidade for negativa ou se a unidade de medida for inválida.</exception>
        public async Task<Produto> CadastrarAsync(CadastrarProdutoCommand command)
        {
            ArgumentNullException.ThrowIfNull(command);

            var produto = new Produto(
                nome: command.Nome,
                descricao: command.Descricao,
                preco: command.Preco,
                disponivel: command.Disponivel,
                unidadeMedida: command.UnidadeMedida,
                controlaEstoque: command.ControlaEstoque,
                quantidadeEstoque: command.QuantidadeEstoque);

            await _produtoRepository.AdicionarAsync(produto);

            return produto;
        }
    }
}
