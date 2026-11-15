import { useState, type FormEvent } from "react";
import { notificar } from "../../../shared/utils/notificacoes";
import type { PeriodoIndicadores } from "../types/indicadores";
import {
  criarPeriodoMesAtual,
  criarPeriodoUltimosDias,
  validarPeriodo,
} from "../utils/periodo";

interface FiltroPeriodoProps {
  periodo: PeriodoIndicadores;
  desabilitado: boolean;
  onAplicar: (periodo: PeriodoIndicadores) => void;
}

/**
 * Permite escolher o período dos indicadores por atalhos ou por datas.
 * As datas digitadas só são consultadas ao clicar em "Aplicar".
 */
export function FiltroPeriodo({
  periodo,
  desabilitado,
  onAplicar,
}: FiltroPeriodoProps) {
  const [dataInicial, setDataInicial] = useState(periodo.dataInicial);
  const [dataFinal, setDataFinal] = useState(periodo.dataFinal);

  /**
   * Preenche os campos com o período do atalho e consulta imediatamente.
   */
  function aplicarAtalho(novoPeriodo: PeriodoIndicadores) {
    setDataInicial(novoPeriodo.dataInicial);
    setDataFinal(novoPeriodo.dataFinal);
    onAplicar(novoPeriodo);
  }

  /**
   * Valida as datas digitadas e aplica o período.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novoPeriodo = { dataInicial, dataFinal };
    const erro = validarPeriodo(novoPeriodo);

    if (erro) {
      void notificar("warning", erro);
      return;
    }

    onAplicar(novoPeriodo);
  }

  return (
    <form
      className="indicadores-filtro"
      onSubmit={handleSubmit}
      aria-label="Período dos indicadores"
      noValidate
    >
      <div className="indicadores-atalhos">
        <button
          className="product-filter-button"
          type="button"
          onClick={() => aplicarAtalho(criarPeriodoUltimosDias(7))}
          disabled={desabilitado}
        >
          Últimos 7 dias
        </button>
        <button
          className="product-filter-button"
          type="button"
          onClick={() => aplicarAtalho(criarPeriodoUltimosDias(30))}
          disabled={desabilitado}
        >
          Últimos 30 dias
        </button>
        <button
          className="product-filter-button"
          type="button"
          onClick={() => aplicarAtalho(criarPeriodoMesAtual())}
          disabled={desabilitado}
        >
          Este mês
        </button>
      </div>

      <div className="indicadores-datas">
        <label className="indicadores-campo-data">
          De
          <input
            type="date"
            value={dataInicial}
            max={dataFinal || undefined}
            onChange={(event) => setDataInicial(event.target.value)}
          />
        </label>

        <label className="indicadores-campo-data">
          Até
          <input
            type="date"
            value={dataFinal}
            min={dataInicial || undefined}
            onChange={(event) => setDataFinal(event.target.value)}
          />
        </label>

        <button
          className="sale-primary-button"
          type="submit"
          disabled={desabilitado}
        >
          Aplicar
        </button>
      </div>
    </form>
  );
}
