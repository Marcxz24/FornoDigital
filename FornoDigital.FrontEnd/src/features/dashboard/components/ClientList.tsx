import type { Cliente } from "../../clientes/types/cliente";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { formatDate } from "../../../shared/utils/formatDate";

/**
 * Define as propriedades (props) aceitas pelo componente <see cref="ClientList"/>.
 */
interface ClientListProps {
  /** A lista de clientes a ser renderizada. */
  clientes: Cliente[];
  /** Indica se os dados dos clientes ainda estão carregando. */
  loading: boolean;
  /** Mensagem de erro caso ocorra uma falha ao carregar os clientes. */
  error: string | null;
}

/**
 * Função utilitária para formatar e exibir um valor textual opcional, 
 * retornando um texto padrão caso o valor seja nulo, vazio ou composto apenas por espaços.
 * 
 * @vinculado ClientList
 */
function mostrarValor(value: string | null): string {
  return value?.trim() || "Não informado";
}

/**
 * Função utilitária para concatenar e formatar o endereço completo de um cliente 
 * a partir de seus campos constituintes (rua, número, bairro, cidade e estado).
 * 
 * @vinculado ClientList
 */
function formatarEndereco(cliente: Cliente): string {
  const endereco = [
    cliente.endereco,
    cliente.numeroCasa,
    cliente.bairro,
    [cliente.cidade, cliente.estado].filter(Boolean).join(" / "),
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");

  return endereco || "Não informado";
}

/**
 * Componente de listagem de clientes (<see cref="ClientList"/>) responsável por gerenciar a exibição 
 * dos estados de carregamento, erro, vazio ou a listagem detalhada dos registros de clientes cadastrados.
 */
export function ClientList({ clientes, loading, error }: ClientListProps) {
  return (
    <section className="panel" aria-labelledby="clients-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Relacionamento</p>
          <h2 id="clients-title">Clientes</h2>
        </div>
        {!loading && !error && (
          <span className="section-count">
            {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"}
          </span>
        )}
      </div>

      {loading ? (
        <LoadingState message="Carregando clientes..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : clientes.length === 0 ? (
        <EmptyState message="Nenhum cliente cadastrado." />
      ) : (
        <ul className="record-list">
          {clientes.map((cliente) => (
            <li className="record-card client-card" key={cliente.id}>
              <div className="record-card-heading">
                <div className="avatar" aria-hidden="true">
                  {cliente.nome.trim().charAt(0).toLocaleUpperCase("pt-BR") || "?"}
                </div>
                <div className="record-title">
                  <h3>{mostrarValor(cliente.nome)}</h3>
                  <p>{mostrarValor(cliente.email)}</p>
                </div>
              </div>

              <dl className="record-details">
                <div>
                  <dt>Telefone</dt>
                  <dd>{mostrarValor(cliente.telefone)}</dd>
                </div>
                <div>
                  <dt>CPF</dt>
                  <dd>{mostrarValor(cliente.cpf)}</dd>
                </div>
                <div className="detail-wide">
                  <dt>Endereço</dt>
                  <dd>{formatarEndereco(cliente)}</dd>
                </div>
                <div>
                  <dt>Cadastro</dt>
                  <dd>{formatDate(cliente.dataCadastro)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}