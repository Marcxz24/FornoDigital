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
  onEditar?: (produto: Produto) => void;
  onAlternarDisponibilidade?: (produto: Produto) => void;
  onRemoverCodigoBarras?: (
    produto: Produto,
    codigoBarras: string,
  ) => void;
  produtoEmOperacaoId?: string | null;
  codigoBarrasEmRemocao?: string | null;
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
  onEditar,
  onAlternarDisponibilidade,
  onRemoverCodigoBarras,
  produtoEmOperacaoId,
  codigoBarrasEmRemocao,
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
                  {produto.nome.trim().charAt(0).toLocaleUpperCase("pt-BR") ||
                    "P"}
                </span>

                <div className="product-catalog-name">
                  <h3>{produto.nome}</h3>
                  <p>{produto.descricao?.trim() || "Sem descrição informada"}</p>
                </div>

                {(onEditar || onAlternarDisponibilidade) && (
                  <div className="product-card-actions">
                    {onEditar && (
                      <button
                        className="product-card-action product-card-action-icon"
                        type="button"
                        onClick={() => onEditar(produto)}
                        aria-label={`Editar ${produto.nome}`}
                        title="Editar produto"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m14 5 5 5M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
                        </svg>
                      </button>
                    )}

                    {onAlternarDisponibilidade && (
                      <button
                        className={`product-card-action product-card-action-icon ${
                          produto.disponivel
                            ? "product-card-action-danger"
                            : ""
                        }`}
                        type="button"
                        onClick={() => onAlternarDisponibilidade(produto)}
                        disabled={produtoEmOperacaoId === produto.id}
                        aria-label={
                          produto.disponivel
                            ? `Inativar ${produto.nome}`
                            : `Ativar ${produto.nome}`
                        }
                        title={
                          produtoEmOperacaoId === produto.id
                            ? "Atualizando disponibilidade"
                            : produto.disponivel
                              ? "Inativar produto"
                              : "Ativar produto"
                        }
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 5h18v4H3z" />
                          <path d="M5 9v10h14V9" />
                          <path d="M10 13h4" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
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

            <section
              className="product-catalog-barcodes"
              aria-label={`Códigos de barras de ${produto.nome}`}
            >
              <h4>Códigos de barras</h4>

              {produto.codigosBarras.length === 0 ? (
                <p className="product-catalog-no-barcodes">
                  Nenhum código cadastrado.
                </p>
              ) : (
                <ul>
                  {produto.codigosBarras.map((codigoBarras) => (
                    <li key={`${produto.id}-${codigoBarras}`}>
                      <code>{codigoBarras}</code>

                      {onRemoverCodigoBarras && (
                        <button
                          className="product-card-action product-card-action-icon product-card-action-danger"
                          type="button"
                          onClick={() =>
                            onRemoverCodigoBarras(produto, codigoBarras)
                          }
                          disabled={
                            codigoBarrasEmRemocao === codigoBarras
                          }
                          aria-label={`Remover o código ${codigoBarras} de ${produto.nome}`}
                          title={
                            codigoBarrasEmRemocao === codigoBarras
                              ? "Removendo código"
                              : "Remover código de barras"
                          }
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
                          </svg>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </article>
        );
      })}
    </div>
  );
}