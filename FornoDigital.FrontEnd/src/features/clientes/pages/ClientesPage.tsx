import { useState } from "react";
import type { Cliente, ClienteRequest } from "../types/cliente";
import { useClientesData } from "../hooks/useClientesData";
import { ClienteForm } from "../components/ClienteForm";
import { ListaClientes } from "../components/ListaClientes";
import {
  confirmarAcao,
  notificar,
} from "../../../shared/utils/notificacoes";

type PaginaClientes = "cadastrar-cliente" | "listar-clientes";

interface ClientesPageProps {
  paginaAtiva: PaginaClientes;
  onNavigate: (pagina: PaginaClientes) => void;
}

/**
 * Coordena a tela de clientes e conecta o hook aos componentes de apresentação.
 */
export function ClientesPage({
  paginaAtiva,
  onNavigate,
}: ClientesPageProps) {
  const {
    clientes: estadoClientes,
    salvando,
    cadastrar,
    atualizar,
    remover,
    recarregar,
  } = useClientesData();

  const [modoFormulario, setModoFormulario] = useState<
    "fechado" | "novo" | "editar"
  >(paginaAtiva === "cadastrar-cliente" ? "novo" : "fechado");
  const [clienteSelecionado, setClienteSelecionado] =
    useState<Cliente | null>(null);

  /**
   * Abre um formulário de cadastro vazio.
   */
  function abrirCadastro() {
    setClienteSelecionado(null);
    setModoFormulario("novo");
  }

  /**
   * Seleciona um cliente e abre o formulário preenchido para edição.
   */
  function abrirEdicao(cliente: Cliente) {
    setClienteSelecionado(cliente);
    setModoFormulario("editar");
  }

  /**
 * Executa o cadastro ou a edição, notifica falhas da API e devolve
 * o cliente salvo quando a operação termina com sucesso.
 */
  async function salvarCliente(request: ClienteRequest): Promise<Cliente> {
    try {
      if (modoFormulario === "editar" && clienteSelecionado) {
        return await atualizar(clienteSelecionado.id, request);
      }

      return await cadastrar(request);
    } catch (error: unknown) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o cliente.";

      void notificar("error", mensagem);
      throw error;
    }
  }

  /**
   * Notifica o sucesso após a API salvar o cliente e volta à listagem.
   */
  function concluirSalvamento(cliente: Cliente) {
    const acao =
      modoFormulario === "editar" ? "atualizado" : "cadastrado";

    void notificar("success", `Cliente ${cliente.nome} ${acao} com sucesso.`);
    setModoFormulario("fechado");
    setClienteSelecionado(null);
    onNavigate("listar-clientes");
  }

  /**
   * Pede confirmação e só então chama a API para excluir o cliente.
   * Se a API falhar, mostra uma notificação de erro com a mensagem recebida.
   */
  async function solicitarExclusao(cliente: Cliente) {
    const confirmou = await confirmarAcao(
      "Excluir cliente?",
      `O cliente ${cliente.nome} será removido permanentemente. Esta ação não poderá ser desfeita.`,
    );

    if (!confirmou) {
      return;
    }

    try {
      await remover(cliente.id);
      void notificar(
        "success",
        `Cliente ${cliente.nome} excluído com sucesso.`,
      );
    } catch (error: unknown) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o cliente.";

      void notificar("error", mensagem);
    }
  }

  /**
   * Fecha o formulário; se o cadastro foi aberto pelo menu,
   * retorna à opção de listagem.
   */
  function cancelarFormulario() {
    setModoFormulario("fechado");
    setClienteSelecionado(null);

    if (paginaAtiva === "cadastrar-cliente") {
      onNavigate("listar-clientes");
    }
  }

  return (
    <main className="page-content clients-page">
      <header className="page-header clients-page-header">
        <div>
          <p className="client-eyebrow">Relacionamento</p>
          <h1>Clientes</h1>
          <p className="page-subtitle">
            Consulte e mantenha os dados dos clientes da padaria.
          </p>
        </div>

        <button
          className="client-primary-button"
          type="button"
          onClick={abrirCadastro}
        >
          <span aria-hidden="true">+</span>
          Cadastrar cliente
        </button>
      </header>

      {modoFormulario !== "fechado" && (
        <section className="client-form-panel">
          <header className="client-section-heading">
            <div>
              <p className="client-eyebrow">
                {modoFormulario === "editar" ? "Atualização" : "Novo registro"}
              </p>
              <h2>
                {modoFormulario === "editar"
                  ? "Editar cliente"
                  : "Cadastrar cliente"}
              </h2>
            </div>

            <button
              className="client-secondary-button"
              type="button"
              onClick={cancelarFormulario}
              disabled={salvando}
            >
              Cancelar
            </button>
          </header>

          <ClienteForm
            cliente={modoFormulario === "editar" ? clienteSelecionado : null}
            salvando={salvando}
            erroApi={null}
            onSubmit={salvarCliente}
            onSuccess={concluirSalvamento}
            onCancel={cancelarFormulario}
          />
        </section>
      )}

      <ListaClientes
        clientes={estadoClientes.data}
        carregando={estadoClientes.loading}
        erro={estadoClientes.error}
        onEditar={abrirEdicao}
        onExcluir={solicitarExclusao}
        onRecarregar={recarregar}
      />
    </main>
  );
}