import { useEffect, useState } from "react";
import {
  cadastrarProduto,
  listarProdutos,
} from "../../../infrastructure/api/produtosApi";
import type {
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
 * Carrega e mantém o estado dos produtos e coordena cadastro e recarga.
 * As requisições HTTP são feitas pelas funções de infraestrutura da API.
 */
export function useProdutosData() {
  const [produtos, setProdutos] = useState<ProdutosState>({
    data: [],
    loading: true,
    error: null,
  });
  const [salvando, setSalvando] = useState(false);
  const [erroOperacao, setErroOperacao] = useState<string | null>(null);

  /**
   * Busca novamente os produtos e atualiza o estado de carregamento,
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
   * A variável ativo impede atualizações de estado caso o componente
   * que usa o hook seja desmontado antes da resposta.
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
   * Envia o pedido de cadastro e adiciona o produto retornado pela API à lista.
   * Em caso de falha, guarda a mensagem e propaga o erro para a página exibi-lo.
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

  return {
    produtos,
    salvando,
    erroOperacao,
    cadastrar,
    recarregar,
  };
}