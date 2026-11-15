import { useState } from "react";
import {
  alterarDisponibilidadeProduto,
  cadastrarProduto,
  editarProduto,
  listarProdutosPaginado,
  removerCodigoBarrasProduto,
} from "../../../infrastructure/api/produtosApi";
import { useListagemPaginada } from "../../../shared/hooks/useListagemPaginada";
import type {
  AlterarDisponibilidadeProdutoRequest,
  EditarProdutoRequest,
  FiltroProduto,
  OrdenacaoProduto,
  Produto,
  ProdutoRequest,
} from "../types/produto";

interface OpcoesProdutosData {
  /** Quando falso, o catálogo paginado não é consultado (por exemplo, na tela de cadastro). */
  carregarCatalogo?: boolean;
}

/**
 * Coordena o catálogo paginado e as operações de cadastro, edição,
 * disponibilidade e remoção individual de códigos de barras.
 * Busca, filtro, ordenação e paginação são feitos pela API; após cada
 * operação concluída, a página atual é consultada novamente.
 */
export function useProdutosData({ carregarCatalogo = true }: OpcoesProdutosData = {}) {
  const catalogo = useListagemPaginada<Produto, OrdenacaoProduto, FiltroProduto>({
    carregar: listarProdutosPaginado,
    ordenacaoInicial: { campo: "nome", direcao: "asc" },
    filtroInicial: "todos",
    mensagemErroPadrao: "Ocorreu um erro inesperado ao carregar os produtos.",
    habilitado: carregarCatalogo,
  });
  const { recarregar } = catalogo;
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [alterandoDisponibilidadeId, setAlterandoDisponibilidadeId] =
    useState<string | null>(null);
  const [codigoBarrasEmRemocao, setCodigoBarrasEmRemocao] = useState<
    string | null
  >(null);

  /**
   * Cadastra um produto. Se houver falha, propaga o erro à página.
   */
  async function cadastrar(request: ProdutoRequest): Promise<Produto> {
    setSalvando(true);

    try {
      const produtoCriado = await cadastrarProduto(request);

      if (carregarCatalogo) {
        recarregar();
      }

      return produtoCriado;
    } finally {
      setSalvando(false);
    }
  }

  /**
   * Edita os dados do produto e consulta novamente a página do catálogo.
   */
  async function atualizar(
    id: string,
    request: EditarProdutoRequest,
  ): Promise<Produto> {
    setEditandoId(id);

    try {
      const produtoAtualizado = await editarProduto(id, request);
      recarregar();

      return produtoAtualizado;
    } finally {
      setEditandoId(null);
    }
  }

  /**
   * Altera a disponibilidade e consulta novamente a página do catálogo,
   * respeitando o filtro de situação selecionado.
   */
  async function alterarDisponibilidade(
    id: string,
    request: AlterarDisponibilidadeProdutoRequest,
  ): Promise<Produto> {
    setAlterandoDisponibilidadeId(id);

    try {
      const produtoAtualizado = await alterarDisponibilidadeProduto(id, request);
      recarregar();

      return produtoAtualizado;
    } finally {
      setAlterandoDisponibilidadeId(null);
    }
  }

  /**
   * Remove um código pela API. A remoção é gravada imediatamente no banco;
   * o catálogo é consultado novamente somente após a confirmação HTTP.
   */
  async function removerCodigoBarras(
    produtoId: string,
    codigoBarras: string,
  ): Promise<void> {
    setCodigoBarrasEmRemocao(codigoBarras);

    try {
      await removerCodigoBarrasProduto(produtoId, codigoBarras);
      recarregar();
    } finally {
      setCodigoBarrasEmRemocao(null);
    }
  }

  return {
    catalogo,
    salvando,
    editandoId,
    alterandoDisponibilidadeId,
    codigoBarrasEmRemocao,
    cadastrar,
    atualizar,
    alterarDisponibilidade,
    removerCodigoBarras,
  };
}