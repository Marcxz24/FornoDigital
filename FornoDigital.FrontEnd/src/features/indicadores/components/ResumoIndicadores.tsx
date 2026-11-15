import { formatCurrency } from "../../../shared/utils/formatCurrency";
import type { ProdutoMaisVendido, ResumoVendas } from "../types/indicadores";

interface ResumoIndicadoresProps {
  resumo: ResumoVendas;
  produtoMaisVendido: ProdutoMaisVendido | null;
}

const formatarNumero = new Intl.NumberFormat("pt-BR");

/**
 * Apresenta os números principais do período em cartões,
 * reaproveitando o estilo dos cartões da Visão geral.
 */
export function ResumoIndicadores({
  resumo,
  produtoMaisVendido,
}: ResumoIndicadoresProps) {
  const cartoes = [
    {
      chave: "vendas",
      rotulo: "Vendas no período",
      valor: formatarNumero.format(resumo.quantidadeVendas),
    },
    {
      chave: "faturamento",
      rotulo: "Faturamento",
      valor: formatCurrency(resumo.faturamento),
    },
    {
      chave: "ticket",
      rotulo: "Ticket médio",
      valor: formatCurrency(resumo.ticketMedio),
    },
    {
      chave: "mais-vendido",
      rotulo: "Produto mais vendido",
      valor: produtoMaisVendido?.nomeProduto ?? "—",
    },
  ];

  return (
    <section className="summary-grid" aria-label="Resumo do período">
      {cartoes.map((cartao) => (
        <article className="summary-card" key={cartao.chave}>
          <div>
            <p className="summary-card-label">{cartao.rotulo}</p>
            <p
              className="summary-card-value indicadores-cartao-valor"
              title={cartao.valor}
            >
              {cartao.valor}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
