using FornoDigitalDomain.Entities.Vendas;
using FornoDigitalDomain.Repositories.Clientes;
using FornoDigitalDomain.Repositories.Produtos;
using FornoDigitalDomain.Repositories.Vendas;
using System;
using System.Collections.Generic;
using System.Text;

namespace FornoDigitalApplication.Vendas.RegistrarVenda
{
    /// <summary>
    /// Executa o caso de uso de registro de uma venda.
    /// Busca os dados atuais dos produtos, valida disponibilidade e estoque,
    /// monta a venda e solicita sua persistência.
    /// </summary>
    public sealed class RegistrarVendaHandler
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly IProdutoRepository _produtoRepository;
        private readonly IVendaRepository _vendaRepository;

        /// <summary>
        /// Inicializa o Handler com os repositórios necessários para consultar
        /// clientes e produtos e persistir a venda.
        /// </summary>
        /// <param name="clienteRepository">Repositório usado para validar o cliente opcional.</param>
        /// <param name="produtoRepository">Repositório usado para buscar os produtos da venda.</param>
        /// <param name="vendaRepository">Repositório usado para persistir a venda e seus itens.</param>
        public RegistrarVendaHandler(
            IClienteRepository clienteRepository,
            IProdutoRepository produtoRepository,
            IVendaRepository vendaRepository)
        {
            _clienteRepository = clienteRepository;
            _produtoRepository = produtoRepository;
            _vendaRepository = vendaRepository;
        }

        /// <summary>
        /// Valida os dados recebidos, monta a venda com os preços atuais dos produtos
        /// e solicita que ela seja salva.
        /// </summary>
        /// <param name="command">
        /// Dados para registrar a venda: cliente opcional, produtos, quantidades e desconto.
        /// </param>
        /// <returns>A venda registrada, incluindo seus itens e valores calculados.</returns>
        /// <exception cref="ArgumentNullException">
        /// Lançada quando <paramref name="command"/> é nulo.
        /// </exception>
        /// <exception cref="ArgumentException">
        /// Lançada quando a venda não possui itens ou algum identificador obrigatório é vazio.
        /// </exception>
        /// <exception cref="ArgumentOutOfRangeException">
        /// Lançada quando a quantidade de um item é menor ou igual a zero,
        /// ou quando o desconto não respeita as regras da venda.
        /// </exception>
        /// <exception cref="KeyNotFoundException">
        /// Lançada quando o cliente informado ou algum produto não existe.
        /// </exception>
        /// <exception cref="InvalidOperationException">
        /// Lançada quando um produto está indisponível ou seu estoque é insuficiente.
        /// </exception>
        public async Task<Venda> RegistrarAsync(RegistrarVendaCommand command)
        {
            ArgumentNullException.ThrowIfNull(command);

            if (command.Itens is null || command.Itens.Count == 0)
            {
                throw new ArgumentException(
                    "A venda deve possuir pelo menos um item.",
                    nameof(command.Itens));
            }

            // O cliente é opcional; se informado, precisa existir.
            if (command.ClienteId is Guid clienteId)
            {
                if (clienteId == Guid.Empty)
                {
                    throw new ArgumentException(
                        "O identificador do cliente não pode ser vazio.",
                        nameof(command.ClienteId));
                }

                var cliente = await _clienteRepository.ObterPorIdAsync(clienteId);

                if (cliente is null)
                {
                    throw new KeyNotFoundException(
                        $"Cliente com ID {clienteId} não encontrado.");
                }
            }

            var venda = new Venda(command.ClienteId);

            foreach (var itemCommand in command.Itens)
            {
                if (itemCommand.ProdutoId == Guid.Empty)
                {
                    throw new ArgumentException(
                        "O identificador do produto não pode ser vazio.");
                }

                if (itemCommand.Quantidade <= 0)
                {
                    throw new ArgumentOutOfRangeException(
                        nameof(itemCommand.Quantidade),
                        "A quantidade deve ser maior que zero.");
                }

                var produto = await _produtoRepository
                    .ObterPorIdAsync(itemCommand.ProdutoId);

                if (produto is null)
                {
                    throw new KeyNotFoundException(
                        $"Produto com ID {itemCommand.ProdutoId} não encontrado.");
                }

                if (!produto.Disponivel)
                {
                    throw new InvalidOperationException(
                        $"O produto '{produto.Nome}' está indisponível para venda.");
                }

                // O nome e o preço são copiados do cadastro atual do produto.
                // Assim, a venda não depende de valores enviados pelo Front-End.
                var itemVenda = new ItemVenda(
                    produtoId: produto.Id,
                    nomeProduto: produto.Nome,
                    quantidade: itemCommand.Quantidade,
                    precoUnitario: produto.Preco);

                venda.AdicionarItem(itemVenda);

                // O estoque só é reduzido quando o produto controla estoque.
                if (produto.ControlaEstoque)
                {
                    var estoqueAtual = produto.QuantidadeEstoque ?? 0m;

                    if (estoqueAtual < itemCommand.Quantidade)
                    {
                        throw new InvalidOperationException(
                            $"Estoque insuficiente para o produto '{produto.Nome}'.");
                    }

                    produto.AjustarEstoque(
                        estoqueAtual - itemCommand.Quantidade);
                }
            }

            // Aplica e valida o desconto depois de adicionar todos os itens.
            venda.AplicarDesconto(command.Desconto);

            // Salva a venda e, no mesmo contexto rastreado, as alterações de estoque.
            await _vendaRepository.AdicionarAsync(venda);

            return venda;
        }
    }
}
