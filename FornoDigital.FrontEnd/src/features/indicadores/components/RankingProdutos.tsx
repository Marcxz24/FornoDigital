import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatUnidadeMedida } from "../../../shared/utils/unidadeMedida";
import type { ProdutoMaisVendido } from "../types/indicadores";
import { CORES_SERIES } from "../utils/coresGraficos";
import { estiloTooltip } from "./estiloGraficos";

interface RankingProdutosProps {
  produtos: ProdutoMaisVendido[];
  /** Quando falso, exibe somente o gráfico de barras (usado no dashboard). */
  exibirTabela?: boolean;
}

const formatarQuantidade = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 3,
});

const formatarEixoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
});

/**
 * Ranking dos produtos mais vendidos por faturamento: barras horizontais
 * e, abaixo, a tabela com faturamento, quantidade e número de vendas.
 */
export function RankingProdutos({
  produtos,
  exibirTabela = true,
}: RankingProdutosProps) {
  return (
    <>
      <div
        className="indicadores-grafico"
        style={{ height: Math.max(160, produtos.length * 48 + 40) }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={produtos}
            layout="vertical"
            margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
          >
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis
              type="number"
              tickFormatter={(valor: number) => formatarEixoMoeda.format(valor)}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="nomeProduto"
              width={140}
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              {...estiloTooltip}
              cursor={{ fill: "var(--accent-soft)" }}
              formatter={(valor) => [formatCurrency(Number(valor)), "Faturamento"]}
            />
            <Bar
              dataKey="faturamento"
              fill={CORES_SERIES[0]}
              radius={[0, 4, 4, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {exibirTabela && (
        <div className="data-grid-wrapper">
          <table className="data-grid indicadores-tabela">
            <caption className="sr-only">Produtos mais vendidos por faturamento</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Produto</th>
                <th scope="col" className="data-grid-cell-end">Faturamento</th>
                <th scope="col" className="data-grid-cell-end">Quantidade</th>
                <th scope="col">Unidade</th>
                <th scope="col" className="data-grid-cell-end">Vendas</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto, indice) => (
                <tr key={produto.produtoId}>
                  <td className="data-grid-cell-muted">{indice + 1}</td>
                  <td className="data-grid-cell-primary">{produto.nomeProduto}</td>
                  <td className="data-grid-cell-end data-grid-cell-number">
                    {formatCurrency(produto.faturamento)}
                  </td>
                  <td className="data-grid-cell-end data-grid-cell-number">
                    {formatarQuantidade.format(produto.quantidade)}
                  </td>
                  <td className="data-grid-cell-muted">
                    {produto.unidadeMedida !== null
                      ? formatUnidadeMedida(produto.unidadeMedida)
                      : "—"}
                  </td>
                  <td className="data-grid-cell-end data-grid-cell-number">
                    {produto.quantidadeVendas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
