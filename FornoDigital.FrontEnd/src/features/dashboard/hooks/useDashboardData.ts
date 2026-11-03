import { useEffect, useState } from "react";
import { listarClientes } from "../../../infrastructure/api/clientesApi";
import { listarProdutos } from "../../../infrastructure/api/produtosApi";
import type { Cliente } from "../../clientes/types/cliente";
import type { Produto } from "../../produtos/types/produto";

/**
 * Define a estrutura de estado genérica para o gerenciamento de carregamento, 
 * dados e erros de uma seção da aplicação.
 */
type SectionState<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
};

/**
 * Função utilitária para extrair uma mensagem de texto amigável a partir de um erro desconhecido.
 * 
 * @param error O objeto de erro capturado no bloco catch ou reject.
 * @returns A mensagem de erro extraída ou uma mensagem padrão.
 */
function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado ao carregar os dados.";
}

/**
 * Hook personalizado (<see cref="useDashboardData"/>) responsável por buscar e gerenciar de forma assíncrona 
 * os dados consolidados do dashboard (clientes e produtos), lidando com estados de carregamento, falhas e prevenção de race conditions.
 */
export function useDashboardData() {
  // Estado local para gerenciar o carregamento e os dados dos clientes
  const [clientes, setClientes] = useState<SectionState<Cliente>>({
    data: [],
    loading: true,
    error: null,
  });

  // Estado local para gerenciar o carregamento e os dados dos produtos
  const [produtos, setProdutos] = useState<SectionState<Produto>>({
    data: [],
    loading: true,
    error: null,
  });

  // Efeito para carregar os dados das APIs de clientes e produtos ao montar o componente
  useEffect(() => {
    let active = true;

    // Requisição assíncrona para buscar a listagem de clientes
    listarClientes().then(
      (data) => {
        if (active) {
          setClientes({ data, loading: false, error: null });
        }
      },
      (error: unknown) => {
        if (active) {
          setClientes({
            data: [],
            loading: false,
            error: getErrorMessage(error),
          });
        }
      },
    );

    // Requisição assíncrona para buscar a listagem de produtos
    listarProdutos().then(
      (data) => {
        if (active) {
          setProdutos({ data, loading: false, error: null });
        }
      },
      (error: unknown) => {
        if (active) {
          setProdutos({
            data: [],
            loading: false,
            error: getErrorMessage(error),
          });
        }
      },
    );

    // Função de limpeza (cleanup) para evitar atualizações de estado em componentes desmontados (Memory Leaks / Race Conditions)
    return () => {
      active = false;
    };
  }, []);

  return { clientes, produtos };
}