/**
 * Endereço base da API, configurado no ambiente local.
 * Se a variável não estiver definida, usa o endereço local padrão.
 */
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim() || "https://localhost:7199"
).replace(/\/+$/, "");

/**
 * Tenta extrair uma mensagem útil do corpo de uma resposta HTTP com erro.
 * Também considera o formato de erros de validação do ASP.NET.
 */
async function getErrorMessage(response: Response): Promise<string> {
  const fallbackMessage = `A requisição falhou (HTTP ${response.status}).`;
  const responseText = await response.text();

  if (!responseText) {
    return fallbackMessage;
  }

  try {
    const body: unknown = JSON.parse(responseText);

    if (typeof body !== "object" || body === null) {
      return fallbackMessage;
    }

    const errorBody = body as Record<string, unknown>;

    if (typeof errorBody.detail === "string") {
      return errorBody.detail;
    }

    if (typeof errorBody.message === "string") {
      return errorBody.message;
    }

    if (typeof errorBody.title === "string") {
      return errorBody.title;
    }

    const errors = errorBody.errors;

    if (typeof errors === "object" && errors !== null) {
      const messages = Object.values(errors as Record<string, unknown>)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter((value): value is string => typeof value === "string");

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
  } catch {
    // Se o corpo não for JSON, usa a mensagem HTTP padrão abaixo.
  }

  return fallbackMessage;
}

/**
 * Faz uma requisição que espera uma resposta JSON.
 */
async function requestJson<T>(
  path: string,
  options: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as T;
}

/**
 * Faz uma requisição que não espera conteúdo na resposta, como DELETE 204.
 */
async function requestNoContent(
  path: string,
  options: RequestInit,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

/**
 * Realiza uma requisição GET que espera receber JSON.
 */
export function getJson<T>(path: string): Promise<T> {
  return requestJson<T>(path, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
}

/**
 * Realiza uma requisição POST enviando o corpo como JSON e esperando JSON na resposta.
 */
export function postJson<TRequest, TResponse>(
  path: string,
  body: TRequest,
): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

/**
 * Realiza uma requisição PUT enviando o corpo como JSON e esperando JSON na resposta.
 */
export function putJson<TRequest, TResponse>(
  path: string,
  body: TRequest,
): Promise<TResponse> {
  return requestJson<TResponse>(path, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

/**
 * Realiza uma requisição DELETE que não espera corpo na resposta.
 */
export function deleteRequest(path: string): Promise<void> {
  return requestNoContent(path, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });
}