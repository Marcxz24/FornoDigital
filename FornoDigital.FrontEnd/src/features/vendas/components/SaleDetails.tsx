import { EmptyState } from "../../../shared/components/EmptyState";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import type { Venda } from "../types/venda";

interface SaleDetailsProps {
  venda: Venda | null;
}

export function SaleDetails({ venda }: SaleDetailsProps) {
  return (
    <section
      className="panel sale-details-panel"
      aria-labelledby="sale-details-title"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Composição</p>
          <h2 id="sale-details-title">Itens da venda</h2>
        </div>
      </div>

      {venda === null ? (
        <EmptyState message="Selecione uma venda para consultar os itens." />
      ) : (
        <>
          <div className="sale-items-table-wrapper">
            <table className="sale-items-table">
              <thead>
                <tr>
                  <th scope="col">Produto</th>
                  <th scope="col">Quantidade</th>
                  <th scope="col">Preço unitário</th>
                  <th scope="col">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venda.itens.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">{item.nomeProduto}</th>
                    <td>{item.quantidade}</td>
                    <td>{formatCurrency(item.precoUnitario)}</td>
                    <td>{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="sale-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(venda.subtotal)}</dd>
            </div>
            <div>
              <dt>Desconto</dt>
              <dd>{formatCurrency(venda.desconto)}</dd>
            </div>
            <div className="sale-total">
              <dt>Total</dt>
              <dd>{formatCurrency(venda.total)}</dd>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}