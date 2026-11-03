/**
 * Define as propriedades (props) aceitas pelo componente <see cref="LoadingState"/>.
 */
interface LoadingStateProps {
  /** A mensagem personalizada opcional a ser exibida durante o processo de carregamento. */
  message?: string;
}

/**
 * Componente visual de estado de carregamento (<see cref="LoadingState"/>) responsável por exibir 
 * de forma acessível um indicador visual (spinner) e uma mensagem enquanto os dados são processados ou buscados.
 */
export function LoadingState({
  message = "Carregando...",
}: LoadingStateProps) {
  return (
    <div className="state-message" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}