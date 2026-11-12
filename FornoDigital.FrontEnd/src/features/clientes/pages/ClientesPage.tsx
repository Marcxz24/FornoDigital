import { useState } from "react";
import type { Cliente, ClienteRequest } from "../types/cliente";
import { useClientesData } from "../hooks/useClientesData";
import { ClienteForm } from "../components/ClienteForm";
import { ListaClientes } from "../components/ListaClientes";
import { ConfirmarExclusaoCliente } from "../components/ConfirmarExclusaoCliente";

type PaginaClientes = "cadastrar-cliente" | "listar-clientes";

interface ClientesPageProps {
  paginaAtiva: PaginaClientes;
  onNavigate: (pagina: PaginaClientes) => void;
}

/**
 * Coordena a tela de clientes, conectando os dados do hook aos componentes
 * visuais e sincronizando o formulário com a opção ativa da navegação.
 */
export function ClientesPage({
  paginaAtiva,
  onNavigate,
}: ClientesPageProps) {
  const {
    clientes: estadoClientes,
    salvando,
    excluindoId,
    erroOperacao,
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
  const [clienteParaExcluir, setClienteParaExcluir] =
    useState<Cliente | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  /**
   * Abre um formulário de cadastro limpo quando o botão da página é acionado.
   */
  function abrirCadastro() {
    setClienteSelecionado(null);
    setMensagemSucesso(null);
    setModoFormulario("novo");
  }

  /**
   * Seleciona o cliente e abre o formulário preenchido para edição.
   */
  function abrirEdicao(cliente: Cliente) {
    setClienteSelecionado(cliente);
    setMensagemSucesso(null);
    setModoFormulario("editar");
  }

  /**
   * Envia os dados ao endpoint apropriado e devolve o cliente retornado pela API.
   * O formulário usa esse resultado para executar seu callback de sucesso.
   */
  async function salvarCliente(request: ClienteRequest): Promise<Cliente> {
    if (modoFormulario === "editar" && clienteSelecionado) {
      return atualizar(clienteSelecionado.id, request);
    }

    return cadastrar(request);
  }

  /**
   * Exibe a confirmação de sucesso, fecha o formulário e navega para a listagem.
   */
  function concluirSalvamento(cliente: Cliente) {
    const acao =
      modoFormulario === "editar" ? "atualizado" : "cadastrado";

    setMensagemSucesso(`Cliente ${cliente.nome} ${acao} com sucesso.`);
    setModoFormulario("fechado");
    setClienteSelecionado(null);
    onNavigate("listar-clientes");
  }

  /**
   * Solicita a exclusão ao hook e fecha a confirmação somente após sucesso.
   * Se a API falhar, mantém o diálogo aberto para apresentar o erro.
   */
  async function confirmarExclusao() {
    if (!clienteParaExcluir) {
      return;
    }

    try {
      await remover(clienteParaExcluir.id);
      setMensagemSucesso("Cliente excluído com sucesso.");
      setClienteParaExcluir(null);
    } catch {
      // O hook guarda o erro em erroOperacao para exibição no diálogo.
    }
  }

  /**
   * Cancela o formulário. Se ele foi aberto pela opção de cadastro do menu,
   * navega para a listagem; durante uma edição, apenas fecha o formulário.
   */
  function cancelarFormulario() {
    setModoFormulario("fechado");
    setClienteSelecionado(null);

    if (paginaAtiva === "cadastrar-cliente") {
      onNavigate("listar-clientes");
    }
  }

  /**
   * Fecha a confirmação de exclusão apenas quando não há exclusão em andamento.
   */
  function cancelarExclusao() {
    if (!excluindoId) {
      setClienteParaExcluir(null);
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

      {mensagemSucesso && (
        <p className="client-success-message" role="status">
          {mensagemSucesso}
        </p>
      )}

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
            erroApi={erroOperacao}
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
        onExcluir={(cliente) => {
          setMensagemSucesso(null);
          setClienteParaExcluir(cliente);
        }}
        onRecarregar={recarregar}
      />

      {clienteParaExcluir && (
        <ConfirmarExclusaoCliente
          nomeCliente={clienteParaExcluir.nome}
          carregando={excluindoId === clienteParaExcluir.id}
          erro={erroOperacao}
          onConfirmar={confirmarExclusao}
          onCancelar={cancelarExclusao}
        />
      )}
    </main>
  );
}