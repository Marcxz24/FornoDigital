import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { LIMITE_PRODUTOS, useIndicadoresVendas } from "../hooks/useIndicadoresVendas";
import { GraficoFormasPagamentoBarras } from "./GraficoFormasPagamentoBarras";
import { RankingProdutos } from "./RankingProdutos";

/**
 * Bloco de gráficos exibido na Visão geral: produtos mais vendidos e
 * faturamento por forma de pagamento, ambos em barras e nos últimos 30 dias.
 * Reaproveita o hook e os componentes da tela de indicadores.
 */
export function IndicadoresDashboard() {
  const { dados, erro, recarregar } = useIndicadoresVendas();

  if (erro) {
    return (
      <div className="indicadores-dashboard">
        <ErrorState message={erro} />
        <button
          className="sale-secondary-button"
          type="button"
          onClick={recarregar}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!dados) {
    return <LoadingState message="Carregando gráficos de vendas..." />;
  }

  if (dados.resumo.quantidadeVendas === 0) {
    return (
      <div className="indicadores-dashboard">
        <EmptyState message="Nenhuma venda registrada nos últimos 30 dias." />
      </div>
    );
  }

  return (
    <div className="indicadores-dashboard indicadores-linha">
      <section className="panel" aria-labelledby="dashboard-ranking-titulo">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Últimos 30 dias</p>
            <h2 id="dashboard-ranking-titulo">
              {LIMITE_PRODUTOS} produtos mais vendidos (faturamento)
            </h2>
          </div>
        </div>
        <RankingProdutos produtos={dados.produtosMaisVendidos} exibirTabela={false} />
      </section>

      <section className="panel" aria-labelledby="dashboard-pagamento-titulo">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Últimos 30 dias</p>
            <h2 id="dashboard-pagamento-titulo">
              Faturamento por forma de pagamento
            </h2>
          </div>
        </div>
        <GraficoFormasPagamentoBarras formas={dados.vendasPorFormaPagamento} />
      </section>
    </div>
  );
}
