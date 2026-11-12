import { useState, type FormEvent } from "react";
import type { Cliente } from "../../clientes/types/cliente";
import type { Produto } from "../../produtos/types/produto";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
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
  erroRegistro: string | null;
  onRegistrar: (request: RegistrarVendaRequest) => Promise<Venda>;
  onSuccess: (venda: Venda) => void;
  onCancel: () => void;
}

export function NewSaleForm({
  clientes,
  clientesLoading,
  clientesError,
  produtos,
  produtosLoading,
  produtosError,
  registrando,
  erroRegistro,
  onRegistrar,
  onSuccess,
  onCancel,
}: NewSaleFormProps) {
  const [clienteId, setClienteId] = useState("");
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([]);
  const [desconto, setDesconto] = useState("0");
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);

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

  function adicionarProduto(produto: Produto) {
    setErroFormulario(null);

    setItensCarrinho((atuais) => {
      const itemExistente = atuais.find(
        (item) => item.produto.id === produto.id,
      );

      if (!itemExistente) {
        return [...atuais, { produto, quantidade: "1" }];
      }

      const quantidadeAtual = Number(itemExistente.quantidade);
      const quantidadeNova =
        (Number.isFinite(quantidadeAtual) ? quantidadeAtual : 0) + 1;
      const estoqueMaximo = produto.controlaEstoque
        ? produto.quantidadeEstoque ?? 0
        : null;

      if (estoqueMaximo !== null && quantidadeNova > estoqueMaximo) {
        setErroFormulario(
          `Não há estoque suficiente para adicionar mais "${produto.nome}".`,
        );
        return atuais;
      }

      return atuais.map((item) =>
        item.produto.id === produto.id
          ? { ...item, quantidade: String(quantidadeNova) }
          : item,
      );
    });
  }

  function alterarQuantidade(produtoId: string, quantidade: string) {
    setErroFormulario(null);
    setItensCarrinho((atuais) =>
      atuais.map((item) =>
        item.produto.id === produtoId ? { ...item, quantidade } : item,
      ),
    );
  }

  function removerProduto(produtoId: string) {
    setErroFormulario(null);
    setItensCarrinho((atuais) =>
      atuais.filter((item) => item.produto.id !== produtoId),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroFormulario(null);

    if (produtosLoading || produtosError !== null) {
      setErroFormulario("Aguarde o carregamento dos produtos antes de registrar.");
      return;
    }

    if (itensCarrinho.length === 0) {
      setErroFormulario("Adicione pelo menos um produto à venda.");
      return;
    }

    if (!descontoValido) {
      setErroFormulario("Informe um desconto igual ou maior que zero.");
      return;
    }

    const itens: RegistrarVendaRequest["itens"] = [];

    for (const item of itensCarrinho) {
      const quantidade = Number(item.quantidade);

      if (!Number.isFinite(quantidade) || quantidade <= 0) {
        setErroFormulario(
          `Informe uma quantidade maior que zero para "${item.produto.nome}".`,
        );
        return;
      }

      if (
        item.produto.controlaEstoque &&
        quantidade > (item.produto.quantidadeEstoque ?? 0)
      ) {
        setErroFormulario(
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

    try {
      const vendaRegistrada = await onRegistrar(request);
      onSuccess(vendaRegistrada);
    } catch {
      // A mensagem de erro da API é exibida por erroRegistro.
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
        erroFormulario={erroFormulario}
        erroRegistro={erroRegistro}
        onCancel={onCancel}
      />
    </form>
  );
}