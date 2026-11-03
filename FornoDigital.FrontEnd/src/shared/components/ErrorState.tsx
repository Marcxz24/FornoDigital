/**
 * Define as propriedades (props) aceitas pelo componente <see cref="ErrorState"/>.
 */
interface ErrorStateProps {
  /** A mensagem personalizada opcional a ser exibida para detalhar o erro ocorrido. */
  message?: string;
}

/**
 * Componente visual de estado de erro (<see cref="ErrorState"/>) responsável por sinalizar 
 * de forma acessível e destacada quando ocorre uma falha ou exceção ao carregar os dados.
 */
export function ErrorState({
  message = "Não foi possível carregar os dados.",
}: ErrorStateProps) {
  return (
    <div className="state-message state-error" role="alert">
      <span aria-hidden="true">!</span>
      <span>{message}</span>
    </div>
  );
}