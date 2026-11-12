import { useEffect, useState } from "react";
import {
  Sidebar,
  type AppPage,
} from "../features/dashboard/components/Sidebar";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { VendasPage } from "../features/vendas/pages/VendasPage";
import "../styles/global.css";

/**
 * Define os temas visuais disponíveis para a aplicação (Claro ou Escuro).
 */
type Theme = "light" | "dark";

/**
 * Chave utilizada para persistir a preferência de tema no armazenamento local do navegador.
 */
const THEME_STORAGE_KEY = "fornodigital-theme";

/**
 * Componente raiz responsável pelo tema, pela navegação e pela página atual.
 */
export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return savedTheme === "dark" ? "dark" : "light";
  });

  const [paginaAtiva, setPaginaAtiva] = useState<AppPage>("dashboard");

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

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
      ) : (
        <VendasPage
          theme={theme}
          onToggleTheme={toggleTheme}
          modo={paginaAtiva}
          onNavigate={setPaginaAtiva}
        />
      )}
    </div>
  );
}