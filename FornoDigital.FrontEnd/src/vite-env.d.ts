/// <reference types="vite/client" />

/**
 * Define a estrutura das variáveis de ambiente personalizadas expostas 
 * pela aplicação através do Vite.
 */
interface ImportMetaEnv {
  /** A URL base para comunicação com a API backend do sistema (opcional). */
  readonly VITE_API_BASE_URL?: string;
}

/**
 * Estende a interface padrão <see cref="ImportMeta"/> do Vite para incluir 
 * as tipagens das variáveis de ambiente personalizadas do projeto.
 */
interface ImportMeta {
  /** Objeto contendo as variáveis de ambiente disponíveis. */
  readonly env: ImportMetaEnv;
}