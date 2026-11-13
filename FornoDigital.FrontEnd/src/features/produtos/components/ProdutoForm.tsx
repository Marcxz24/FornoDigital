import { useState, type FormEvent } from "react";
import type {
  Produto,
  ProdutoRequest,
  UnidadeMedidaCodigo,
} from "../types/produto";
import { ErrorState } from "../../../shared/components/ErrorState";

interface ProdutoFormProps {
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
}

type CampoFormulario = keyof ValoresFormulario;
type ErrosFormulario = Partial<Record<CampoFormulario, string>>;

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
 * Valida os campos conforme as restrições visuais do formulário.
 * Não substitui validações do Back-End; apenas ajuda a corrigir dados antes do envio.
 */
function validarFormulario(valores: ValoresFormulario): ErrosFormulario {
  const erros: ErrosFormulario = {};
  const preco = converterPreco(valores.preco);

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

  return erros;
}

/**
 * Monta o pedido no formato da API.
 * Converte preço e quantidade em números e envia quantidade nula
 * quando o controle de estoque está desligado ou o campo ficou vazio.
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
  };
}

/**
 * Renderiza e valida os campos do formulário antes de solicitar o cadastro à página.
 */
export function ProdutoForm({
  salvando,
  erroApi,
  onSubmit,
  onSuccess,
  onCancel,
}: ProdutoFormProps) {
  const [valores, setValores] = useState<ValoresFormulario>({
    nome: "",
    descricao: "",
    preco: "",
    unidadeMedida: 1,
    disponivel: true,
    controlaEstoque: false,
    quantidadeEstoque: "",
  });
  const [erros, setErros] = useState<ErrosFormulario>({});

  /**
   * Atualiza um campo e apaga apenas o erro anterior daquele campo.
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
   * Impede envio repetido, valida os valores e chama o cadastro.
   * Se a API falhar, o formulário permanece preenchido para correção ou nova tentativa.
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
      const produtoCriado = await onSubmit(criarRequisicao(valores));
      onSuccess(produtoCriado);
    } catch {
      // A página apresenta a mensagem da API em erroApi.
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <section className="panel product-form-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Catálogo</p>
            <h2>Novo produto</h2>
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
              <small>O produto poderá ser selecionado em uma nova venda.</small>
            </span>
          </label>

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
              Quantidade inicial
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
                Pode ficar vazia; o estoque começará em zero.
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
            {salvando ? "Salvando..." : "Cadastrar produto"}
          </button>
        </div>
      </section>
    </form>
  );
}