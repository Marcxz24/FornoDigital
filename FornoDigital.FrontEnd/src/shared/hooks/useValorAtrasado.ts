import { useEffect, useState } from "react";

/**
 * Retorna o valor recebido somente depois que ele permanece igual pelo tempo indicado.
 * Usado para aguardar a pausa na digitação antes de consultar a API.
 */
export function useValorAtrasado<T>(valor: T, atrasoMs: number): T {
  const [valorAtrasado, setValorAtrasado] = useState(valor);

  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      setValorAtrasado(valor);
    }, atrasoMs);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [valor, atrasoMs]);

  return valorAtrasado;
}
