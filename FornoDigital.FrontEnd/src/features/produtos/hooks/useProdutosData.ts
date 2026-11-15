import { useEffect, useState } from "react";
import {
  alterarDisponibilidadeProduto,
  cadastrarProduto,
  editarProduto,
  listarProdutos,
} from "../../../infrastructure/api/produtosApi";
import type {
  AlterarDisponibilidadeProdutoRequest,
  EditarProdutoRequest,
  Produto,
  ProdutoRequest,
} from "../types/produto";

interface ProdutosState {
  data: Produto[];
  loading: boolean;
  error: string | null;
}

/**
 * Converte uma falha desconhecida em uma mensagem que possa ser exibida.
 */
function obterMensagemErro(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado ao processar os produtos.";
}

/**
 * Carrega produtos e coordena cadastro, edição e alteração de disponibilidade.
 * Todas as requisições HTTP são delegadas às funções de produtosApi.
 */
export function useProdutosData() {
  const [produtos, setProdutos] = useState<ProdutosState>({
    data: [],
    loading: true,
    error: null,
  });
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [alterandoDisponibilidadeId, setAlterandoDisponibilidadeId] =
    useState<string | null>(null);
  const [erroOperacao, setErroOperacao] = useState<string | null>(null);

  /**
   * Busca novamente a lista e atualiza o estado de carregamento,
   * de dados ou de erro conforme o resultado da API.
   */
  async function recarregar() {
    setProdutos((estadoAtual) => ({
      ...estadoAtual,
      loading: true,
      error: null,
    }));

    try {
      const data = await listarProdutos();

      setProdutos({
        data,
        loading: false,
        error: null,
      });
    } catch (error: unknown) {
      setProdutos({
        data: [],
        loading: false,
        error: obterMensagemErro(error),
      });
    }
  }

  /**
   * Carrega os produtos quando o hook é iniciado.
   * A variável ativo impede atualizar o estado após o componente ser desmontado.
   */
  useEffect(() => {
    let ativo = true;

    listarProdutos().then(
      (data) => {
        if (ativo) {
          setProdutos({
            data,
            loading: false,
            error: null,
          });
        }
      },
      (error: unknown) => {
        if (ativo) {
          setProdutos({
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

  /**
   * Cadastra um produto e o insere no início da lista local.
   * Se houver falha, guarda a mensagem e propaga o erro à página.
   */
  async function cadastrar(request: ProdutoRequest): Promise<Produto> {
    setSalvando(true);
    setErroOperacao(null);

    try {
      const produtoCriado = await cadastrarProduto(request);

      setProdutos((estadoAtual) => ({
        ...estadoAtual,
        data: [
          produtoCriado,
          ...estadoAtual.data.filter(
            (produto) => produto.id !== produtoCriado.id,
          ),
        ],
      }));

      return produtoCriado;
    } catch (error: unknown) {
      setErroOperacao(obterMensagemErro(error));
      throw error;
    } finally {
      setSalvando(false);
    }
  }

  /**
   * Edita os dados do produto e substitui sua versão na lista local
   * pela resposta atualizada retornada pela API.
   */
  async function atualizar(
    id: string,
    request: EditarProdutoRequest,
  ): Promise<Produto> {
    setEditandoId(id);
    setErroOperacao(null);

    try {
      const produtoAtualizado = await editarProduto(id, request);

      setProdutos((estadoAtual) => ({
        ...estadoAtual,
        data: estadoAtual.data.map((produto) =>
          produto.id === produtoAtualizado.id
            ? produtoAtualizado
            : produto,
        ),
      }));

      return produtoAtualizado;
    } catch (error: unknown) {
      setErroOperacao(obterMensagemErro(error));
      throw error;
    } finally {
      setEditandoId(null);
    }
  }

  /**
   * Altera a disponibilidade e sincroniza o cartão do produto
   * com a resposta mais recente da API.
   */
  async function alterarDisponibilidade(
    id: string,
    request: AlterarDisponibilidadeProdutoRequest,
  ): Promise<Produto> {
    setAlterandoDisponibilidadeId(id);
    setErroOperacao(null);

    try {
      const produtoAtualizado = await alterarDisponibilidadeProduto(id, request);

      setProdutos((estadoAtual) => ({
        ...estadoAtual,
        data: estadoAtual.data.map((produto) =>
          produto.id === produtoAtualizado.id
            ? produtoAtualizado
            : produto,
        ),
      }));

      return produtoAtualizado;
    } catch (error: unknown) {
      setErroOperacao(obterMensagemErro(error));
      throw error;
    } finally {
      setAlterandoDisponibilidadeId(null);
    }
  }

  return {
    produtos,
    salvando,
    editandoId,
    alterandoDisponibilidadeId,
    erroOperacao,
    cadastrar,
    atualizar,
    alterarDisponibilidade,
    recarregar,
  };
}