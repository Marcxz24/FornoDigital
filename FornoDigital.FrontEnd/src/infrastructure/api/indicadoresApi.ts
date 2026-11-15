import type {
  IndicadoresVendas,
  PeriodoIndicadores,
} from "../../features/indicadores/types/indicadores";
import { montarQueryString } from "../../shared/utils/paginacao";
import { getJson } from "./httpClient";

/**
 * Busca os indicadores de vendas do período. Os valores são agregados pela API.
 */
export function obterIndicadoresVendas(
  periodo: PeriodoIndicadores,
  limiteProdutos: number,
): Promise<IndicadoresVendas> {
  const query = montarQueryString({
    dataInicial: periodo.dataInicial,
    dataFinal: periodo.dataFinal,
    limiteProdutos,
  });

  return getJson<IndicadoresVendas>(`/api/indicadores/vendas${query}`);
}
