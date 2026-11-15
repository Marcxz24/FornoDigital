import { useMemo, useState } from "react";
import { ProdutoCatalog } from "../components/ProdutoCatalog";
import { ProdutoForm } from "../components/ProdutoForm";
import {
  ProdutoFilters,
  type FiltroProduto,
} from "../components/ProdutoFilters";
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

/**
 * Exibe o catálogo e coordena busca, filtros, edição e disponibilidade.
 * As chamadas HTTP são feitas pelo hook useProdutosData.
 */
export function ListarProdutosPage({
  theme,
  onToggleTheme,
  onNavigate,
}: ListarProdutosPageProps) {
  const {
    produtos,
    editandoId,
    alterandoDisponibilidadeId,
    erroOperacao,
    atualizar,
    alterarDisponibilidade,
    recarregar,
  } = useProdutosData();

  const [termoBusca, setTermoBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroProduto>("todos");
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);

  /**
   * Filtra localmente os produtos já carregados.
   * O estado de estoque zerado só se aplica a produtos com controle de estoque.
   */
  const produtosFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLocaleLowerCase("pt-BR");

    return produtos.data.filter((produto) => {
      const correspondeBusca =
        termo.length === 0 ||
        produto.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
        (produto.descricao ?? "").toLocaleLowerCase("pt-BR").includes(termo);

      const correspondeFiltro = (() => {
        switch (filtroAtivo) {
          case "disponiveis":
            return produto.disponivel;
          case "indisponiveis":
            return !produto.disponivel;
          case "estoque-zerado":
            return (
              produto.controlaEstoque &&
              (produto.quantidadeEstoque ?? 0) <= 0
            );
          case "todos":
          default:
            return true;
        }
      })();

      return correspondeBusca && correspondeFiltro;
    });
  }, [produtos.data, termoBusca, filtroAtivo]);

  /**
   * Envia os dados editáveis à API. A disponibilidade é excluída porque
   * possui uma ação e uma rota próprias no Back-End.
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
   * Fecha o formulário após a API confirmar a edição e atualiza a interface.
   */
  function concluirEdicao(produto: Produto) {
    setProdutoEmEdicao(null);
    void notificar("success", `Produto ${produto.nome} atualizado.`);
  }

  /**
   * Confirma a ação antes de alterar a disponibilidade e mostra o resultado.
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
          erroApi={erroOperacao}
          onSubmit={salvarEdicao}
          onSuccess={concluirEdicao}
          onCancel={() => setProdutoEmEdicao(null)}
        />
      ) : (
        <section className="panel product-catalog-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Vitrine</p>
              <h2>Catálogo completo</h2>
            </div>

            <span className="product-catalog-count">
              {produtos.loading
                ? "Carregando..."
                : `${produtos.data.length} ${
                    produtos.data.length === 1 ? "produto" : "produtos"
                  }`}
            </span>
          </div>

          <ProdutoFilters
            termoBusca={termoBusca}
            filtroAtivo={filtroAtivo}
            onTermoBuscaChange={setTermoBusca}
            onFiltroChange={setFiltroAtivo}
          />

          <ProdutoCatalog
            produtos={produtosFiltrados}
            totalProdutos={produtos.data.length}
            carregando={produtos.loading}
            erro={produtos.error}
            onRecarregar={recarregar}
            onEditar={setProdutoEmEdicao}
            onAlternarDisponibilidade={alternarDisponibilidade}
            produtoEmOperacaoId={alterandoDisponibilidadeId}
          />
        </section>
      )}
    </main>
  );
}