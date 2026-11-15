import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Produto } from "../../produtos/types/produto";
import { formatCurrency } from "../../../shared/utils/formatCurrency";
import { formatUnidadeMedida } from "../../../shared/utils/unidadeMedida";

interface ProductSearchProps {
  produtos: Produto[];
  onSelectProduto: (produto: Produto) => void;
}

const formatarQuantidade = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 3,
});

/**
 * Normaliza texto de nomes, ignorando acentos e diferenças entre maiúsculas
 * e minúsculas para facilitar a busca digitada.
 */
function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

/**
 * Normaliza espaços e capitalização do código apenas para comparação.
 * Mantém o valor como texto e preserva zeros à esquerda.
 */
function normalizarCodigoBarras(codigo: string): string {
  return codigo.trim().toLocaleUpperCase("pt-BR");
}

/**
 * Permite localizar produtos disponíveis pelo nome ou código de barras.
 * Uma correspondência exata do código tem prioridade sobre os demais resultados.
 */
export function ProductSearch({
  produtos,
  onSelectProduto,
}: ProductSearchProps) {
  const [busca, setBusca] = useState("");
  const campoBuscaRef = useRef<HTMLInputElement>(null);

  /**
   * Mantém apenas produtos disponíveis e com estoque positivo quando
   * o controle de estoque está habilitado.
   */
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

  /**
   * Procura primeiro por código exato. Sem correspondência exata,
   * retorna até oito resultados por nome ou trecho de código.
   */
  const resultados = useMemo(() => {
    const termoNome = normalizarTexto(busca);
    const termoCodigo = normalizarCodigoBarras(busca);

    if (!termoNome || !termoCodigo) {
      return [];
    }

    const correspondenciasExatas = produtosDisponiveis.filter((produto) =>
      produto.codigosBarras.some(
        (codigo) => normalizarCodigoBarras(codigo) === termoCodigo,
      ),
    );

    if (correspondenciasExatas.length > 0) {
      return correspondenciasExatas.slice(0, 8);
    }

    return produtosDisponiveis
      .filter(
        (produto) =>
          normalizarTexto(produto.nome).includes(termoNome) ||
          produto.codigosBarras.some((codigo) =>
            normalizarCodigoBarras(codigo).includes(termoCodigo),
          ),
      )
      .slice(0, 8);
  }, [busca, produtosDisponiveis]);

  /**
   * Adiciona o produto escolhido ao carrinho e limpa a busca.
   */
  function selecionarProduto(produto: Produto) {
    onSelectProduto(produto);
    setBusca("");
    campoBuscaRef.current?.focus();
  }

  /**
 * Intercepta Enter para evitar que a leitura envie o formulário da venda.
 * Seleciona um código exato ou o primeiro resultado correspondente ao nome.
 */
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const termoNome = normalizarTexto(busca);
    const termoCodigo = normalizarCodigoBarras(busca);

    if (!termoNome || !termoCodigo) {
      return;
    }

    const produtoPorCodigoExato = produtosDisponiveis.find((produto) =>
      produto.codigosBarras.some(
        (codigo) => normalizarCodigoBarras(codigo) === termoCodigo,
      ),
    );

    const produtoPorNome = produtosDisponiveis.find((produto) =>
      normalizarTexto(produto.nome).includes(termoNome),
    );

    const produtoSelecionado = produtoPorCodigoExato ?? produtoPorNome;

    if (produtoSelecionado) {
      selecionarProduto(produtoSelecionado);
    }
  }

  return (
    <section className="product-search" aria-labelledby="product-search-title">
      <div className="product-search-heading">
        <p className="eyebrow">PDV</p>
        <h2 id="product-search-title">Buscar produto</h2>
        <p className="product-search-description">
          Digite o nome ou leia o código de barras para localizar o produto.
        </p>
      </div>

      <label className="product-search-field" htmlFor="product-search-input">
        Nome ou código de barras
        <input
          id="product-search-input"
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nome do produto ou código"
          autoComplete="off"
          aria-controls="product-search-results"
          aria-expanded={busca.trim().length > 0}
          ref={campoBuscaRef}
        />
      </label>

      {busca.trim().length > 0 && resultados.length > 0 && (
        <ul
          className="product-search-results"
          id="product-search-results"
          aria-label="Produtos encontrados"
        >
          {resultados.map((produto) => {
            const quantidadeEstoque = produto.quantidadeEstoque ?? 0;
            const situacaoEstoque = produto.controlaEstoque
              ? `Em estoque: ${formatarQuantidade.format(quantidadeEstoque)}`
              : "Estoque não controlado";

            return (
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
                      {formatUnidadeMedida(produto.unidadeMedida)}
                      {" · Disponível · "}
                      {situacaoEstoque}
                    </span>
                  </span>

                  <span className="product-search-result-price">
                    {formatCurrency(produto.preco)}
                  </span>
                </button>
              </li>
            );
          })}
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