import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = Cookies.get("crm_auth_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

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
