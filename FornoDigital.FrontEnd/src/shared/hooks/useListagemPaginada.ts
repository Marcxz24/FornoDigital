import { useEffect, useState } from "react";
import type {
  Ordenacao,
  ParametrosListagem,
  ResultadoPaginado,
} from "../types/paginacao";
import {
  ATRASO_BUSCA_MS,
  TAMANHO_PAGINA_PADRAO,
  alternarOrdenacao,
} from "../utils/paginacao";
import { useValorAtrasado } from "./useValorAtrasado";

interface OpcoesListagemPaginada<
  TItem,
  TCampo extends string,
  TFiltro extends string,
> {
  /**
   * Função de API que consulta uma página. Deve ser estável
   * (declarada fora do componente) para não repetir requisições.
   */
  carregar: (
    parametros: ParametrosListagem<TCampo, TFiltro>,
  ) => Promise<ResultadoPaginado<TItem>>;
  ordenacaoInicial: Ordenacao<TCampo>;
  filtroInicial: TFiltro | null;
  /** Mensagem exibida quando a falha não traz uma mensagem própria. */
  mensagemErroPadrao: string;
  /** Quando falso, nenhuma consulta é feita (por exemplo, com o formulário aberto). */
  habilitado?: boolean;
}

interface RespostaListagem<TItem> {
  /** Identifica os parâmetros que produziram esta resposta. */
  chave: string | null;
  dados: ResultadoPaginado<TItem> | null;
  erro: string | null;
}

/**
 * Mantém os parâmetros de uma listagem paginada no servidor (página, busca,
 * ordenação e filtro) e consulta a API sempre que eles mudam.
 *
 * - A busca aguarda uma pausa na digitação e volta para a primeira página.
 * - Respostas de consultas antigas são descartadas.
 * - Se a página atual deixar de existir (por exemplo, após uma exclusão),
 *   a listagem passa para a última página disponível.
 */
export function useListagemPaginada<
  TItem,
  TCampo extends string,
  TFiltro extends string = never,
>({
  carregar,
  ordenacaoInicial,
  filtroInicial,
  mensagemErroPadrao,
  habilitado = true,
}: OpcoesListagemPaginada<TItem, TCampo, TFiltro>) {
  const [termoBusca, setTermoBusca] = useState("");
  const buscaAplicada = useValorAtrasado(termoBusca.trim(), ATRASO_BUSCA_MS);
  const [ordenacao, setOrdenacao] = useState(ordenacaoInicial);
  const [filtro, setFiltro] = useState<TFiltro | null>(filtroInicial);
  const [versao, setVersao] = useState(0);

  // A página fica associada à busca em que foi escolhida: quando a busca
  // aplicada muda, a listagem volta automaticamente para a primeira página.
  const [paginaSolicitada, setPaginaSolicitada] = useState({
    pagina: 1,
    busca: "",
  });
  const pagina =
    paginaSolicitada.busca === buscaAplicada ? paginaSolicitada.pagina : 1;

  const chave = [
    pagina,
    buscaAplicada,
    ordenacao.campo,
    ordenacao.direcao,
    filtro ?? "",
    versao,
  ].join("|");

  const [resposta, setResposta] = useState<RespostaListagem<TItem>>({
    chave: null,
    dados: null,
    erro: null,
  });

  useEffect(() => {
    if (!habilitado) {
      return;
    }

    let ativa = true;

    carregar({
      pagina,
      tamanhoPagina: TAMANHO_PAGINA_PADRAO,
      busca: buscaAplicada,
      ordenacao,
      filtro,
    }).then(
      (dados) => {
        if (!ativa) {
          return;
        }

        // A página pedida não existe mais: vai para a última página com registros.
        if (
          dados.items.length === 0 &&
          dados.totalPages > 0 &&
          pagina > dados.totalPages
        ) {
          setPaginaSolicitada({ pagina: dados.totalPages, busca: buscaAplicada });
          return;
        }

        setResposta({ chave, dados, erro: null });
      },
      (error: unknown) => {
        if (ativa) {
          setResposta({
            chave,
            dados: null,
            erro: error instanceof Error ? error.message : mensagemErroPadrao,
          });
        }
      },
    );

    return () => {
      ativa = false;
    };
  }, [
    habilitado,
    carregar,
    chave,
    pagina,
    buscaAplicada,
    ordenacao,
    filtro,
    mensagemErroPadrao,
  ]);

  const carregando = resposta.chave !== chave;

  /**
   * Atualiza o texto digitado; a consulta ocorre após a pausa na digitação.
   */
  function alterarBusca(termo: string) {
    setTermoBusca(termo);
  }

  /**
   * Solicita a página informada mantendo busca, ordenação e filtro.
   */
  function irParaPagina(novaPagina: number) {
    setPaginaSolicitada({ pagina: Math.max(1, novaPagina), busca: buscaAplicada });
  }

  /**
   * Ordena pela coluna informada e volta para a primeira página.
   */
  function ordenarPor(campo: TCampo) {
    setOrdenacao((atual) => alternarOrdenacao(atual, campo));
    setPaginaSolicitada({ pagina: 1, busca: buscaAplicada });
  }

  /**
   * Aplica um filtro e volta para a primeira página.
   */
  function alterarFiltro(novoFiltro: TFiltro) {
    setFiltro(novoFiltro);
    setPaginaSolicitada({ pagina: 1, busca: buscaAplicada });
  }

  /**
   * Consulta novamente a página atual, por exemplo após salvar ou excluir.
   */
  function recarregar() {
    setVersao((atual) => atual + 1);
  }

  return {
    itens: resposta.dados?.items ?? [],
    totalRegistros: resposta.dados?.totalCount ?? 0,
    totalPaginas: resposta.dados?.totalPages ?? 0,
    pagina,
    tamanhoPagina: TAMANHO_PAGINA_PADRAO,
    possuiDados: resposta.dados !== null,
    carregando,
    erro: carregando ? null : resposta.erro,
    termoBusca,
    buscaAplicada,
    ordenacao,
    filtro,
    alterarBusca,
    irParaPagina,
    ordenarPor,
    alterarFiltro,
    recarregar,
  };
}
