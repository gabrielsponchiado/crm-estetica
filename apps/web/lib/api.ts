import Cookies from "js-cookie";

const API_URL = "/api";

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Erro na requisição: ${response.status}`;

    try {
      const error = await response.json();

      if (Array.isArray(error?.message)) {
        message = error.message.join(", ");
      } else if (error?.message) {
        message = error.message;
      }
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
