import { EmptyState } from "../../../shared/components/EmptyState";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import type { Produto } from "../../produtos/types/produto";

export interface ItemCarrinho {
  produto: Produto;
  quantidade: string;
}

interface SaleCartProps {
  itens: ItemCarrinho[];
  onAlterarQuantidade: (produtoId: string, quantidade: string) => void;
  onRemoverProduto: (produtoId: string) => void;
}

export function SaleCart({
  itens,
  onAlterarQuantidade,
  onRemoverProduto,
}: SaleCartProps) {
  function handleQuantityChange(produto: Produto, quantidade: string) {
    const quantidadeNumerica = Number(quantidade);
    const estoque = produto.quantidadeEstoque;

    if (
      quantidade !== "" &&
      produto.controlaEstoque &&
      estoque !== null &&
      Number.isFinite(quantidadeNumerica) &&
      quantidadeNumerica > estoque
    ) {
      onAlterarQuantidade(produto.id, String(estoque));
      return;
    }

    onAlterarQuantidade(produto.id, quantidade);
  }

  return (
    <section className="sale-cart" aria-labelledby="sale-cart-title">
      <div className="sale-cart-heading">
        <div>
          <p className="eyebrow">Itens selecionados</p>
          <h2 id="sale-cart-title">Carrinho</h2>
        </div>
        <span className="section-count">
          {itens.length} {itens.length === 1 ? "produto" : "produtos"}
        </span>
      </div>

      {itens.length === 0 ? (
        <EmptyState message="Busque um produto pelo nome para começar a venda." />
      ) : (
        <div className="sale-cart-table-wrapper">
          <table className="sale-cart-table">
            <thead>
              <tr>
                <th scope="col">Produto</th>
                <th scope="col">Preço unitário</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Subtotal estimado</th>
                <th scope="col">
                  <span className="visually-hidden">Ações</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {itens.map(({ produto, quantidade }) => {
                const quantidadeNumerica = Number(quantidade);
                const subtotal =
                  Number.isFinite(quantidadeNumerica) && quantidadeNumerica > 0
                    ? produto.preco * quantidadeNumerica
                    : 0;

                return (
                  <tr key={produto.id}>
                    <th scope="row">
                      <span className="sale-cart-product-name">
                        {produto.nome}
                      </span>
                      <span className="sale-cart-product-stock">
                        {produto.controlaEstoque
                          ? `Estoque: ${produto.quantidadeEstoque ?? 0}`
                          : "Estoque não controlado"}
                      </span>
                    </th>

                    <td>{formatCurrency(produto.preco)}</td>

                    <td>
                      <input
                        className="sale-cart-quantity"
                        type="number"
                        min="0.01"
                        step="any"
                        max={
                          produto.controlaEstoque
                            ? produto.quantidadeEstoque ?? undefined
                            : undefined
                        }
                        value={quantidade}
                        onChange={(event) =>
                          handleQuantityChange(produto, event.target.value)
                        }
                        aria-label={`Quantidade de ${produto.nome}`}
                      />
                    </td>

                    <td>{formatCurrency(subtotal)}</td>

                    <td>
                      <button
                        className="sale-cart-remove"
                        type="button"
                        onClick={() => onRemoverProduto(produto.id)}
                        aria-label={`Remover ${produto.nome} do carrinho`}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}