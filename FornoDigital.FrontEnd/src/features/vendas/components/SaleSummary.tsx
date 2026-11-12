import type { Cliente } from "../../clientes/types/cliente";
import { ErrorState } from "../../../shared/components/ErrorState";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

interface SaleSummaryProps {
  clientes: Cliente[];
  clientesLoading: boolean;
  clientesError: string | null;
  clienteId: string;
  onClienteChange: (clienteId: string) => void;
  desconto: string;
  onDescontoChange: (desconto: string) => void;
  quantidadeItens: number;
  subtotalEstimado: number;
  totalEstimado: number;
  registrando: boolean;
  submitDesabilitado: boolean;
  erroFormulario: string | null;
  erroRegistro: string | null;
  onCancel: () => void;
}

const quantityFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 3,
});

export function SaleSummary({
  clientes,
  clientesLoading,
  clientesError,
  clienteId,
  onClienteChange,
  desconto,
  onDescontoChange,
  quantidadeItens,
  subtotalEstimado,
  totalEstimado,
  registrando,
  submitDesabilitado,
  erroFormulario,
  erroRegistro,
  onCancel,
}: SaleSummaryProps) {
  return (
    <aside className="panel sale-summary-panel" aria-labelledby="sale-summary-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Conferência</p>
          <h2 id="sale-summary-title">Resumo da venda</h2>
        </div>
      </div>

      <div className="sale-summary-content">
        <label className="sale-summary-field" htmlFor="sale-client">
          Cliente <span className="sale-form-optional">(opcional)</span>
          <select
            id="sale-client"
            value={clienteId}
            onChange={(event) => onClienteChange(event.target.value)}
            disabled={clientesLoading || clientesError !== null}
          >
            <option value="">Cliente avulso</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </label>

        {clientesLoading && (
          <p className="sale-form-note">Carregando clientes...</p>
        )}

        {clientesError && (
          <p className="sale-form-note" role="status">
            Não foi possível carregar clientes. A venda poderá ser registrada
            como cliente avulso.
          </p>
        )}

        <label className="sale-summary-field" htmlFor="sale-discount">
          Desconto
          <input
            id="sale-discount"
            type="number"
            min="0"
            step="0.01"
            value={desconto}
            onChange={(event) => onDescontoChange(event.target.value)}
          />
        </label>

        <dl className="sale-summary-totals">
          <div>
            <dt>Itens</dt>
            <dd>{quantityFormatter.format(quantidadeItens)}</dd>
          </div>
          <div>
            <dt>Subtotal estimado</dt>
            <dd>{formatCurrency(subtotalEstimado)}</dd>
          </div>
          <div className="sale-summary-total">
            <dt>Total estimado</dt>
            <dd>{formatCurrency(totalEstimado)}</dd>
          </div>
        </dl>

        <p className="sale-summary-note">
          O valor final será confirmado pela API ao registrar a venda.
        </p>

        {erroFormulario && <ErrorState message={erroFormulario} />}

        {erroRegistro && (
          <ErrorState
            message={`Não foi possível registrar a venda: ${erroRegistro}`}
          />
        )}

        <div className="sale-summary-actions">
          <button
            className="sale-secondary-button"
            type="button"
            onClick={onCancel}
            disabled={registrando}
          >
            Cancelar
          </button>

          <button
            className="sale-primary-button"
            type="submit"
            disabled={registrando || submitDesabilitado}
          >
            {registrando ? "Registrando..." : "Registrar venda"}
          </button>
        </div>
      </div>
    </aside>
  );
}