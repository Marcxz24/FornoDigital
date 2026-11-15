import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatFormaPagamento } from "../../../shared/utils/formaPagamento";
import type { VendasPorFormaPagamento } from "../types/indicadores";
import { obterCorFormaPagamento } from "../utils/coresGraficos";
import { estiloTooltip } from "./estiloGraficos";

interface GraficoFormasPagamentoProps {
  formas: VendasPorFormaPagamento[];
}

const formatarPercentual = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

/**
 * Gráfico de pizza com o faturamento por forma de pagamento.
 * A legenda ao lado mostra valor, percentual e quantidade de vendas,
 * para que a leitura não dependa apenas das cores.
 */
export function GraficoFormasPagamento({ formas }: GraficoFormasPagamentoProps) {
  const totalGeral = formas.reduce((soma, forma) => soma + forma.total, 0);
  const dados = formas.map((forma) => ({
    ...forma,
    nome: formatFormaPagamento(forma.formaPagamento),
    cor: obterCorFormaPagamento(forma.formaPagamento),
    percentual: totalGeral > 0 ? forma.total / totalGeral : 0,
  }));

  return (
    <div className="indicadores-pizza">
      <div className="indicadores-grafico indicadores-grafico-pizza">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              dataKey="total"
              nameKey="nome"
              outerRadius="90%"
              stroke="var(--surface)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {dados.map((item) => (
                <Cell key={item.formaPagamento} fill={item.cor} />
              ))}
            </Pie>
            <Tooltip
              {...estiloTooltip}
              formatter={(valor, nome) => [formatCurrency(Number(valor)), nome]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="indicadores-legenda" aria-label="Faturamento por forma de pagamento">
        {dados.map((item) => (
          <li key={item.formaPagamento}>
            <span
              className="indicadores-legenda-cor"
              style={{ background: item.cor }}
              aria-hidden="true"
            />
            <span className="indicadores-legenda-nome">{item.nome}</span>
            <span className="indicadores-legenda-valor">
              {formatCurrency(item.total)}
              <small>
                {formatarPercentual.format(item.percentual)} ·{" "}
                {item.quantidadeVendas}{" "}
                {item.quantidadeVendas === 1 ? "venda" : "vendas"}
              </small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
