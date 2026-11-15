import { useState, type FormEvent } from "react";
import type {
  Produto,
  ProdutoRequest,
  UnidadeMedidaCodigo,
} from "../types/produto";
import { ErrorState } from "../../../shared/components/ErrorState";

interface ProdutoFormProps {
  produto: Produto | null;
  salvando: boolean;
  erroApi: string | null;
  onSubmit: (request: ProdutoRequest) => Promise<Produto>;
  onSuccess: (produto: Produto) => void;
  onCancel: () => void;
}

interface ValoresFormulario {
  nome: string;
  descricao: string;
  preco: string;
  unidadeMedida: UnidadeMedidaCodigo;
  disponivel: boolean;
  controlaEstoque: boolean;
  quantidadeEstoque: string;
  codigosBarras: string[];
}

type CampoFormulario = keyof ValoresFormulario;
type ErrosFormulario = Partial<Record<CampoFormulario, string>>;

/**
 * Prepara os campos a partir do produto escolhido.
 * No cadastro inicia valores vazios, disponível e sem códigos de barras.
 */
function criarValoresIniciais(produto: Produto | null): ValoresFormulario {
  return {
    nome: produto?.nome ?? "",
    descricao: produto?.descricao ?? "",
    preco: produto ? produto.preco.toFixed(2).replace(".", ",") : "",
    unidadeMedida:
      produto && produto.unidadeMedida >= 1 && produto.unidadeMedida <= 5
        ? (produto.unidadeMedida as UnidadeMedidaCodigo)
        : 1,
    disponivel: produto?.disponivel ?? true,
    controlaEstoque: produto?.controlaEstoque ?? false,
    quantidadeEstoque:
      produto?.quantidadeEstoque === null ||
      produto?.quantidadeEstoque === undefined
        ? ""
        : String(produto.quantidadeEstoque),
    codigosBarras: produto?.codigosBarras ?? [],
  };
}

/**
 * Converte o preço digitado para número em reais.
 * Aceita vírgula ou ponto decimal, exige valor positivo e até duas casas.
 */
function converterPreco(valor: string): number | null {
  const valorNormalizado = valor.trim().replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(valorNormalizado)) {
    return null;
  }

  const preco = Number(valorNormalizado);

  return Number.isFinite(preco) && preco > 0 ? preco : null;
}

/**
 * Valida os campos antes de enviar o formulário.
 * Códigos vazios e repetidos são indicados visualmente; a API continua
 * responsável pela validação final, inclusive contra códigos já cadastrados.
 */
function validarFormulario(valores: ValoresFormulario): ErrosFormulario {
  const erros: ErrosFormulario = {};
  const preco = converterPreco(valores.preco);
  const codigosBarras = valores.codigosBarras.map((codigo) => codigo.trim());

  if (!valores.nome.trim()) {
    erros.nome = "Informe o nome do produto.";
  } else if (valores.nome.trim().length > 150) {
    erros.nome = "O nome deve ter no máximo 150 caracteres.";
  }

  if (valores.descricao.trim().length > 500) {
    erros.descricao = "A descrição deve ter no máximo 500 caracteres.";
  }

  if (!valores.preco.trim()) {
    erros.preco = "Informe o preço do produto.";
  } else if (preco === null) {
    erros.preco = "Informe um preço positivo com até duas casas decimais.";
  }

  if (valores.controlaEstoque && valores.quantidadeEstoque.trim()) {
    const quantidade = Number(valores.quantidadeEstoque);

    if (!Number.isFinite(quantidade) || quantidade < 0) {
      erros.quantidadeEstoque = "A quantidade deve ser zero ou maior.";
    }
  }

  if (codigosBarras.some((codigo) => codigo.length === 0)) {
    erros.codigosBarras =
      "Preencha ou remova as linhas vazias de código de barras.";
  } else if (new Set(codigosBarras).size !== codigosBarras.length) {
    erros.codigosBarras = "Remova os códigos de barras repetidos.";
  }

  return erros;
}

/**
 * Monta o pedido de cadastro ou edição.
 * Converte valores numéricos e remove espaços externos dos códigos,
 * sem converter os códigos para números nem remover zeros à esquerda.
 */
function criarRequisicao(valores: ValoresFormulario): ProdutoRequest {
  const preco = converterPreco(valores.preco);

  if (preco === null) {
    throw new Error("O preço informado não é válido.");
  }

  const quantidadeEstoque =
    valores.controlaEstoque && valores.quantidadeEstoque.trim()
      ? Number(valores.quantidadeEstoque)
      : null;

  return {
    nome: valores.nome.trim(),
    descricao: valores.descricao.trim() || null,
    preco,
    disponivel: valores.disponivel,
    unidadeMedida: valores.unidadeMedida,
    controlaEstoque: valores.controlaEstoque,
    quantidadeEstoque,
    codigosBarras: valores.codigosBarras.map((codigo) => codigo.trim()),
  };
}

/**
 * Renderiza e valida os dados do produto antes de enviá-los.
 * Se recebeu um produto, preenche os campos para edição; caso contrário,
 * inicia o formulário de cadastro.
 */
export function ProdutoForm({
  produto,
  salvando,
  erroApi,
  onSubmit,
  onSuccess,
  onCancel,
}: ProdutoFormProps) {
  const [valores, setValores] = useState<ValoresFormulario>(() =>
    criarValoresIniciais(produto),
  );
  const [erros, setErros] = useState<ErrosFormulario>({});

  const estaEditando = produto !== null;

  /**
   * Atualiza um campo e remove a mensagem de validação anterior daquele campo.
   */
  function atualizarCampo<K extends CampoFormulario>(
    campo: K,
    valor: ValoresFormulario[K],
  ) {
    setValores((atuais) => ({
      ...atuais,
      [campo]: valor,
    }));

    setErros((atuais) => {
      if (!atuais[campo]) {
        return atuais;
      }

      const novosErros = { ...atuais };
      delete novosErros[campo];

      return novosErros;
    });
  }

  /**
   * Adiciona uma linha de código vazia para preenchimento.
   */
  function adicionarCodigoBarras() {
    atualizarCampo("codigosBarras", [...valores.codigosBarras, ""]);
  }

  /**
   * Atualiza o código da linha indicada sem convertê-lo para número.
   */
  function alterarCodigoBarras(indice: number, codigo: string) {
    const codigosAtualizados = valores.codigosBarras.map(
      (codigoAtual, indiceAtual) =>
        indiceAtual === indice ? codigo : codigoAtual,
    );

    atualizarCampo("codigosBarras", codigosAtualizados);
  }

  /**
   * Remove a linha de código indicada do formulário.
   */
  function removerCodigoBarrasDoFormulario(indice: number) {
    const codigosAtualizados = valores.codigosBarras.filter(
      (_, indiceAtual) => indiceAtual !== indice,
    );

    atualizarCampo("codigosBarras", codigosAtualizados);
  }

  /**
   * Impede envios repetidos, valida os campos e chama o cadastro ou edição.
   * Em caso de falha, mantém os valores para uma nova tentativa.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (salvando) {
      return;
    }

    const errosEncontrados = validarFormulario(valores);
    setErros(errosEncontrados);

    if (Object.keys(errosEncontrados).length > 0) {
      return;
    }

    try {
      const produtoSalvo = await onSubmit(criarRequisicao(valores));
      onSuccess(produtoSalvo);
    } catch {
      // A página apresenta a mensagem retornada pela API em erroApi.
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <section className="panel product-form-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Catálogo</p>
            <h2>{estaEditando ? "Editar produto" : "Novo produto"}</h2>
          </div>
        </div>

        <div className="product-form-grid">
          <label className="product-form-field product-form-field-wide">
            Nome <span aria-hidden="true">*</span>
            <input
              type="text"
              value={valores.nome}
              maxLength={150}
              onChange={(event) => atualizarCampo("nome", event.target.value)}
              aria-invalid={Boolean(erros.nome)}
            />
            {erros.nome && (
              <span className="product-field-error" role="alert">
                {erros.nome}
              </span>
            )}
          </label>

          <label className="product-form-field product-form-field-wide">
            Descrição <span className="product-field-optional">(opcional)</span>
            <textarea
              value={valores.descricao}
              maxLength={500}
              rows={3}
              onChange={(event) =>
                atualizarCampo("descricao", event.target.value)
              }
              aria-invalid={Boolean(erros.descricao)}
            />
            {erros.descricao && (
              <span className="product-field-error" role="alert">
                {erros.descricao}
              </span>
            )}
          </label>

          <div className="product-form-field product-form-field-wide">
            <span>
              Códigos de barras{" "}
              <span className="product-field-optional">(opcional)</span>
            </span>

            <div className="product-barcode-list">
              {valores.codigosBarras.map((codigo, indice) => (
                <div className="product-barcode-row" key={indice}>
                  <input
                    type="text"
                    inputMode="text"
                    value={codigo}
                    onChange={(event) =>
                      alterarCodigoBarras(indice, event.target.value)
                    }
                    aria-label={`Código de barras ${indice + 1}`}
                    aria-invalid={Boolean(
                      erros.codigosBarras &&
                        (codigo.trim().length === 0 ||
                          valores.codigosBarras
                            .map((item) => item.trim())
                            .filter((item) => item === codigo.trim()).length > 1),
                    )}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Digite ou leia o código"
                  />

                  <button
                    className="sale-secondary-button"
                    type="button"
                    onClick={() => removerCodigoBarrasDoFormulario(indice)}
                    disabled={salvando}
                    aria-label={`Remover código de barras ${indice + 1}`}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <button
              className="sale-secondary-button"
              type="button"
              onClick={adicionarCodigoBarras}
              disabled={salvando}
            >
              + Adicionar código
            </button>

            {erros.codigosBarras && (
              <span className="product-field-error" role="alert">
                {erros.codigosBarras}
              </span>
            )}
          </div>

          <label className="product-form-field">
            Preço (R$) <span aria-hidden="true">*</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={valores.preco}
              onChange={(event) => atualizarCampo("preco", event.target.value)}
              aria-invalid={Boolean(erros.preco)}
            />
            {erros.preco && (
              <span className="product-field-error" role="alert">
                {erros.preco}
              </span>
            )}
          </label>

          <label className="product-form-field">
            Unidade de medida <span aria-hidden="true">*</span>
            <select
              value={valores.unidadeMedida}
              onChange={(event) =>
                atualizarCampo(
                  "unidadeMedida",
                  Number(event.target.value) as UnidadeMedidaCodigo,
                )
              }
            >
              <option value={1}>Unidade</option>
              <option value={2}>Grama</option>
              <option value={3}>Quilograma</option>
              <option value={4}>Mililitro</option>
              <option value={5}>Litro</option>
            </select>
          </label>

          {!estaEditando ? (
            <label className="product-form-toggle">
              <input
                type="checkbox"
                checked={valores.disponivel}
                onChange={(event) =>
                  atualizarCampo("disponivel", event.target.checked)
                }
              />
              <span>
                <strong>Disponível para venda</strong>
                <small>
                  O produto poderá ser selecionado em uma nova venda.
                </small>
              </span>
            </label>
          ) : (
            <p className="product-field-optional">
              A disponibilidade é alterada pela ação de ativar ou inativar no
              catálogo.
            </p>
          )}

          <label className="product-form-toggle">
            <input
              type="checkbox"
              checked={valores.controlaEstoque}
              onChange={(event) => {
                const controlaEstoque = event.target.checked;
                atualizarCampo("controlaEstoque", controlaEstoque);

                if (!controlaEstoque) {
                  atualizarCampo("quantidadeEstoque", "");
                }
              }}
            />
            <span>
              <strong>Controlar estoque</strong>
              <small>Registrar e acompanhar a quantidade disponível.</small>
            </span>
          </label>

          {valores.controlaEstoque && (
            <label className="product-form-field">
              Quantidade
              <input
                type="number"
                min="0"
                step="any"
                value={valores.quantidadeEstoque}
                onChange={(event) =>
                  atualizarCampo("quantidadeEstoque", event.target.value)
                }
                aria-invalid={Boolean(erros.quantidadeEstoque)}
              />
              <span className="product-field-optional">
                Pode ficar vazia; o estoque será definido como zero.
              </span>
              {erros.quantidadeEstoque && (
                <span className="product-field-error" role="alert">
                  {erros.quantidadeEstoque}
                </span>
              )}
            </label>
          )}
        </div>

        {erroApi && <ErrorState message={erroApi} />}

        <div className="product-form-actions">
          <button
            className="sale-secondary-button"
            type="button"
            onClick={onCancel}
            disabled={salvando}
          >
            Cancelar
          </button>

          <button
            className="sale-primary-button"
            type="submit"
            disabled={salvando}
          >
            {salvando
              ? estaEditando
                ? "Salvando alterações..."
                : "Salvando..."
              : estaEditando
                ? "Salvar alterações"
                : "Cadastrar produto"}
          </button>
        </div>
      </section>
    </form>
  );
}