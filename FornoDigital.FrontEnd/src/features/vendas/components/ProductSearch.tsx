import { useMemo, useState, type KeyboardEvent } from "react";
import type { Produto } from "../../produtos/types/produto";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

interface ProductSearchProps {
  produtos: Produto[];
  onSelectProduto: (produto: Produto) => void;
}

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function ProductSearch({
  produtos,
  onSelectProduto,
}: ProductSearchProps) {
  const [busca, setBusca] = useState("");

  const produtosDisponiveis = useMemo(
    () =>
      produtos.filter(
        (produto) =>
          produto.disponivel &&
          (!produto.controlaEstoque ||
            (produto.quantidadeEstoque ?? 0) > 0),
      ),
    [produtos],
  );

  const resultados = useMemo(() => {
    const termo = normalizarTexto(busca);

    if (!termo) {
      return [];
    }

    return produtosDisponiveis
      .filter((produto) => normalizarTexto(produto.nome).includes(termo))
      .slice(0, 8);
  }, [busca, produtosDisponiveis]);

  function selecionarProduto(produto: Produto) {
    onSelectProduto(produto);
    setBusca("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && resultados.length > 0) {
      event.preventDefault();
      selecionarProduto(resultados[0]);
    }
  }

  return (
    <section className="product-search" aria-labelledby="product-search-title">
      <div className="product-search-heading">
        <p className="eyebrow">PDV</p>
        <h2 id="product-search-title">Buscar produto</h2>
        <p className="product-search-description">
          Digite o nome do produto para localizar e adicionar ao carrinho.
        </p>
      </div>

      <label className="product-search-field" htmlFor="product-search-input">
        Nome do produto
        <input
          id="product-search-input"
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex.: pão francês"
          autoComplete="off"
          aria-controls="product-search-results"
          aria-expanded={busca.trim().length > 0}
        />
      </label>

      {busca.trim().length > 0 && resultados.length > 0 && (
        <ul
          className="product-search-results"
          id="product-search-results"
          aria-label="Produtos encontrados"
        >
          {resultados.map((produto) => (
            <li key={produto.id}>
              <button
                className="product-search-result"
                type="button"
                onClick={() => selecionarProduto(produto)}
              >
                <span className="product-search-result-info">
                  <span className="product-search-result-name">
                    {produto.nome}
                  </span>
                  <span className="product-search-result-stock">
                    {produto.controlaEstoque
                      ? `Estoque disponível: ${produto.quantidadeEstoque ?? 0}`
                      : "Estoque não controlado"}
                  </span>
                </span>
                <span className="product-search-result-price">
                  {formatCurrency(produto.preco)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {busca.trim().length > 0 && resultados.length === 0 && (
        <p className="product-search-empty" role="status">
          Nenhum produto disponível corresponde a essa busca.
        </p>
      )}
    </section>
  );
}