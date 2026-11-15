import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import type { SerieDiariaProduto } from "../types/indicadores";
import { CORES_SERIES } from "../utils/coresGraficos";
import { formatarDiaMes } from "../utils/periodo";
import { estiloTooltip } from "./estiloGraficos";

interface GraficoVendasDiariasProps {
  series: SerieDiariaProduto[];
}

const formatarEixoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
});

/**
 * Gráfico de linhas com o faturamento diário dos produtos mais vendidos.
 * Cada linha é um produto; a cor segue a posição do produto no ranking.
 */
export function GraficoVendasDiarias({ series }: GraficoVendasDiariasProps) {
  // Converte as séries por produto em uma linha por dia, como o Recharts espera:
  // { data: "2026-11-01", "<produtoId>": 12.5, ... }
  const dias = series[0]?.pontos.map((ponto) => ponto.data) ?? [];
  const dados = dias.map((data, indice) => {
    const linha: Record<string, string | number> = { data };

    for (const serie of series) {
      linha[serie.produtoId] = serie.pontos[indice]?.faturamento ?? 0;
    }

    return linha;
  });

  return (
    <div className="indicadores-grafico indicadores-grafico-linhas">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados} margin={{ top: 8, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="data"
            tickFormatter={(valor: string) => formatarDiaMes(valor)}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border-strong)" }}
            tickLine={false}
            minTickGap={16}
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
            labelFormatter={(valor) => formatarDiaMes(String(valor))}
            formatter={(valor, nome) => [formatCurrency(Number(valor)), nome]}
            itemSorter={(item) => -Number(item.value ?? 0)}
          />
          <Legend
            iconType="plainline"
            itemSorter={null}
            wrapperStyle={{ fontSize: "0.8rem" }}
            formatter={(nome) => (
              <span style={{ color: "var(--text-secondary)" }}>{nome}</span>
            )}
          />
          {series.map((serie, indice) => (
            <Line
              key={serie.produtoId}
              type="monotone"
              dataKey={serie.produtoId}
              name={serie.nomeProduto}
              stroke={CORES_SERIES[indice % CORES_SERIES.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "var(--surface)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
