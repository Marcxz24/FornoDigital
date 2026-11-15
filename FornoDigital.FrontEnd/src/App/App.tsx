import { lazy, Suspense, useEffect, useState } from "react";
import {
  Sidebar,
  type AppPage,
} from "../features/dashboard/components/Sidebar";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { VendasPage } from "../features/vendas/pages/VendasPage";
import { ClientesPage } from "../features/clientes/pages/ClientesPage";
import { CadastrarProdutoPage } from "../features/produtos/pages/CadastrarProdutoPage";
import { ListarProdutosPage } from "../features/produtos/pages/ListarProdutosPage";
import { LoadingState } from "../shared/components/LoadingState";
import "../styles/global.css";

/**
 * A tela de indicadores (e a biblioteca de gráficos) só é baixada
 * quando a pessoa abre a tela, mantendo o carregamento inicial leve.
 */
const IndicadoresPage = lazy(() =>
  import("../features/indicadores/pages/IndicadoresPage").then((modulo) => ({
    default: modulo.IndicadoresPage,
  })),
);

/**
 * Define os temas visuais disponíveis para a aplicação.
 */
type Theme = "light" | "dark";

/**
 * Chave usada para salvar a preferência de tema no navegador.
 */
const THEME_STORAGE_KEY = "fornodigital-theme";

/**
 * Componente raiz que mantém o tema, a página ativa e o layout geral.
 */
export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return savedTheme === "dark" ? "dark" : "light";
  });

  const [paginaAtiva, setPaginaAtiva] = useState<AppPage>("dashboard");

  /**
   * Salva a preferência de tema sempre que ela mudar.
   */
  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  /**
   * Alterna o tema atual entre claro e escuro.
   */
  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <Sidebar
        paginaAtiva={paginaAtiva}
        onNavigate={setPaginaAtiva}
      />

      {paginaAtiva === "dashboard" ? (
        <DashboardPage
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : paginaAtiva === "indicadores" ? (
        <Suspense fallback={<LoadingState message="Carregando indicadores..." />}>
          <IndicadoresPage
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </Suspense>
      ) : paginaAtiva === "registrar-venda" ||
        paginaAtiva === "visualizar-vendas" ? (
        <VendasPage
          theme={theme}
          onToggleTheme={toggleTheme}
          modo={paginaAtiva}
          onNavigate={setPaginaAtiva}
        />
      ) : paginaAtiva === "cadastrar-cliente" ||
        paginaAtiva === "listar-clientes" ? (
        <ClientesPage
          key={paginaAtiva}
          paginaAtiva={paginaAtiva}
          onNavigate={setPaginaAtiva}
        />
      ) : paginaAtiva === "cadastrar-produto" ? (
        <CadastrarProdutoPage
          key={paginaAtiva}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={setPaginaAtiva}
        />
      ) : (
        <ListarProdutosPage
          key={paginaAtiva}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigate={setPaginaAtiva}
        />
      )}
    </div>
  );
}