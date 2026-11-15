import type { Cliente, OrdenacaoCliente } from "../types/cliente";
import type { Ordenacao } from "../../../shared/types/paginacao";
import { CabecalhoOrdenavel } from "../../../shared/components/CabecalhoOrdenavel";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { Paginacao } from "../../../shared/components/Paginacao";

interface ListaClientesProps {
  clientes: Cliente[];
  totalRegistros: number;
  pagina: number;
  totalPaginas: number;
  tamanhoPagina: number;
  possuiDados: boolean;
  carregando: boolean;
  erro: string | null;
  termoBusca: string;
  buscaAplicada: string;
  ordenacao: Ordenacao<OrdenacaoCliente>;
  excluindoId: string | null;
  onBuscaChange: (termo: string) => void;
  onOrdenar: (campo: OrdenacaoCliente) => void;
  onMudarPagina: (pagina: number) => void;
  onEditar: (cliente: Cliente) => void;
  onExcluir: (cliente: Cliente) => void;
  onRecarregar: () => void;
}

const formatarNumero = new Intl.NumberFormat("pt-BR");

/**
 * Combina cidade e estado para exibição.
 * Se ambos estiverem ausentes, informa que o dado não foi fornecido.
 */
function formatarLocalizacao(cliente: Cliente) {
  const cidade = cliente.cidade?.trim();
  const estado = cliente.estado?.trim();

  if (cidade && estado) {
    return `${cidade} / ${estado}`;
  }

  return cidade || estado || "Não informado";
}

/**
 * Apresenta a página de clientes recebida da API em formato de grid,
 * com busca, ordenação, paginação e ações de edição e exclusão por linha.
 * Este componente não chama a API: os parâmetros são repassados à página.
 */
export function ListaClientes({
  clientes,
  totalRegistros,
  pagina,
  totalPaginas,
  tamanhoPagina,
  possuiDados,
  carregando,
  erro,
  termoBusca,
  buscaAplicada,
  ordenacao,
  excluindoId,
  onBuscaChange,
  onOrdenar,
  onMudarPagina,
  onEditar,
  onExcluir,
  onRecarregar,
}: ListaClientesProps) {
  /**
   * Escolhe o conteúdo principal conforme o estado da consulta.
   * Durante novas consultas, a grid anterior continua visível e esmaecida.
   */
  function renderizarConteudo() {
    if (erro) {
      return (
        <div>
          <ErrorState message={erro} />
          <button
            className="client-secondary-button"
            type="button"
            onClick={onRecarregar}
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    if (!possuiDados) {
      return <LoadingState message="Carregando clientes..." />;
    }

    if (totalRegistros === 0 && !carregando) {
      return buscaAplicada ? (
        <EmptyState message="Nenhum resultado encontrado. Tente buscar por outro nome, telefone, CPF ou e-mail." />
      ) : (
        <EmptyState message="Nenhum cliente cadastrado. Cadastre um cliente para que ele apareça nesta lista." />
      );
    }

    return (
      <div className="data-grid-wrapper" aria-busy={carregando}>
        <table className="data-grid">
          <caption className="sr-only">
            Clientes cadastrados, página {pagina} de {totalPaginas}
          </caption>
          <thead>
            <tr>
              <CabecalhoOrdenavel
                campo="nome"
                rotulo="Nome"
                ordenacao={ordenacao}
                onOrdenar={onOrdenar}
              />
              <th scope="col">CPF</th>
              <th scope="col">Telefone</th>
              <th scope="col">E-mail</th>
              <CabecalhoOrdenavel
                campo="cidade"
                rotulo="Cidade"
                ordenacao={ordenacao}
                onOrdenar={onOrdenar}
              />
              <th scope="col" className="data-grid-actions-column">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="data-grid-cell-primary">{cliente.nome}</td>
                <td className="data-grid-cell-number">
                  {cliente.cpf?.trim() || (
                    <span className="data-grid-cell-muted">Não informado</span>
                  )}
                </td>
                <td className="data-grid-cell-number">
                  {cliente.telefone?.trim() || (
                    <span className="data-grid-cell-muted">Não informado</span>
                  )}
                </td>
                <td>
                  {cliente.email?.trim() || (
                    <span className="data-grid-cell-muted">Não informado</span>
                  )}
                </td>
                <td className="data-grid-cell-nowrap">
                  {formatarLocalizacao(cliente)}
                </td>
                <td className="data-grid-actions-column">
                  <div className="data-grid-actions">
                    <button
                      className="client-icon-button"
                      type="button"
                      onClick={() => onEditar(cliente)}
                      aria-label={`Editar ${cliente.nome}`}
                      title="Editar cliente"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m14 5 5 5M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
                      </svg>
                    </button>

                    <button
                      className="client-icon-button client-icon-button-danger"
                      type="button"
                      onClick={() => onExcluir(cliente)}
                      disabled={excluindoId === cliente.id}
                      aria-label={`Excluir ${cliente.nome}`}
                      title={
                        excluindoId === cliente.id
                          ? "Excluindo cliente"
                          : "Excluir cliente"
                      }
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="client-list-section" aria-labelledby="clients-list-title">
      <header className="client-section-heading">
        <div>
          <p className="client-eyebrow">Relacionamento</p>
          <h2 id="clients-list-title">Clientes</h2>
          <p className="client-section-description">
            Consulte e gerencie os clientes cadastrados.
          </p>
        </div>

        <span className="client-count-badge" aria-live="polite">
          {possuiDados
            ? `${formatarNumero.format(totalRegistros)} ${
                totalRegistros === 1 ? "cliente encontrado" : "clientes encontrados"
              }`
            : "Carregando..."}
        </span>
      </header>

      <label className="client-search-field">
        <span className="client-search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </span>

        <span className="sr-only">Buscar clientes</span>
        <input
          type="search"
          value={termoBusca}
          maxLength={100}
          onChange={(event) => onBuscaChange(event.target.value)}
          placeholder="Buscar por nome, telefone, CPF ou e-mail"
        />
      </label>

      {renderizarConteudo()}

      {!erro && (
        <Paginacao
          pagina={pagina}
          totalPaginas={totalPaginas}
          totalRegistros={totalRegistros}
          tamanhoPagina={tamanhoPagina}
          desabilitada={carregando}
          onMudarPagina={onMudarPagina}
        />
      )}
    </section>
  );
}