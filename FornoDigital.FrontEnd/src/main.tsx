import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App/App";

/**
 * Localiza o elemento raiz ("root") no DOM e inicializa a aplicação React, 
 * envolvendo o componente principal <see cref="App"/> dentro do modo estrito (<see cref="StrictMode"/>) 
 * para verificação e identificação de potenciais problemas durante o desenvolvimento.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);