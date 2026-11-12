import { useEffect, useState } from "react";
import {
  Sidebar,
  type AppPage,
} from "../features/dashboard/components/Sidebar";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { VendasPage } from "../features/vendas/pages/VendasPage";
import { ClientesPage } from "../features/clientes/pages/ClientesPage";
import "../styles/global.css";

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
      ) : paginaAtiva === "registrar-venda" ||
        paginaAtiva === "visualizar-vendas" ? (
        <VendasPage
          theme={theme}
          onToggleTheme={toggleTheme}
          modo={paginaAtiva}
          onNavigate={setPaginaAtiva}
        />
      ) : (
        <ClientesPage
          key={paginaAtiva}
          paginaAtiva={paginaAtiva}
          onNavigate={setPaginaAtiva}
        />
      )}
    </div>
  );
}