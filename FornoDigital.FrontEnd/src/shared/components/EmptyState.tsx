/**
 * Define as propriedades (props) aceitas pelo componente <see cref="EmptyState"/>.
 */
interface EmptyStateProps {
  /** A mensagem personalizada opcional a ser exibida para o usuário indicando o estado vazio. */
  message?: string;
}

/**
 * Componente visual de estado vazio (<see cref="EmptyState"/>) responsável por informar 
 * de maneira limpa e acessível quando uma lista ou consulta não retorna nenhum registro.
 */
export function EmptyState({
  message = "Nenhum item encontrado.",
}: EmptyStateProps) {
  return (
    <div className="state-message state-empty">
      <span aria-hidden="true">◇</span>
      <span>{message}</span>
    </div>
  );
}