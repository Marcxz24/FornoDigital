import { useRef, useState, type FormEvent } from "react";
import type { Cliente } from "../../clientes/types/cliente";
import type { Produto } from "../../produtos/types/produto";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { notificar } from "../../../shared/utils/notificacoes";
import { ProductSearch } from "./ProductSearch";
import { SaleCart, type ItemCarrinho } from "./SaleCart";
import { SaleSummary } from "./SaleSummary";
import type {
  RegistrarVendaRequest,
  Venda,
} from "../types/venda";

interface NewSaleFormProps {
  clientes: Cliente[];
  clientesLoading: boolean;
  clientesError: string | null;
  produtos: Produto[];
  produtosLoading: boolean;
  produtosError: string | null;
  registrando: boolean;
  onRegistrar: (request: RegistrarVendaRequest) => Promise<Venda>;
  onSuccess: (venda: Venda) => void;
  onCancel: () => void;
}

/**
 * Apresenta o formulário de venda, calcula estimativas e coordena
 * a seleção de produtos antes de enviar a requisição ao componente responsável.
 */
export function NewSaleForm({
  clientes,
  clientesLoading,
  clientesError,
  produtos,
  produtosLoading,
  produtosError,
  registrando,
  onRegistrar,
  onSuccess,
  onCancel,
}: NewSaleFormProps) {
  const [clienteId, setClienteId] = useState("");
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([]);
  const [desconto, setDesconto] = useState("0");
  const submissaoEmAndamento = useRef(false);

  const produtosDisponiveis = produtos.filter(
    (produto) =>
      produto.disponivel &&
      (!produto.controlaEstoque || (produto.quantidadeEstoque ?? 0) > 0),
  );

  const subtotalEstimado = itensCarrinho.reduce((subtotal, item) => {
    const quantidade = Number(item.quantidade);

    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      return subtotal;
    }

    return subtotal + item.produto.preco * quantidade;
  }, 0);

  const quantidadeTotal = itensCarrinho.reduce((total, item) => {
    const quantidade = Number(item.quantidade);

    return Number.isFinite(quantidade) && quantidade > 0
      ? total + quantidade
      : total;
  }, 0);

  const descontoNumerico = Number(desconto);
  const descontoValido =
    Number.isFinite(descontoNumerico) && descontoNumerico >= 0;
  const totalEstimado = descontoValido
    ? Math.max(0, subtotalEstimado - descontoNumerico)
    : 0;

  /**
   * Adiciona um produto ao carrinho ou incrementa sua quantidade.
   * Quando há controle de estoque, não permite ultrapassar a quantidade disponível.
   * A verificação ocorre fora do atualizador de estado para que a notificação
   * seja exibida uma única vez.
   */
  function adicionarProduto(produto: Produto) {
    const itemExistente = itensCarrinho.find(
      (item) => item.produto.id === produto.id,
    );

    if (!itemExistente) {
      setItensCarrinho((atuais) => [...atuais, { produto, quantidade: "1" }]);
      return;
    }

    const quantidadeAtual = Number(itemExistente.quantidade);
    const quantidadeNova =
      (Number.isFinite(quantidadeAtual) ? quantidadeAtual : 0) + 1;
    const estoqueMaximo = produto.controlaEstoque
      ? produto.quantidadeEstoque ?? 0
      : null;

    if (estoqueMaximo !== null && quantidadeNova > estoqueMaximo) {
      void notificar(
        "warning",
        `Não há estoque suficiente para adicionar mais "${produto.nome}".`,
      );
      return;
    }

    setItensCarrinho((atuais) =>
      atuais.map((item) =>
        item.produto.id === produto.id
          ? { ...item, quantidade: String(quantidadeNova) }
          : item,
      ),
    );
  }

  /**
   * Atualiza a quantidade digitada para o produto correspondente.
   */
  function alterarQuantidade(produtoId: string, quantidade: string) {
    setItensCarrinho((atuais) =>
      atuais.map((item) =>
        item.produto.id === produtoId ? { ...item, quantidade } : item,
      ),
    );
  }

  /**
   * Remove do carrinho o produto identificado pelo ID.
   */
  function removerProduto(produtoId: string) {
    setItensCarrinho((atuais) =>
      atuais.filter((item) => item.produto.id !== produtoId),
    );
  }

  /**
   * Valida os dados e envia a venda. A trava impede envios repetidos;
   * após confirmação da API, limpa carrinho, cliente e desconto.
   * As falhas de validação são apresentadas com notificações SweetAlert2.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (registrando || submissaoEmAndamento.current) {
      return;
    }

    if (produtosLoading || produtosError !== null) {
      void notificar(
        "warning",
        "Aguarde o carregamento dos produtos antes de registrar.",
      );
      return;
    }

    if (itensCarrinho.length === 0) {
      void notificar("warning", "Adicione pelo menos um produto à venda.");
      return;
    }

    if (!descontoValido) {
      void notificar("warning", "Informe um desconto igual ou maior que zero.");
      return;
    }

    const itens: RegistrarVendaRequest["itens"] = [];

    for (const item of itensCarrinho) {
      const quantidade = Number(item.quantidade);

      if (!Number.isFinite(quantidade) || quantidade <= 0) {
        void notificar(
          "warning",
          `Informe uma quantidade maior que zero para "${item.produto.nome}".`,
        );
        return;
      }

      if (
        item.produto.controlaEstoque &&
        quantidade > (item.produto.quantidadeEstoque ?? 0)
      ) {
        void notificar(
          "warning",
          `A quantidade de "${item.produto.nome}" excede o estoque disponível.`,
        );
        return;
      }

      itens.push({
        produtoId: item.produto.id,
        quantidade,
      });
    }

    const request: RegistrarVendaRequest = {
      clienteId: clienteId || null,
      itens,
      desconto: descontoNumerico,
    };

    submissaoEmAndamento.current = true;

    try {
      const vendaRegistrada = await onRegistrar(request);

      setClienteId("");
      setItensCarrinho([]);
      setDesconto("0");

      onSuccess(vendaRegistrada);
    } catch {
      // A página apresenta a falha usando uma notificação SweetAlert2.
      // A venda permanece preenchida para permitir uma nova tentativa.
    } finally {
      submissaoEmAndamento.current = false;
    }
  }

  return (
    <form className="pos-layout" onSubmit={handleSubmit} noValidate>
      <div className="pos-main-column">
        <div className="panel pos-product-panel">
          {produtosLoading ? (
            <LoadingState message="Carregando produtos..." />
          ) : produtosError ? (
            <ErrorState
              message={`Não foi possível carregar produtos: ${produtosError}`}
            />
          ) : produtosDisponiveis.length === 0 ? (
            <EmptyState message="Não há produtos disponíveis para venda." />
          ) : (
            <ProductSearch
              produtos={produtosDisponiveis}
              onSelectProduto={adicionarProduto}
            />
          )}
        </div>

        <div className="panel pos-cart-panel">
          <SaleCart
            itens={itensCarrinho}
            onAlterarQuantidade={alterarQuantidade}
            onRemoverProduto={removerProduto}
          />
        </div>
      </div>

      <SaleSummary
        clientes={clientes}
        clientesLoading={clientesLoading}
        clientesError={clientesError}
        clienteId={clienteId}
        onClienteChange={setClienteId}
        desconto={desconto}
        onDescontoChange={setDesconto}
        quantidadeItens={quantidadeTotal}
        subtotalEstimado={subtotalEstimado}
        totalEstimado={totalEstimado}
        registrando={registrando}
        submitDesabilitado={
          itensCarrinho.length === 0 ||
          produtosLoading ||
          produtosError !== null ||
          produtosDisponiveis.length === 0
        }
        onCancel={onCancel}
      />
    </form>
  );
}