import type { Produto } from "../../produtos/types/produto";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatUnidadeMedida } from "../../../shared/utils/unidadeMedida";

/**
 * Define as propriedades (props) aceitas pelo componente <see cref="ProductList"/>.
 */
interface ProductListProps {
  /** A lista de produtos a ser renderizada. */
  produtos: Produto[];
  /** Indica se os dados dos produtos ainda estão carregando. */
  loading: boolean;
  /** Mensagem de erro caso ocorra uma falha ao carregar os produtos. */
  error: string | null;
}

/**
 * Função utilitária para determinar e descrever o status de estoque atual de um produto 
 * com base em sua disponibilidade, controle de estoque e quantidade remanescente.
 * 
 * @vinculado ProductList
 */
function getStockStatus(produto: Produto): string {
  if (!produto.disponivel) {
    return "Indisponível";
  }

  if (!produto.controlaEstoque) {
    return "Disponível · estoque não controlado";
  }

  if (produto.quantidadeEstoque === null) {
    return "Quantidade em estoque não informada";
  }

  if (produto.quantidadeEstoque > 0) {
    const quantidade = produto.quantidadeEstoque.toLocaleString("pt-BR");
    const unidade = formatUnidadeMedida(produto.unidadeMedida);

    return `${quantidade} ${unidade} · Em estoque`;
  }

  return "Sem estoque";
}

/**
 * Função utilitária para determinar a classe CSS correspondente ao status de estoque do produto, 
 * permitindo aplicar estilizações visuais diferenciadas (indisponível, sem estoque ou disponível).
 * 
 * @vinculado ProductList
 */
function getStockStatusClass(produto: Produto): string {
  if (!produto.disponivel) {
    return "status-unavailable";
  }

  if (produto.controlaEstoque && produto.quantidadeEstoque === 0) {
    return "status-out-of-stock";
  }

  return "status-available";
}

/**
 * Componente de listagem de produtos (<see cref="ProductList"/>) responsável por gerenciar a exibição 
 * dos estados de carregamento, erro, vazio ou a listagem detalhada dos registros de produtos cadastrados na vitrine.
 */
export function ProductList({ produtos, loading, error }: ProductListProps) {
  return (
    <section className="panel" aria-labelledby="products-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Vitrine</p>
          <h2 id="products-title">Produtos</h2>
        </div>
        {!loading && !error && (
          <span className="section-count">
            {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
          </span>
        )}
      </div>

      {loading ? (
        <LoadingState message="Carregando produtos..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : produtos.length === 0 ? (
        <EmptyState message="Nenhum produto cadastrado." />
      ) : (
        <ul className="record-list">
          {produtos.map((produto) => (
            <li className="record-card product-card" key={produto.id}>
              <div className="product-card-heading">
                <div className="product-mark" aria-hidden="true">
                  ✳
                </div>
                <div className="record-title">
                  <h3>{produto.nome}</h3>
                  <p>
                    {produto.descricao?.trim() || "Sem descrição informada"}
                  </p>
                </div>
              </div>

              <div className="product-card-footer">
                <div>
                  <p className="product-price">{formatCurrency(produto.preco)}</p>
                  <p className="product-unit">
                    por {formatUnidadeMedida(produto.unidadeMedida)}
                  </p>
                </div>
                <span className={`stock-status ${getStockStatusClass(produto)}`}>
                  {getStockStatus(produto)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}