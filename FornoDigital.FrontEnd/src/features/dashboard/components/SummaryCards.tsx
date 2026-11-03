/**
 * Define as propriedades (props) aceitas pelo componente <see cref="SummaryCards"/>, 
 * representando os indicadores estatísticos exibidos no painel.
 */
interface SummaryCardsProps {
  /** Quantidade total de clientes cadastrados (ou nulo se ainda estiver carregando). */
  totalClientes: number | null;
  /** Quantidade total de produtos cadastrados (ou nulo se ainda estiver carregando). */
  totalProdutos: number | null;
  /** Quantidade de produtos disponíveis para venda (ou nulo se ainda estiver carregando). */
  produtosDisponiveis: number | null;
  /** Quantidade de produtos indisponíveis para venda (ou nulo se ainda estiver carregando). */
  produtosIndisponiveis: number | null;
}

/**
 * Relação estática de configuração contendo os metadados visuais e mapeamentos 
 * para a renderização dinâmica dos cartões de resumo estatístico.
 */
const cards = [
  { key: "clientes", label: "Clientes", icon: "♧", value: "totalClientes" },
  { key: "produtos", label: "Produtos", icon: "▧", value: "totalProdutos" },
  {
    key: "disponiveis",
    label: "Disponíveis",
    icon: "✓",
    value: "produtosDisponiveis",
  },
  {
    key: "indisponiveis",
    label: "Indisponíveis",
    icon: "○",
    value: "produtosIndisponiveis",
  },
] as const;

/**
 * Componente de cartões de resumo (<see cref="SummaryCards"/>) responsável por exibir 
 * de forma organizada e acessível os indicadores quantitativos gerais da padaria.
 */
export function SummaryCards({
  totalClientes,
  totalProdutos,
  produtosDisponiveis,
  produtosIndisponiveis,
}: SummaryCardsProps) {
  // Mapeia as propriedades recebidas em um objeto indexável para acesso dinâmico via configuração dos cards
  const values = {
    totalClientes,
    totalProdutos,
    produtosDisponiveis,
    produtosIndisponiveis,
  };

  return (
    <section className="summary-grid" aria-label="Resumo do dashboard">
      {/* Mapeia a matriz de configuração para renderizar cada cartão estatístico */}
      {cards.map((card) => (
        <article className="summary-card" key={card.key}>
          <span className="summary-card-icon" aria-hidden="true">
            {card.icon}
          </span>
          <div>
            <p className="summary-card-label">{card.label}</p>
            <p className="summary-card-value">
              {values[card.value] ?? "Não disponível"}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}