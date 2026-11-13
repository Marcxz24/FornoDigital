import { useMemo, useState } from "react";
import { ProdutoCatalog } from "../components/ProdutoCatalog";
import {
  ProdutoFilters,
  type FiltroProduto,
} from "../components/ProdutoFilters";
import { useProdutosData } from "../hooks/useProdutosData";

type TemaProduto = "light" | "dark";

interface ListarProdutosPageProps {
  theme: TemaProduto;
  onToggleTheme: () => void;
  onNavigate: (pagina: "cadastrar-produto") => void;
}

/**
 * Exibe o catálogo completo e coordena busca, filtros e carregamento dos produtos.
 */
export function ListarProdutosPage({
  theme,
  onToggleTheme,
  onNavigate,
}: ListarProdutosPageProps) {
  const { produtos, recarregar } = useProdutosData();
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroProduto>("todos");

  /**
   * Filtra localmente os produtos já carregados.
   * Disponibilidade segue o campo da API; estoque zerado só se aplica
   * a produtos com controle de estoque ativo.
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

  return (
    <main className="dashboard products-page">
      <header className="dashboard-header">
        <div className="brand-mark" aria-hidden="true">
          <span>F</span>
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

          <button
            className="sale-primary-button"
            type="button"
            onClick={() => onNavigate("cadastrar-produto")}
          >
            Novo Produto
          </button>
        </div>
      </header>

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
        />
      </section>
    </main>
  );
}