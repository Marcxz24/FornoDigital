import { useEffect, useState } from "react";
import {
  listarClientes,
} from "../../../infrastructure/api/clientesApi";
import {
  listarProdutos,
} from "../../../infrastructure/api/produtosApi";
import {
  listarVendas,
  registrarVenda as enviarVenda,
} from "../../../infrastructure/api/vendasApi";
import type { Cliente } from "../../clientes/types/cliente";
import type { Produto } from "../../produtos/types/produto";
import type {
  RegistrarVendaRequest,
  Venda,
} from "../types/venda";

interface SecaoState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

function criarEstadoInicial<T>(): SecaoState<T> {
  return {
    data: [],
    loading: true,
    error: null,
  };
}

function obterMensagemErro(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado ao carregar os dados.";
}

function carregarSecao<T>(
  buscarDados: () => Promise<T[]>,
  atualizarEstado: (state: SecaoState<T>) => void,
  estaAtivo: () => boolean,
): void {
  void buscarDados().then(
    (data) => {
      if (estaAtivo()) {
        atualizarEstado({
          data,
          loading: false,
          error: null,
        });
      }
    },
    (error: unknown) => {
      if (estaAtivo()) {
        atualizarEstado({
          data: [],
          loading: false,
          error: obterMensagemErro(error),
        });
      }
    },
  );
}

export function useVendasData() {
  const [vendas, setVendas] = useState<SecaoState<Venda>>(
    criarEstadoInicial,
  );
  const [clientes, setClientes] = useState<SecaoState<Cliente>>(
    criarEstadoInicial,
  );
  const [produtos, setProdutos] = useState<SecaoState<Produto>>(
    criarEstadoInicial,
  );
  const [registrando, setRegistrando] = useState(false);
  const [erroRegistro, setErroRegistro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    const estaAtivo = () => ativo;

    carregarSecao(listarVendas, setVendas, estaAtivo);
    carregarSecao(listarClientes, setClientes, estaAtivo);
    carregarSecao(listarProdutos, setProdutos, estaAtivo);

    return () => {
      ativo = false;
    };
  }, []);

  async function registrarNovaVenda(
    request: RegistrarVendaRequest,
  ): Promise<Venda> {
    setRegistrando(true);
    setErroRegistro(null);

    try {
      const vendaRegistrada = await enviarVenda(request);

      setVendas((estadoAtual) => ({
        ...estadoAtual,
        data: [
          vendaRegistrada,
          ...estadoAtual.data.filter(
            (venda) => venda.Id !== vendaRegistrada.Id,
          ),
        ],
      }));

      return vendaRegistrada;
    } catch (error: unknown) {
      const mensagem = obterMensagemErro(error);
      setErroRegistro(mensagem);
      throw error;
    } finally {
      setRegistrando(false);
    }
  }

  return {
    vendas,
    clientes,
    produtos,
    registrando,
    erroRegistro,
    registrarNovaVenda,
  };
}