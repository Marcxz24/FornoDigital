interface ConfirmarExclusaoClienteProps {
  nomeCliente: string;
  carregando: boolean;
  erro: string | null;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/**
 * Exibe uma confirmação antes de excluir permanentemente um cliente.
 * A exclusão só é solicitada quando a pessoa aciona o botão de confirmação.
 */
export function ConfirmarExclusaoCliente({
  nomeCliente,
  carregando,
  erro,
  onConfirmar,
  onCancelar,
}: ConfirmarExclusaoClienteProps) {
  /**
   * Evita enviar a confirmação novamente enquanto a requisição anterior está em andamento.
   * Quando não está carregando, delega a exclusão ao componente responsável pelo estado.
   */
  function handleConfirmar() {
    if (carregando) {
      return;
    }

    onConfirmar();
  }

  return (
    <div
      className="client-confirmation-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !carregando) {
          onCancelar();
        }
      }}
    >
      <section
        className="client-confirmation-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="client-confirmation-title"
        aria-describedby="client-confirmation-description"
      >
        <div className="client-confirmation-icon" aria-hidden="true">
          !
        </div>

        <p className="client-eyebrow">Ação permanente</p>

        <h2 id="client-confirmation-title">Excluir cliente?</h2>

        <p id="client-confirmation-description">
          O cliente <strong>{nomeCliente}</strong> será removido permanentemente.
          Esta ação não poderá ser desfeita.
        </p>

        {erro && (
          <p className="client-form-error" role="alert">
            {erro}
          </p>
        )}

        <div className="client-confirmation-actions">
          <button
            className="client-secondary-button"
            type="button"
            onClick={onCancelar}
            disabled={carregando}
          >
            Cancelar
          </button>

          <button
            className="client-danger-button"
            type="button"
            onClick={handleConfirmar}
            disabled={carregando}
          >
            {carregando ? "Excluindo..." : "Excluir cliente"}
          </button>
        </div>
      </section>
    </div>
  );
}