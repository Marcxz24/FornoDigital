import { useMemo, useState } from "react";
import type { Cliente } from "../types/cliente";
import { formatDate } from "../../../shared/utils/formatDate";
import { EmptyState } from "../../../shared/components/EmptyState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";

interface ListaClientesProps {
    clientes: Cliente[];
    carregando: boolean;
    erro: string | null;
    onEditar: (cliente: Cliente) => void;
    onExcluir: (cliente: Cliente) => void;
    onRecarregar: () => void;
}

/**
 * Lista, filtra e apresenta os clientes recebidos pela página.
 * Toda a busca é feita nos dados já carregados; este componente não chama a API.
 */
export function ListaClientes({
    clientes,
    carregando,
    erro,
    onEditar,
    onExcluir,
    onRecarregar,
}: ListaClientesProps) {
    const [termoBusca, setTermoBusca] = useState("");

    /**
     * Remove caracteres que não sejam números.
     * Isso permite comparar telefones e CPFs mesmo que tenham pontuação ou espaços.
     */
    function somenteDigitos(valor: string) {
        return valor.replace(/\D/g, "");
    }

    /**
     * Calcula os clientes que correspondem ao termo digitado.
     * O nome e o e-mail são comparados sem diferenciar maiúsculas de minúsculas;
     * telefone e CPF também são comparados pelos seus dígitos.
     */
    const clientesFiltrados = useMemo(() => {
        const termo = termoBusca.trim().toLocaleLowerCase("pt-BR");
        const termoNumerico = somenteDigitos(termoBusca);

        if (!termo) {
            return clientes;
        }

        return clientes.filter((cliente) => {
            const correspondeTexto =
                cliente.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
                (cliente.email ?? "").toLocaleLowerCase("pt-BR").includes(termo);

            const correspondeNumero =
                termoNumerico.length > 0 &&
                (somenteDigitos(cliente.telefone ?? "").includes(termoNumerico) ||
                    somenteDigitos(cliente.cpf ?? "").includes(termoNumerico));

            return correspondeTexto || correspondeNumero;
        });
    }, [clientes, termoBusca]);

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

    if (carregando) {
        return <LoadingState message="Carregando clientes..." />;
    }

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

                <span className="client-count-badge">
                    {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"}
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
                    onChange={(event) => setTermoBusca(event.target.value)}
                    placeholder="Buscar por nome, telefone, CPF ou e-mail"
                />
            </label>

            {clientes.length === 0 ? (
                <EmptyState message="Nenhum cliente cadastrado. Cadastre um cliente para que ele apareça nesta lista." />
            ) : clientesFiltrados.length === 0 ? (
                <EmptyState message="Nenhum resultado encontrado. Tente buscar por outro nome, telefone, CPF ou e-mail." />
            ) : (
                <div className="client-cards-list">
                    {clientesFiltrados.map((cliente) => (
                        <article className="client-record-card" key={cliente.id}>
                            <div className="client-record-main">
                                <span className="client-avatar" aria-hidden="true">
                                    {cliente.nome.trim().charAt(0).toLocaleUpperCase("pt-BR") || "C"}
                                </span>

                                <div className="client-record-heading">
                                    <h3>{cliente.nome}</h3>
                                    <p>{cliente.email?.trim() || "Não informado"}</p>
                                </div>

                                <div className="client-record-actions">
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
                                        aria-label={`Excluir ${cliente.nome}`}
                                        title="Excluir cliente"
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <dl className="client-record-details">
                                <div>
                                    <dt>Telefone</dt>
                                    <dd>{cliente.telefone?.trim() || "Não informado"}</dd>
                                </div>

                                <div>
                                    <dt>CPF</dt>
                                    <dd>{cliente.cpf?.trim() || "Não informado"}</dd>
                                </div>

                                <div>
                                    <dt>Cidade / Estado</dt>
                                    <dd>{formatarLocalizacao(cliente)}</dd>
                                </div>

                                <div>
                                    <dt>Cadastro</dt>
                                    <dd>{formatDate(cliente.dataCadastro)}</dd>
                                </div>
                            </dl>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}