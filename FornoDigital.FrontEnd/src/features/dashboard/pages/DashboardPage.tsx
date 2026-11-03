import { ClientList } from "../components/ClientList";
import { ProductList } from "../components/ProductList";
import { SummaryCards } from "../components/SummaryCards";
import { useDashboardData } from "../hooks/useDashboardData";

/**
 * Define os temas visuais suportados no dashboard.
 */
type DashboardTheme = "light" | "dark";

/**
 * Define as propriedades (props) aceitas pelo componente <see cref="DashboardPage"/>.
 */
interface DashboardPageProps {
  /** O tema visual atual da aplicação ("light" ou "dark"). */
  theme: DashboardTheme;
  /** Função de retorno de chamada (callback) acionada para alternar o tema atual. */
  onToggleTheme: () => void;
}

/**
 * Componente de página principal (DashboardPage) responsável por exibir a visão geral do sistema, 
 * incluindo cartões de resumo estatístico e as listagens de clientes e produtos.
 */
export function DashboardPage({
    theme,
    onToggleTheme,
  }: DashboardPageProps) {
  // Obtém os dados consolidados de clientes e produtos através do hook personalizado
  const { clientes, produtos } = useDashboardData();

  // Filtra e valida os dados disponíveis para uso nos cards de resumo
  const clientesDisponiveis =
    !clientes.loading && !clientes.error ? clientes.data : null;
  const produtosDisponiveis =
    !produtos.loading && !produtos.error ? produtos.data : null;

  return (
    <main className="dashboard">
      {/* Cabeçalho da página contendo a marca, títulos e botão de alternância de tema */}
      <header className="dashboard-header">
        <div className="brand-mark" aria-hidden="true">
          <span>F</span>
        </div>
        <div className="dashboard-heading">
          <p className="eyebrow">FornoDigital</p>
          <h1>Visão Geral</h1>
          <p className="dashboard-subtitle">
            Um resumo dos seus clientes e produtos.
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

      {/* Seção de cartões de resumo calculados com base nos dados carregados */}
      <SummaryCards
        totalClientes={clientesDisponiveis?.length ?? null}
        totalProdutos={produtosDisponiveis?.length ?? null}
        produtosDisponiveis={
          produtosDisponiveis?.filter((produto) => produto.disponivel).length ??
          null
        }
        produtosIndisponiveis={
          produtosDisponiveis?.filter((produto) => !produto.disponivel).length ??
          null
        }
      />

      {/* Seções contendo as listas detalhadas de clientes e produtos */}
      <div className="dashboard-sections">
        <ClientList
          clientes={clientes.data}
          loading={clientes.loading}
          error={clientes.error}
        />
        <ProductList
          produtos={produtos.data}
          loading={produtos.loading}
          error={produtos.error}
        />
      </div>
    </main>
  );
}