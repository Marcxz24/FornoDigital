import { ProdutoForm } from "../components/ProdutoForm";
import { useProdutosData } from "../hooks/useProdutosData";
import type { Produto, ProdutoRequest } from "../types/produto";
import { notificar } from "../../../shared/utils/notificacoes";

type TemaProduto = "light" | "dark";

interface CadastrarProdutoPageProps {
  theme: TemaProduto;
  onToggleTheme: () => void;
  onNavigate: (pagina: "listar-produtos") => void;
}

/**
 * Reúne o formulário e o estado necessário para cadastrar um produto.
 */
export function CadastrarProdutoPage({
  theme,
  onToggleTheme,
  onNavigate,
}: CadastrarProdutoPageProps) {
  const { salvando, cadastrar } = useProdutosData();

  /**
   * Envia o pedido ao hook. Se a API rejeitar, exibe uma notificação
   * e propaga o erro para que o formulário não trate o cadastro como sucesso.
   */
  async function enviarCadastro(request: ProdutoRequest): Promise<Produto> {
    try {
      return await cadastrar(request);
    } catch (error: unknown) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o produto.";

      void notificar("error", mensagem);
      throw error;
    }
  }

  /**
   * Notifica a confirmação da API e navega para o catálogo.
   */
  function concluirCadastro(produto: Produto) {
    void notificar(
      "success",
      `Produto ${produto.nome} cadastrado com sucesso.`,
    );
    onNavigate("listar-produtos");
  }

  return (
    <main className="dashboard products-page">
      <header className="dashboard-header">
        <div className="brand-mark" aria-hidden="true">
          <span>F</span>
        </div>

        <div className="dashboard-heading">
          <p className="eyebrow">FornoDigital</p>
          <h1>Cadastrar Produto</h1>
          <p className="dashboard-subtitle">
            Adicione um produto ao catálogo da padaria.
          </p>
        </div>

        <button
          className="theme-toggle"
          style={{ marginLeft: "auto" }}
          type="button"
          onClick={onToggleTheme}
          aria-label={`Mudar para o tema ${theme === "light" ? "escuro" : "claro"}`}
          aria-pressed={theme === "dark"}
        >
          <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
          <span>{theme === "light" ? "Tema escuro" : "Tema claro"}</span>
        </button>
      </header>

      <ProdutoForm
        salvando={salvando}
        erroApi={null}
        onSubmit={enviarCadastro}
        onSuccess={concluirCadastro}
        onCancel={() => onNavigate("listar-produtos")}
      />
    </main>
  );
}