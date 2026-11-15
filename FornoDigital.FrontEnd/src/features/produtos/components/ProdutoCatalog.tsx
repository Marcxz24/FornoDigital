import type { OrdenacaoProduto, Produto } from "../types/produto";
import type { Ordenacao } from "../../../shared/types/paginacao";
import { CabecalhoOrdenavel } from "../../../shared/components/CabecalhoOrdenavel";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { Paginacao } from "../../../shared/components/Paginacao";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatUnidadeMedida } from "../../../shared/utils/unidadeMedida";

interface ProdutoCatalogProps {
  produtos: Produto[];
  totalRegistros: number;
  pagina: number;
  totalPaginas: number;
  tamanhoPagina: number;
  possuiDados: boolean;
  carregando: boolean;
  erro: string | null;
  buscaOuFiltroAtivo: boolean;
  ordenacao: Ordenacao<OrdenacaoProduto>;
  produtoEmOperacaoId?: string | null;
  onOrdenar: (campo: OrdenacaoProduto) => void;
  onMudarPagina: (pagina: number) => void;
  onRecarregar: () => void;
  onEditar?: (produto: Produto) => void;
  onAlternarDisponibilidade?: (produto: Produto) => void;
}

const formatarQuantidade = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 3,
});

/**
 * Apresenta o estoque de um produto com os mesmos rótulos usados no catálogo.
 */
function renderizarEstoque(produto: Produto) {
  if (!produto.controlaEstoque) {
    return (
      <span className="product-stock-uncontrolled">Não controlado</span>
    );
  }

  const estoque = produto.quantidadeEstoque ?? 0;

  return estoque > 0 ? (
    <span className="product-stock-badge product-stock-in">
      {formatarQuantidade.format(estoque)}
    </span>
  ) : (
    <span className="product-stock-badge product-stock-empty">Sem estoque</span>
  );
}

/**
 * Apresenta a página do catálogo recebida da API em formato de grid.
 * Busca, filtros, ordenação e paginação são controlados pela página;
 * os códigos de barras são gerenciados no formulário de edição.
 */
export function ProdutoCatalog({
  produtos,
  totalRegistros,
  pagina,
  totalPaginas,
  tamanhoPagina,
  possuiDados,
  carregando,
  erro,
  buscaOuFiltroAtivo,
  ordenacao,
  produtoEmOperacaoId,
  onOrdenar,
  onMudarPagina,
  onRecarregar,
  onEditar,
  onAlternarDisponibilidade,
}: ProdutoCatalogProps) {
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

  if (!possuiDados) {
    return <LoadingState message="Carregando produtos..." />;
  }

  if (totalRegistros === 0 && !carregando) {
    return buscaOuFiltroAtivo ? (
      <EmptyState message="Nenhum produto corresponde à busca ou ao filtro selecionado." />
    ) : (
      <EmptyState message="Nenhum produto cadastrado. Cadastre um produto para começar o catálogo." />
    );
  }

  return (
    <>
      <div className="data-grid-wrapper" aria-busy={carregando}>
        <table className="data-grid">
          <caption className="sr-only">
            Catálogo de produtos, página {pagina} de {totalPaginas}
          </caption>
          <thead>
            <tr>
              <CabecalhoOrdenavel
                campo="nome"
                rotulo="Produto"
                ordenacao={ordenacao}
                onOrdenar={onOrdenar}
              />
              <th scope="col">Código de barras</th>
              <th scope="col">Unidade</th>
              <CabecalhoOrdenavel
                campo="preco"
                rotulo="Preço"
                ordenacao={ordenacao}
                onOrdenar={onOrdenar}
                alinhamento="fim"
              />
              <th scope="col">Estoque</th>
              <th scope="col">Disponibilidade</th>
              {(onEditar || onAlternarDisponibilidade) && (
                <th scope="col" className="data-grid-actions-column">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => {
              const [codigoPrincipal, ...outrosCodigos] = produto.codigosBarras;

              return (
                <tr key={produto.id}>
                  <td>
                    <span className="data-grid-cell-primary">{produto.nome}</span>
                    {produto.descricao?.trim() && (
                      <span
                        className="data-grid-cell-secondary"
                        title={produto.descricao}
                      >
                        {produto.descricao}
                      </span>
                    )}
                  </td>
                  <td className="data-grid-cell-nowrap">
                    {codigoPrincipal ? (
                      <span title={produto.codigosBarras.join("\n")}>
                        <code className="product-grid-barcode">{codigoPrincipal}</code>
                        {outrosCodigos.length > 0 && (
                          <span className="product-grid-barcode-more">
                            +{outrosCodigos.length}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="data-grid-cell-muted">Sem código</span>
                    )}
                  </td>
                  <td className="data-grid-cell-nowrap">
                    {formatUnidadeMedida(produto.unidadeMedida)}
                  </td>
                  <td className="data-grid-cell-end data-grid-cell-number data-grid-cell-primary">
                    {formatCurrency(produto.preco)}
                  </td>
                  <td>{renderizarEstoque(produto)}</td>
                  <td>
                    <span
                      className={`product-availability-badge ${
                        produto.disponivel
                          ? "product-availability-available"
                          : "product-availability-unavailable"
                      }`}
                    >
                      {produto.disponivel ? "Disponível" : "Indisponível"}
                    </span>
                  </td>
                  {(onEditar || onAlternarDisponibilidade) && (
                    <td className="data-grid-actions-column">
                      <div className="data-grid-actions">
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
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Paginacao
        pagina={pagina}
        totalPaginas={totalPaginas}
        totalRegistros={totalRegistros}
        tamanhoPagina={tamanhoPagina}
        desabilitada={carregando}
        onMudarPagina={onMudarPagina}
      />
    </>
  );
}