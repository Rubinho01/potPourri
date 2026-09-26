const API_URL = process.env.API_URL ?? "http://localhost:3333/api";

/**
 * Erro lançado quando a API do backend responde com um status de erro
 * (o backend sempre manda o corpo `{ message: string }`, ver
 * pot-backend/src/middlewares/errorHandler.ts).
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Wrapper de fetch para chamar o backend a partir do servidor Next.js
 * (Server Actions / Route Handlers / Server Components).
 *
 * Não usar diretamente em Client Components: `API_URL` só existe no
 * ambiente do servidor e o objetivo é evitar CORS chamando o backend
 * server-to-server.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor. Verifique se o backend está rodando.", 0);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await res.json() : undefined;

  if (!res.ok) {
    const message = typeof body?.message === "string" ? body.message : "Erro ao comunicar com o servidor.";
    throw new ApiError(message, res.status);
  }

  return body as T;
}
