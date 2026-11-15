import type { PeriodoIndicadores } from "../types/indicadores";

/**
 * Maior intervalo aceito pela API, em dias (inclui o dia inicial e o final).
 */
export const MAXIMO_DIAS_PERIODO = 366;

/**
 * Formata uma data local como yyyy-MM-dd, sem converter para UTC.
 */
export function formatarDataIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

/**
 * Converte yyyy-MM-dd em uma data local à meia-noite.
 */
export function lerDataIso(valor: string): Date {
  const [ano, mes, dia] = valor.split("-").map(Number);

  return new Date(ano, mes - 1, dia);
}

/**
 * Formata yyyy-MM-dd como dd/MM para os eixos dos gráficos.
 */
export function formatarDiaMes(valor: string): string {
  const [, mes, dia] = valor.split("-");

  return `${dia}/${mes}`;
}

/**
 * Retorna o período dos últimos dias informados, terminando hoje.
 */
export function criarPeriodoUltimosDias(dias: number): PeriodoIndicadores {
  const hoje = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - (dias - 1));

  return { dataInicial: formatarDataIso(inicio), dataFinal: formatarDataIso(hoje) };
}

/**
 * Retorna o período do primeiro dia do mês atual até hoje.
 */
export function criarPeriodoMesAtual(): PeriodoIndicadores {
  const hoje = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  return { dataInicial: formatarDataIso(inicio), dataFinal: formatarDataIso(hoje) };
}

/**
 * Valida o período antes de consultar a API.
 * Retorna a mensagem do problema encontrado ou null quando o período é válido.
 */
export function validarPeriodo(periodo: PeriodoIndicadores): string | null {
  if (!periodo.dataInicial || !periodo.dataFinal) {
    return "Informe a data inicial e a data final.";
  }

  const inicio = lerDataIso(periodo.dataInicial);
  const fim = lerDataIso(periodo.dataFinal);

  if (inicio > fim) {
    return "A data inicial não pode ser maior que a data final.";
  }

  const dias = Math.round((fim.getTime() - inicio.getTime()) / 86_400_000) + 1;

  if (dias > MAXIMO_DIAS_PERIODO) {
    return `O período pode ter no máximo ${MAXIMO_DIAS_PERIODO} dias.`;
  }

  return null;
}
