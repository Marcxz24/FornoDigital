import type { Produto } from "../types/produto";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatDate } from "../../../shared/utils/formatDate";
import { formatUnidadeMedida } from "../../../shared/utils/unidadeMedida";

interface ProdutoCatalogProps {
  produtos: Produto[];
  totalProdutos: number;
  carregando: boolean;
  erro: string | null;
  onRecarregar: () => void;
}

const formatarQuantidade = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 3,
});

/**
 * Apresenta os estados do catálogo e os cartões dos produtos recebidos.
 * A busca e os filtros são feitos pela página; este componente só renderiza os resultados.
 */
export function ProdutoCatalog({
  produtos,
  totalProdutos,
  carregando,
  erro,
  onRecarregar,
}: ProdutoCatalogProps) {
  if (carregando) {
    return <LoadingState message="Carregando produtos..." />;
  }

  if (erro) {
    return (
      <div className="product-catalog-error">
        <ErrorState message={erro} />
        <button
          className="sale-secondary-button"
          type="button"
          onClick={onRecarregar}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (totalProdutos === 0) {
    return (
      <EmptyState message="Nenhum produto cadastrado. Cadastre um produto para começar o catálogo." />
    );
  }

  if (produtos.length === 0) {
    return (
      <EmptyState message="Nenhum produto corresponde à busca ou ao filtro selecionado." />
    );
  }

  return (
    <div className="product-catalog-grid">
      {produtos.map((produto) => {
        const estoque = produto.quantidadeEstoque ?? 0;
        const temEstoqueControlado = produto.controlaEstoque && estoque > 0;

        return (
          <article className="product-catalog-card" key={produto.id}>
            <header className="product-catalog-card-header">
              <div className="product-catalog-identity">
                <span className="product-catalog-mark" aria-hidden="true">
                  {produto.nome.trim().charAt(0).toLocaleUpperCase("pt-BR") || "P"}
                </span>

                <div className="product-catalog-name">
                  <h3>{produto.nome}</h3>
                  <p>{produto.descricao?.trim() || "Sem descrição informada"}</p>
                </div>
              </div>

              <span
                className={`product-availability-badge ${
                  produto.disponivel
                    ? "product-availability-available"
                    : "product-availability-unavailable"
                }`}
              >
                {produto.disponivel ? "Disponível" : "Indisponível"}
              </span>
            </header>

            <dl className="product-catalog-details">
              <div>
                <dt>Preço</dt>
                <dd className="product-catalog-price">
                  {formatCurrency(produto.preco)}
                </dd>
              </div>

              <div>
                <dt>Unidade</dt>
                <dd>{formatUnidadeMedida(produto.unidadeMedida)}</dd>
              </div>

              <div>
                <dt>Estoque</dt>
                <dd>
                  {produto.controlaEstoque ? (
                    <span
                      className={`product-stock-badge ${
                        temEstoqueControlado
                          ? "product-stock-in"
                          : "product-stock-empty"
                      }`}
                    >
                      {temEstoqueControlado
                        ? `${formatarQuantidade.format(estoque)} em estoque`
                        : "Sem estoque"}
                    </span>
                  ) : (
                    <span className="product-stock-uncontrolled">
                      Estoque não controlado
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt>Cadastro</dt>
                <dd>{formatDate(produto.dataCriacao)}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}