import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { FiltroPeriodo } from "../components/FiltroPeriodo";
import { GraficoFormasPagamento } from "../components/GraficoFormasPagamento";
import { GraficoVendasDiarias } from "../components/GraficoVendasDiarias";
import { RankingProdutos } from "../components/RankingProdutos";
import { ResumoIndicadores } from "../components/ResumoIndicadores";
import { LIMITE_PRODUTOS, useIndicadoresVendas } from "../hooks/useIndicadoresVendas";

type TemaIndicadores = "light" | "dark";

interface IndicadoresPageProps {
  theme: TemaIndicadores;
  onToggleTheme: () => void;
}

/**
 * Tela de análise de vendas: resumo do período, produtos mais vendidos,
 * faturamento por forma de pagamento e faturamento diário por produto.
 */
export function IndicadoresPage({ theme, onToggleTheme }: IndicadoresPageProps) {
  const { periodo, dados, carregando, erro, aplicarPeriodo, recarregar } =
    useIndicadoresVendas();

  /**
   * Escolhe o conteúdo conforme o estado da consulta.
   * Em novas consultas, os gráficos anteriores continuam visíveis e esmaecidos.
   */
  function renderizarConteudo() {
    if (erro) {
      return (
        <div>
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
      return <LoadingState message="Carregando indicadores..." />;
    }

    if (dados.resumo.quantidadeVendas === 0) {
      return <EmptyState message="Nenhuma venda registrada no período selecionado." />;
    }

    return (
      <div className="indicadores-conteudo" aria-busy={carregando}>
        <ResumoIndicadores
          resumo={dados.resumo}
          produtoMaisVendido={dados.produtosMaisVendidos[0] ?? null}
        />

        <div className="indicadores-linha">
          <section className="panel" aria-labelledby="indicadores-ranking-titulo">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Ranking</p>
                <h2 id="indicadores-ranking-titulo">
                  {LIMITE_PRODUTOS} produtos mais vendidos (faturamento)
                </h2>
              </div>
            </div>
            <RankingProdutos produtos={dados.produtosMaisVendidos} />
          </section>

          <section className="panel" aria-labelledby="indicadores-pagamento-titulo">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Pagamentos</p>
                <h2 id="indicadores-pagamento-titulo">
                  Faturamento por forma de pagamento
                </h2>
              </div>
            </div>
            <GraficoFormasPagamento formas={dados.vendasPorFormaPagamento} />
          </section>
        </div>

        <section className="panel" aria-labelledby="indicadores-diario-titulo">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Evolução</p>
              <h2 id="indicadores-diario-titulo">
                Faturamento diário dos produtos mais vendidos
              </h2>
            </div>
          </div>
          <GraficoVendasDiarias series={dados.vendasDiariasPorProduto} />
        </section>
      </div>
    );
  }

  return (
    <main className="dashboard indicadores-page">
      <header className="dashboard-header">
        <div className="brand-mark" aria-hidden="true">
          <img
            className="brand-mark-image"
            src="/branding/forno-digital-icon.png"
            alt=""
          />
        </div>

        <div className="dashboard-heading">
          <p className="eyebrow">FornoDigital</p>
          <h1>Indicadores</h1>
          <p className="dashboard-subtitle">
            Analise as vendas por produto, forma de pagamento e dia.
          </p>
        </div>

        <button
          className="theme-toggle"
          style={{ marginLeft: "auto" }}
          type="button"
          onClick={onToggleTheme}
          aria-label={`Mudar para o tema ${theme === "light" ? "escuro" : "claro"}`}
          aria-pressed={theme === "dark"}
        >
          <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
          <span>{theme === "light" ? "Tema escuro" : "Tema claro"}</span>
        </button>
      </header>

      <FiltroPeriodo
        periodo={periodo}
        desabilitado={carregando}
        onAplicar={aplicarPeriodo}
      />

      {renderizarConteudo()}
    </main>
  );
}
