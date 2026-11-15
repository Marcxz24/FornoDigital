import { useState } from "react";
import { ProdutoCatalog } from "../components/ProdutoCatalog";
import { ProdutoForm } from "../components/ProdutoForm";
import { ProdutoFilters } from "../components/ProdutoFilters";
import { useProdutosData } from "../hooks/useProdutosData";
import type { Produto, ProdutoRequest } from "../types/produto";
import {
  confirmarAcao,
  notificar,
} from "../../../shared/utils/notificacoes";

type TemaProduto = "light" | "dark";

interface ListarProdutosPageProps {
  theme: TemaProduto;
  onToggleTheme: () => void;
  onNavigate: (pagina: "cadastrar-produto") => void;
}

const formatarNumero = new Intl.NumberFormat("pt-BR");

/**
 * Exibe o catálogo paginado e coordena busca, filtros, edição, disponibilidade
 * e remoção individual de códigos de barras (feita no formulário de edição).
 */
export function ListarProdutosPage({
  theme,
  onToggleTheme,
  onNavigate,
}: ListarProdutosPageProps) {
  const {
    catalogo,
    editandoId,
    alterandoDisponibilidadeId,
    codigoBarrasEmRemocao,
    atualizar,
    alterarDisponibilidade,
    removerCodigoBarras: removerCodigoBarrasDaApi,
  } = useProdutosData();

  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);

  const buscaOuFiltroAtivo =
    catalogo.buscaAplicada !== "" || catalogo.filtro !== "todos";

  /**
   * Envia à API os campos editáveis, incluindo a coleção de códigos.
   * A disponibilidade continua sendo alterada pela ação própria do catálogo.
   */
  async function salvarEdicao(request: ProdutoRequest): Promise<Produto> {
    if (!produtoEmEdicao) {
      throw new Error("Selecione um produto para editar.");
    }

    try {
      return await atualizar(produtoEmEdicao.id, {
        nome: request.nome,
        descricao: request.descricao,
        preco: request.preco,
        unidadeMedida: request.unidadeMedida,
        controlaEstoque: request.controlaEstoque,
        quantidadeEstoque: request.quantidadeEstoque,
        codigosBarras: request.codigosBarras,
      });
    } catch (error: unknown) {
      void notificar(
        "error",
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o produto.",
      );
      throw error;
    }
  }

  /**
   * Fecha o formulário depois que a API confirmar a edição.
   */
  function concluirEdicao(produto: Produto) {
    setProdutoEmEdicao(null);
    void notificar("success", `Produto ${produto.nome} atualizado.`);
  }

  /**
   * Confirma a ação antes de alterar a disponibilidade do produto.
   */
  async function alternarDisponibilidade(produto: Produto) {
    const vaiInativar = produto.disponivel;
    const confirmou = await confirmarAcao(
      vaiInativar ? "Inativar produto?" : "Ativar produto?",
      vaiInativar
        ? `${produto.nome} deixará de estar disponível para venda.`
        : `${produto.nome} ficará disponível para venda.`,
    );

    if (!confirmou) {
      return;
    }

    try {
      const produtoAtualizado = await alterarDisponibilidade(produto.id, {
        disponivel: !produto.disponivel,
      });

      void notificar(
        "success",
        `Produto ${produtoAtualizado.nome} ${
          produtoAtualizado.disponivel ? "ativado" : "inativado"
        } com sucesso.`,
      );
    } catch (error: unknown) {
      void notificar(
        "error",
        error instanceof Error
          ? error.message
          : "Não foi possível alterar a disponibilidade do produto.",
      );
    }
  }

  /**
   * Pede confirmação e remove somente o código selecionado, gravando a remoção
   * imediatamente pela API. O produto continua no catálogo.
   * Retorna true somente quando a API confirma a remoção (HTTP 204).
   */
  async function solicitarRemocaoCodigoBarras(
    produto: Produto,
    codigoBarras: string,
  ): Promise<boolean> {
    const confirmou = await confirmarAcao(
      "Remover código de barras?",
      `O código ${codigoBarras} será removido de ${produto.nome} imediatamente. O produto será mantido.`,
    );

    if (!confirmou) {
      return false;
    }

    try {
      await removerCodigoBarrasDaApi(produto.id, codigoBarras);
      void notificar("success", "Código de barras removido.");

      return true;
    } catch (error: unknown) {
      void notificar(
        "error",
        error instanceof Error
          ? error.message
          : "Não foi possível remover o código de barras.",
      );

      return false;
    }
  }

  return (
    <main className="dashboard products-page">
      <header className="dashboard-header">
        <div className="brand-mark" aria-hidden="true">
          <img
            className="brand-mark-image"
            src="/branding/forno-digital-icon.png"
            alt=""
          />
        </div>

        <div className="dashboard-heading">
          <p className="eyebrow">FornoDigital</p>
          <h1>Produtos</h1>
          <p className="dashboard-subtitle">
            Consulte e filtre os produtos do catálogo da padaria.
          </p>
        </div>

        <div className="products-header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Mudar para o tema ${theme === "light" ? "escuro" : "claro"}`}
            aria-pressed={theme === "dark"}
          >
            <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            <span>{theme === "light" ? "Tema escuro" : "Tema claro"}</span>
          </button>

          {!produtoEmEdicao && (
            <button
              className="sale-primary-button"
              type="button"
              onClick={() => onNavigate("cadastrar-produto")}
            >
              Novo Produto
            </button>
          )}
        </div>
      </header>

      {produtoEmEdicao ? (
        <ProdutoForm
          key={produtoEmEdicao.id}
          produto={produtoEmEdicao}
          salvando={editandoId !== null}
          codigoBarrasEmRemocao={codigoBarrasEmRemocao}
          onSubmit={salvarEdicao}
          onSuccess={concluirEdicao}
          onCancel={() => setProdutoEmEdicao(null)}
          onRemoverCodigoBarrasSalvo={(codigoBarras) =>
            solicitarRemocaoCodigoBarras(produtoEmEdicao, codigoBarras)
          }
        />
      ) : (
        <section className="panel product-catalog-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Vitrine</p>
              <h2>Catálogo completo</h2>
            </div>

            <span className="product-catalog-count" aria-live="polite">
              {catalogo.possuiDados
                ? `${formatarNumero.format(catalogo.totalRegistros)} ${
                    catalogo.totalRegistros === 1
                      ? "produto encontrado"
                      : "produtos encontrados"
                  }`
                : "Carregando..."}
            </span>
          </div>

          <ProdutoFilters
            termoBusca={catalogo.termoBusca}
            filtroAtivo={catalogo.filtro ?? "todos"}
            onTermoBuscaChange={catalogo.alterarBusca}
            onFiltroChange={catalogo.alterarFiltro}
          />

          <ProdutoCatalog
            produtos={catalogo.itens}
            totalRegistros={catalogo.totalRegistros}
            pagina={catalogo.pagina}
            totalPaginas={catalogo.totalPaginas}
            tamanhoPagina={catalogo.tamanhoPagina}
            possuiDados={catalogo.possuiDados}
            carregando={catalogo.carregando}
            erro={catalogo.erro}
            buscaOuFiltroAtivo={buscaOuFiltroAtivo}
            ordenacao={catalogo.ordenacao}
            produtoEmOperacaoId={alterandoDisponibilidadeId}
            onOrdenar={catalogo.ordenarPor}
            onMudarPagina={catalogo.irParaPagina}
            onRecarregar={catalogo.recarregar}
            onEditar={setProdutoEmEdicao}
            onAlternarDisponibilidade={alternarDisponibilidade}
          />
        </section>
      )}
    </main>
  );
}