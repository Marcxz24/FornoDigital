import type { Cliente } from "../../clientes/types/cliente";
import type { Venda } from "../types/venda";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatDate } from "../../../shared/utils/formatDate";

interface SalesListProps {
  vendas: Venda[];
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  vendaSelecionadaId: string | null;
  onSelectVenda: (venda: Venda) => void;
}

function obterNomeCliente(
  clienteId: string | null,
  clientes: Cliente[],
): string {
  if (clienteId === null) {
    return "Cliente avulso";
  }

  return (
    clientes.find((cliente) => cliente.id === clienteId)?.nome ??
    "Cliente avulso"
  );
}

function contarItens(venda: Venda): number {
  return venda.itens.reduce((total, item) => total + item.quantidade, 0);
}

export function SalesList({
  vendas,
  clientes,
  loading,
  error,
  vendaSelecionadaId,
  onSelectVenda,
}: SalesListProps) {
  return (
    <section className="panel sales-panel" aria-labelledby="sales-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Movimentações</p>
          <h2 id="sales-title">Vendas</h2>
        </div>
        <span className="section-count">
          {vendas.length} {vendas.length === 1 ? "venda" : "vendas"}
        </span>
      </div>

      {loading ? (
        <LoadingState message="Carregando vendas..." />
      ) : error ? (
        <ErrorState message={`Não foi possível carregar as vendas: ${error}`} />
      ) : vendas.length === 0 ? (
        <EmptyState message="Ainda não há vendas registradas." />
      ) : (
        <ul className="record-list sales-list">
          {vendas.map((venda) => {
            const selecionada = venda.id === vendaSelecionadaId;

            return (
              <li className="record-card sale-card" key={venda.id}>
                <div className="sale-card-heading">
                  <div>
                    <h3 className="sale-client-name">
                      {obterNomeCliente(venda.clienteId, clientes)}
                    </h3>
                    <p className="sale-date">{formatDate(venda.dataCriacao)}</p>
                  </div>

                  <button
                    className="sale-details-button"
                    type="button"
                    onClick={() => onSelectVenda(venda)}
                    aria-expanded={selecionada}
                    aria-label={`Ver itens da venda de ${obterNomeCliente(
                      venda.clienteId,
                      clientes,
                    )}`}
                  >
                    {selecionada ? "Itens abertos" : "Ver itens"}
                  </button>
                </div>

                <dl className="sale-summary">
                  <div>
                    <dt>Itens</dt>
                    <dd>{contarItens(venda)}</dd>
                  </div>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatCurrency(venda.subtotal)}</dd>
                  </div>
                  <div>
                    <dt>Desconto</dt>
                    <dd>{formatCurrency(venda.desconto)}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{formatCurrency(venda.total)}</dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}