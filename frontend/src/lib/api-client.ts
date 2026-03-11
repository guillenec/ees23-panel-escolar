const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (accessToken: string | null, refreshToken: string | null) => void;
  clearSession: () => void;
};

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) {
    const message = await res.text();
    throw new ApiError(res.status, message || "Error de API");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function apiFetchWithRefresh<T>(
  path: string,
  session: SessionState,
  init?: RequestInit
): Promise<T> {
  if (!session.accessToken) {
    throw new ApiError(401, "Sesion no iniciada");
  }

  try {
    return await apiFetch<T>(path, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${session.accessToken}`
      }
    });
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401 || !session.refreshToken) {
      throw err;
    }

    try {
      const refreshed = await apiFetch<TokenResponse>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token: session.refreshToken })
      });
      session.setSession(refreshed.access_token, refreshed.refresh_token);

      return await apiFetch<T>(path, {
        ...init,
        headers: {
          ...(init?.headers ?? {}),
          Authorization: `Bearer ${refreshed.access_token}`
        }
      });
    } catch (refreshErr) {
      session.clearSession();
      throw refreshErr;
    }
  }
}
