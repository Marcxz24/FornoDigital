import { useState } from "react";
import {
  cadastrarCliente,
  editarCliente,
  excluirCliente,
  listarClientesPaginado,
} from "../../../infrastructure/api/clientesApi";
import { useListagemPaginada } from "../../../shared/hooks/useListagemPaginada";
import type {
  Cliente,
  ClienteRequest,
  FiltroCliente,
  OrdenacaoCliente,
} from "../types/cliente";

interface OpcoesClientesData {
  /** Quando falso, a listagem paginada não é consultada (por exemplo, na tela de cadastro). */
  carregarLista?: boolean;
}

/**
 * Coordena a listagem paginada de clientes e as operações de cadastro,
 * edição e exclusão. A busca, a ordenação e a paginação são feitas pela API;
 * após cada operação concluída, a página atual é consultada novamente.
 */
export function useClientesData({ carregarLista = true }: OpcoesClientesData = {}) {
  const lista = useListagemPaginada<Cliente, OrdenacaoCliente, FiltroCliente>({
    carregar: listarClientesPaginado,
    ordenacaoInicial: { campo: "nome", direcao: "asc" },
    filtroInicial: null,
    mensagemErroPadrao: "Ocorreu um erro inesperado ao carregar os clientes.",
    habilitado: carregarLista,
  });
  const { recarregar } = lista;
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  /**
   * Cadastra um cliente e atualiza a página exibida.
   * Em caso de falha, propaga o erro para a página notificar.
   */
  async function cadastrar(request: ClienteRequest): Promise<Cliente> {
    setSalvando(true);

    try {
      const clienteCriado = await cadastrarCliente(request);
      recarregar();

      return clienteCriado;
    } finally {
      setSalvando(false);
    }
  }

  /**
   * Edita um cliente e atualiza a página exibida com os dados da API.
   */
  async function atualizar(
    id: string,
    request: ClienteRequest,
  ): Promise<Cliente> {
    setSalvando(true);

    try {
      const clienteAtualizado = await editarCliente(id, request);
      recarregar();

      return clienteAtualizado;
    } finally {
      setSalvando(false);
    }
  }

  /**
   * Exclui um cliente e consulta novamente a página atual.
   * Se a página ficar vazia, a listagem passa para a última página existente.
   */
  async function remover(id: string): Promise<void> {
    setExcluindoId(id);

    try {
      await excluirCliente(id);
      recarregar();
    } finally {
      setExcluindoId(null);
    }
  }

  return {
    lista,
    salvando,
    excluindoId,
    cadastrar,
    atualizar,
    remover,
  };
}