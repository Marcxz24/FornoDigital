import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatFormaPagamento } from "../../../shared/utils/formaPagamento";
import type { VendasPorFormaPagamento } from "../types/indicadores";
import { obterCorFormaPagamento } from "../utils/coresGraficos";
import { estiloTooltip } from "./estiloGraficos";

interface GraficoFormasPagamentoBarrasProps {
  formas: VendasPorFormaPagamento[];
}

const formatarEixoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
});

/**
 * Gráfico de barras com o faturamento por forma de pagamento.
 * Cada forma mantém a mesma cor usada na tela de indicadores,
 * e o valor fica escrito sobre a barra para não depender só da cor.
 */
export function GraficoFormasPagamentoBarras({
  formas,
}: GraficoFormasPagamentoBarrasProps) {
  const dados = formas.map((forma) => ({
    ...forma,
    nome: formatFormaPagamento(forma.formaPagamento),
    cor: obterCorFormaPagamento(forma.formaPagamento),
  }));

  return (
    <div className="indicadores-grafico indicadores-grafico-formas">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 24, right: 24, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="nome"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border-strong)" }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tickFormatter={(valor: number) => formatarEixoMoeda.format(valor)}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            {...estiloTooltip}
            cursor={{ fill: "var(--accent-soft)" }}
            formatter={(valor, _nome, item) => [
              `${formatCurrency(Number(valor))} · ${item.payload.quantidadeVendas} ${
                item.payload.quantidadeVendas === 1 ? "venda" : "vendas"
              }`,
              "Faturamento",
            ]}
          />
          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            maxBarSize={56}
            isAnimationActive={false}
          >
            {dados.map((item) => (
              <Cell key={item.formaPagamento} fill={item.cor} />
            ))}
            <LabelList
              dataKey="total"
              position="top"
              formatter={(valor) => formatarEixoMoeda.format(Number(valor))}
              style={{ fill: "var(--text-secondary)", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
