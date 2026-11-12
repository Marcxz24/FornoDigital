import { useState } from "react";
import { SaleDetails } from "../components/SaleDetails";
import { SalesList } from "../components/SalesList";
import { NewSaleForm } from "../components/NewSaleForm";
import { useVendasData } from "../hooks/useVendasData";
import type { Venda } from "../types/venda";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { notificar } from "../../../shared/utils/notificacoes";

type VendasMode = "registrar-venda" | "visualizar-vendas";
type VendasTheme = "light" | "dark";

interface VendasPageProps {
  theme: VendasTheme;
  onToggleTheme: () => void;
  modo?: VendasMode;
  onNavigate?: (pagina: VendasMode) => void;
}

export function VendasPage({
  theme,
  onToggleTheme,
  modo = "visualizar-vendas",
  onNavigate,
}: VendasPageProps) {
  const {
    vendas,
    clientes,
    produtos,
    registrando,
    erroRegistro,
    registrarNovaVenda,
  } = useVendasData();

  const [vendaSelecionadaId, setVendaSelecionadaId] = useState<string | null>(
    null,
  );

  const vendaSelecionada =
    vendas.data.find((venda) => venda.id === vendaSelecionadaId) ?? null;

  /**
 * Seleciona a venda registrada e exibe temporariamente o total confirmado pela API.
 */
  function handleSuccess(venda: Venda) {
    setVendaSelecionadaId(venda.id);
    void notificar(
      "success",
      `Venda registrada com sucesso. Total confirmado: ${formatCurrency(venda.total)}.`,
    );
  }

  const estaRegistrando = modo === "registrar-venda";

  return (
    <main className="dashboard sales-page">
      <header className="dashboard-header">
        <div className="brand-mark" aria-hidden="true">
          <span>F</span>
        </div>

        <div className="dashboard-heading">
          <p className="eyebrow">FornoDigital</p>
          <h1>{estaRegistrando ? "Registrar Venda" : "Visualizar Vendas"}</h1>
          <p className="dashboard-subtitle">
            {estaRegistrando
              ? "Adicione os produtos e confirme a venda."
              : "Consulte as vendas registradas e seus itens."}
          </p>
        </div>

        <div className="sales-header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Mudar para o tema ${theme === "light" ? "escuro" : "claro"}`}
            aria-pressed={theme === "dark"}
          >
            <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            <span>{theme === "light" ? "Tema escuro" : "Tema claro"}</span>
          </button>
        </div>
      </header>

      {estaRegistrando ? (
        <NewSaleForm
          clientes={clientes.data}
          clientesLoading={clientes.loading}
          clientesError={clientes.error}
          produtos={produtos.data}
          produtosLoading={produtos.loading}
          produtosError={produtos.error}
          registrando={registrando}
          erroRegistro={erroRegistro}
          onRegistrar={registrarNovaVenda}
          onSuccess={handleSuccess}
          onCancel={() => onNavigate?.("visualizar-vendas")}
        />
      ) : (
        <div className="dashboard-sections sales-sections">
          <SalesList
            vendas={vendas.data}
            clientes={clientes.data}
            loading={vendas.loading}
            error={vendas.error}
            vendaSelecionadaId={vendaSelecionadaId}
            onSelectVenda={(venda) => setVendaSelecionadaId(venda.id)}
          />

          <SaleDetails venda={vendaSelecionada} />
        </div>
      )}
    </main>
  );
}