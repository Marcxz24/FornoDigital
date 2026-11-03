import { useEffect, useState } from "react";
import { Sidebar } from "../features/dashboard/components/Sidebar";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
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
 * Componente raiz (App) da aplicação FornoDigital, responsável por gerenciar o estado global 
 * do tema (light/dark), persistência de preferência e renderização do layout principal (Sidebar e Dashboard).
 */
export default function App() {
  // Inicializa o estado do tema recuperando a preferência salva no localStorage ou definindo "light" por padrão
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return savedTheme === "dark" ? "dark" : "light";
  });

  // Sincroniza e persiste o tema selecionado no localStorage sempre que o estado "theme" for alterado
  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  /**
   * Alterna dinamicamente entre os temas claro e escuro.
   */
  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <Sidebar />
      <DashboardPage theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}