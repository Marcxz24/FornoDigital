import { useEffect, useState } from "react";
import {
  cadastrarCliente,
  editarCliente,
  excluirCliente,
  listarClientes,
} from "../../../infrastructure/api/clientesApi";
import type {
  Cliente,
  ClienteRequest,
} from "../types/cliente";

interface ClientesState {
  data: Cliente[];
  loading: boolean;
  error: string | null;
}

function obterMensagemErro(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado ao processar os clientes.";
}

export function useClientesData() {
  const [clientes, setClientes] = useState<ClientesState>({
    data: [],
    loading: true,
    error: null,
  });
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [erroOperacao, setErroOperacao] = useState<string | null>(null);

    /**
   * Busca novamente os clientes na API.
   * Marca o estado como carregando, atualiza a lista em caso de sucesso
   * e guarda a mensagem da API caso a requisição falhe.
   */
  async function recarregar() {
    setClientes((estadoAtual) => ({
      ...estadoAtual,
      loading: true,
      error: null,
    }));

    try {
      const data = await listarClientes();

      setClientes({
        data,
        loading: false,
        error: null,
      });
    } catch (error: unknown) {
      setClientes({
        data: [],
        loading: false,
        error: obterMensagemErro(error),
      });
    }
  }

  useEffect(() => {
    let ativo = true;

    listarClientes().then(
      (data) => {
        if (ativo) {
          setClientes({
            data,
            loading: false,
            error: null,
          });
        }
      },
      (error: unknown) => {
        if (ativo) {
          setClientes({
            data: [],
            loading: false,
            error: obterMensagemErro(error),
          });
        }
      },
    );

    return () => {
      ativo = false;
    };
  }, []);

  async function cadastrar(request: ClienteRequest): Promise<Cliente> {
    setSalvando(true);
    setErroOperacao(null);

    try {
      const clienteCriado = await cadastrarCliente(request);

      setClientes((estadoAtual) => ({
        ...estadoAtual,
        data: [
          clienteCriado,
          ...estadoAtual.data.filter(
            (cliente) => cliente.id !== clienteCriado.id,
          ),
        ],
      }));

      return clienteCriado;
    } catch (error: unknown) {
      setErroOperacao(obterMensagemErro(error));
      throw error;
    } finally {
      setSalvando(false);
    }
  }

  async function atualizar(
    id: string,
    request: ClienteRequest,
  ): Promise<Cliente> {
    setSalvando(true);
    setErroOperacao(null);

    try {
      const clienteAtualizado = await editarCliente(id, request);

      setClientes((estadoAtual) => ({
        ...estadoAtual,
        data: estadoAtual.data.map((cliente) =>
          cliente.id === clienteAtualizado.id
            ? clienteAtualizado
            : cliente,
        ),
      }));

      return clienteAtualizado;
    } catch (error: unknown) {
      setErroOperacao(obterMensagemErro(error));
      throw error;
    } finally {
      setSalvando(false);
    }
  }

  async function remover(id: string): Promise<void> {
    setExcluindoId(id);
    setErroOperacao(null);

    try {
      await excluirCliente(id);

      setClientes((estadoAtual) => ({
        ...estadoAtual,
        data: estadoAtual.data.filter((cliente) => cliente.id !== id),
      }));
    } catch (error: unknown) {
      setErroOperacao(obterMensagemErro(error));
      throw error;
    } finally {
      setExcluindoId(null);
    }
  }

    return {
    clientes,
    salvando,
    excluindoId,
    erroOperacao,
    cadastrar,
    atualizar,
    remover,
    recarregar,
  };
}