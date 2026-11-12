import { useState, type ChangeEvent, type FormEvent } from "react";
import type {
  Cliente,
  ClienteRequest,
} from "../types/cliente";
import { ErrorState } from "../../../shared/components/ErrorState";

interface ClienteFormProps {
  cliente: Cliente | null;
  salvando: boolean;
  erroApi: string | null;
  onSubmit: (request: ClienteRequest) => Promise<Cliente>;
  onSuccess: (cliente: Cliente) => void;
  onCancel: () => void;
}

interface ClienteFormValues {
  nome: string;
  telefone: string;
  cpf: string;
  email: string;
  endereco: string;
  numeroCasa: string;
  bairro: string;
  cidade: string;
  estado: string;
}

type CampoFormulario = keyof ClienteFormValues;
type ErrosFormulario = Partial<Record<CampoFormulario, string>>;

/**
 * Converte os dados existentes do cliente para os valores iniciais dos campos.
 * Quando não há cliente, inicia todos os campos vazios para um novo cadastro.
 */
function criarValoresIniciais(cliente: Cliente | null): ClienteFormValues {
  return {
    nome: cliente?.nome ?? "",
    telefone: cliente?.telefone ?? "",
    cpf: cliente?.cpf ?? "",
    email: cliente?.email ?? "",
    endereco: cliente?.endereco ?? "",
    numeroCasa: cliente?.numeroCasa ?? "",
    bairro: cliente?.bairro ?? "",
    cidade: cliente?.cidade ?? "",
    estado: cliente?.estado ?? "",
  };
}

/**
 * Valida os campos conforme os requisitos de apresentação do formulário.
 * CPF é normalizado para dígitos antes de verificar o tamanho; estado aceita
 * exatamente duas letras; os campos obrigatórios não podem ficar em branco.
 */
function validarFormulario(valores: ClienteFormValues): ErrosFormulario {
  const erros: ErrosFormulario = {};
  const telefoneDigitos = valores.telefone.replace(/\D/g, "");
  const cpfDigitos = valores.cpf.replace(/\D/g, "");
  const email = valores.email.trim();
  const estado = valores.estado.trim();

  if (!valores.nome.trim()) {
    erros.nome = "Informe o nome do cliente.";
  }

  if (!telefoneDigitos) {
    erros.telefone = "Informe o telefone do cliente.";
  }

  if (valores.cpf.trim() && cpfDigitos.length !== 11) {
    erros.cpf = "O CPF deve conter 11 dígitos.";
  }

  if (
    email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    erros.email = "Informe um e-mail válido.";
  }

  if (estado && !/^[a-zA-Z]{2}$/.test(estado)) {
    erros.estado = "O estado deve conter exatamente duas letras.";
  }

  return erros;
}

/**
 * Converte um campo opcional em null quando estiver vazio.
 * Os espaços externos são removidos para não enviar valores em branco à API.
 */
function converterOpcional(valor: string): string | null {
  const valorNormalizado = valor.trim();

  return valorNormalizado || null;
}

/**
 * Monta o corpo de cadastro ou edição no formato esperado pela API.
 * O telefone e o CPF são enviados somente com dígitos; opcionais vazios viram null.
 */
function criarRequisicao(valores: ClienteFormValues): ClienteRequest {
  const cpfDigitos = valores.cpf.replace(/\D/g, "");
  const telefoneDigitos = valores.telefone.replace(/\D/g, "");
  const estadoNormalizado = valores.estado.trim().toUpperCase();

  return {
    nome: valores.nome.trim(),
    telefone: telefoneDigitos,
    cpf: cpfDigitos || null,
    email: converterOpcional(valores.email),
    endereco: converterOpcional(valores.endereco),
    bairro: converterOpcional(valores.bairro),
    numeroCasa: converterOpcional(valores.numeroCasa),
    cidade: converterOpcional(valores.cidade),
    estado: estadoNormalizado || null,
  };
}

export function ClienteForm({
  cliente,
  salvando,
  erroApi,
  onSubmit,
  onSuccess,
  onCancel,
}: ClienteFormProps) {
  const [valores, setValores] = useState<ClienteFormValues>(() =>
    criarValoresIniciais(cliente),
  );
  const [erros, setErros] = useState<ErrosFormulario>({});

  const estaEditando = cliente !== null;

  /**
   * Atualiza um campo do formulário e remove sua mensagem de validação anterior.
   * O restante dos campos e erros permanece como estava.
   */
  function handleChange(campo: CampoFormulario) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const novoValor = event.target.value;

      setValores((atuais) => ({
        ...atuais,
        [campo]: novoValor,
      }));

      setErros((atuais) => {
        if (!atuais[campo]) {
          return atuais;
        }

        const proximosErros = { ...atuais };
        delete proximosErros[campo];

        return proximosErros;
      });
    };
  }

  /**
   * Renderiza a mensagem de validação de um campo, quando existir.
   * O identificador permite associar a mensagem ao input com aria-describedby.
   */
  function renderizarErro(campo: CampoFormulario, id: string) {
    const mensagem = erros[campo];

    if (!mensagem) {
      return null;
    }

    return (
      <span className="client-field-error" id={id} role="alert">
        {mensagem}
      </span>
    );
  }

  /**
   * Valida os valores, monta o corpo aceito pela API e envia ao callback da página.
   * Se a validação local falhar, mantém o formulário aberto e mostra erros nos campos.
   * Se a API aceitar a operação, avisa a página para atualizar a tela/listagem.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errosEncontrados = validarFormulario(valores);
    setErros(errosEncontrados);

    if (Object.keys(errosEncontrados).length > 0) {
      return;
    }

    const request = criarRequisicao(valores);

    try {
      const clienteSalvo = await onSubmit(request);
      onSuccess(clienteSalvo);
    } catch {
      // A mensagem de validação ou falha da API é apresentada por erroApi.
    }
  }

  return (
    <form className="client-form" onSubmit={handleSubmit} noValidate>
      <section className="panel client-form-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Cadastro de clientes</p>
            <h2>{estaEditando ? "Editar cliente" : "Novo cliente"}</h2>
          </div>
        </div>

        <p className="client-form-intro">
          Campos marcados com <span aria-hidden="true">*</span> são obrigatórios.
          Os demais podem ficar sem preenchimento.
        </p>

        <div className="client-form-section">
          <h3>Contato</h3>

          <div className="client-form-grid">
            <label className="client-form-field" htmlFor="cliente-nome">
              Nome <span aria-hidden="true">*</span>
              <input
                id="cliente-nome"
                name="nome"
                type="text"
                autoComplete="name"
                value={valores.nome}
                onChange={handleChange("nome")}
                required
                aria-invalid={Boolean(erros.nome)}
                aria-describedby={
                  erros.nome ? "cliente-nome-error" : undefined
                }
              />
              {renderizarErro("nome", "cliente-nome-error")}
            </label>

            <label className="client-form-field" htmlFor="cliente-telefone">
              Telefone <span aria-hidden="true">*</span>
              <input
                id="cliente-telefone"
                name="telefone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={valores.telefone}
                onChange={handleChange("telefone")}
                required
                aria-invalid={Boolean(erros.telefone)}
                aria-describedby={
                  erros.telefone ? "cliente-telefone-error" : undefined
                }
              />
              {renderizarErro("telefone", "cliente-telefone-error")}
            </label>

            <label className="client-form-field" htmlFor="cliente-cpf">
              CPF <span className="client-field-optional">(opcional)</span>
              <input
                id="cliente-cpf"
                name="cpf"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={valores.cpf}
                onChange={handleChange("cpf")}
                aria-invalid={Boolean(erros.cpf)}
                aria-describedby={erros.cpf ? "cliente-cpf-error" : undefined}
              />
              {renderizarErro("cpf", "cliente-cpf-error")}
            </label>

            <label className="client-form-field" htmlFor="cliente-email">
              E-mail <span className="client-field-optional">(opcional)</span>
              <input
                id="cliente-email"
                name="email"
                type="email"
                autoComplete="email"
                value={valores.email}
                onChange={handleChange("email")}
                aria-invalid={Boolean(erros.email)}
                aria-describedby={
                  erros.email ? "cliente-email-error" : undefined
                }
              />
              {renderizarErro("email", "cliente-email-error")}
            </label>
          </div>
        </div>

        <div className="client-form-section">
          <h3>Endereço</h3>

          <div className="client-form-grid">
            <label
              className="client-form-field client-form-field-wide"
              htmlFor="cliente-endereco"
            >
              Endereço{" "}
              <span className="client-field-optional">(opcional)</span>
              <input
                id="cliente-endereco"
                name="endereco"
                type="text"
                autoComplete="street-address"
                value={valores.endereco}
                onChange={handleChange("endereco")}
              />
            </label>

            <label className="client-form-field" htmlFor="cliente-numero">
              Número{" "}
              <span className="client-field-optional">(opcional)</span>
              <input
                id="cliente-numero"
                name="numeroCasa"
                type="text"
                value={valores.numeroCasa}
                onChange={handleChange("numeroCasa")}
              />
            </label>

            <label className="client-form-field" htmlFor="cliente-bairro">
              Bairro <span className="client-field-optional">(opcional)</span>
              <input
                id="cliente-bairro"
                name="bairro"
                type="text"
                autoComplete="address-level3"
                value={valores.bairro}
                onChange={handleChange("bairro")}
              />
            </label>

            <label className="client-form-field" htmlFor="cliente-cidade">
              Cidade <span className="client-field-optional">(opcional)</span>
              <input
                id="cliente-cidade"
                name="cidade"
                type="text"
                autoComplete="address-level2"
                value={valores.cidade}
                onChange={handleChange("cidade")}
              />
            </label>

            <label className="client-form-field" htmlFor="cliente-estado">
              Estado <span className="client-field-optional">(opcional)</span>
              <input
                id="cliente-estado"
                name="estado"
                type="text"
                autoComplete="address-level1"
                maxLength={2}
                value={valores.estado}
                onChange={handleChange("estado")}
                aria-invalid={Boolean(erros.estado)}
                aria-describedby={
                  erros.estado ? "cliente-estado-error" : undefined
                }
              />
              {renderizarErro("estado", "cliente-estado-error")}
            </label>
          </div>
        </div>

        {erroApi && <ErrorState message={erroApi} />}

        <div className="client-form-actions">
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
              ? "Salvando..."
              : estaEditando
                ? "Salvar alterações"
                : "Cadastrar cliente"}
          </button>
        </div>
      </section>
    </form>
  );
}