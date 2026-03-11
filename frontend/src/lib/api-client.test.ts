import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiFetchWithRefresh } from "./api-client";

describe("apiFetchWithRefresh", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses current access token when request succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: "1" }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const setSession = vi.fn();
    const clearSession = vi.fn();

    const data = await apiFetchWithRefresh<{ id: string }[]>(
      "/students",
      {
        accessToken: "access-1",
        refreshToken: "refresh-1",
        setSession,
        clearSession
      }
    );

    expect(data).toEqual([{ id: "1" }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/api/v1/students", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer access-1"
      }
    });
    expect(setSession).not.toHaveBeenCalled();
    expect(clearSession).not.toHaveBeenCalled();
  });

  it("refreshes and retries once after 401", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("No autenticado", { status: 401 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            access_token: "access-2",
            refresh_token: "refresh-2",
            token_type: "bearer"
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: "2" }]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const setSession = vi.fn();
    const clearSession = vi.fn();

    const data = await apiFetchWithRefresh<{ id: string }[]>(
      "/students",
      {
        accessToken: "access-1",
        refreshToken: "refresh-1",
        setSession,
        clearSession
      }
    );

    expect(data).toEqual([{ id: "2" }]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(setSession).toHaveBeenCalledWith("access-2", "refresh-2");
    expect(clearSession).not.toHaveBeenCalled();
  });

  it("clears session if refresh fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("No autenticado", { status: 401 }))
      .mockResolvedValueOnce(new Response("Refresh token invalido", { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    const setSession = vi.fn();
    const clearSession = vi.fn();

    await expect(
      apiFetchWithRefresh("/students", {
        accessToken: "access-1",
        refreshToken: "refresh-1",
        setSession,
        clearSession
      })
    ).rejects.toBeInstanceOf(ApiError);

    expect(clearSession).toHaveBeenCalledTimes(1);
    expect(setSession).not.toHaveBeenCalled();
  });

  it("fails fast when there is no access token", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      apiFetchWithRefresh("/students", {
        accessToken: null,
        refreshToken: "refresh-1",
        setSession: vi.fn(),
        clearSession: vi.fn()
      })
    ).rejects.toMatchObject({ status: 401, message: "Sesion no iniciada" });

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
