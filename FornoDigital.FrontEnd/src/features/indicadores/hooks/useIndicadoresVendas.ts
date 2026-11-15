import { useEffect, useState } from "react";
import { obterIndicadoresVendas } from "../../../infrastructure/api/indicadoresApi";
import type {
  IndicadoresVendas,
  PeriodoIndicadores,
} from "../types/indicadores";
import { criarPeriodoUltimosDias } from "../utils/periodo";

/**
 * Quantidade de produtos no ranking e nas linhas do gráfico diário.
 */
export const LIMITE_PRODUTOS = 5;

interface RespostaIndicadores {
  /** Identifica o período e a versão que produziram esta resposta. */
  chave: string | null;
  dados: IndicadoresVendas | null;
  erro: string | null;
}

/**
 * Mantém o período selecionado e consulta os indicadores na API sempre que ele muda.
 * Respostas de consultas antigas são descartadas.
 */
export function useIndicadoresVendas() {
  const [periodo, setPeriodo] = useState<PeriodoIndicadores>(() =>
    criarPeriodoUltimosDias(30),
  );
  const [versao, setVersao] = useState(0);
  const [resposta, setResposta] = useState<RespostaIndicadores>({
    chave: null,
    dados: null,
    erro: null,
  });

  const chave = `${periodo.dataInicial}|${periodo.dataFinal}|${versao}`;

  useEffect(() => {
    let ativa = true;

    obterIndicadoresVendas(periodo, LIMITE_PRODUTOS).then(
      (dados) => {
        if (ativa) {
          setResposta({ chave, dados, erro: null });
        }
      },
      (error: unknown) => {
        if (ativa) {
          setResposta({
            chave,
            dados: null,
            erro:
              error instanceof Error
                ? error.message
                : "Não foi possível carregar os indicadores.",
          });
        }
      },
    );

    return () => {
      ativa = false;
    };
  }, [chave, periodo]);

  const carregando = resposta.chave !== chave;

  return {
    periodo,
    dados: resposta.dados,
    carregando,
    erro: carregando ? null : resposta.erro,
    aplicarPeriodo: setPeriodo,
    recarregar: () => setVersao((atual) => atual + 1),
  };
}
