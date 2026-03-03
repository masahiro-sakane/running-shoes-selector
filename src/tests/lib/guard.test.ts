import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { requireAuth, requireAdmin } from "@/lib/auth/guard";

// Supabase サーバークライアントをモックする
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// user-service をモックする
vi.mock("@/lib/services/user-service", () => ({
  isAdmin: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/services/user-service";

const mockCreateClient = vi.mocked(createClient);
const mockIsAdmin = vi.mocked(isAdmin);

function makeRequest(url = "http://localhost/api/admin/test") {
  return new NextRequest(url);
}

function makeSupabaseMock(user: { id: string } | null, error: Error | null = null) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
        error,
      }),
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("requireAuth", () => {
  it("未認証の場合は 401 を返す", async () => {
    mockCreateClient.mockResolvedValueOnce(
      makeSupabaseMock(null) as unknown as Awaited<ReturnType<typeof createClient>>
    );

    const request = makeRequest();
    const result = await requireAuth(request);

    expect(result.userId).toBeNull();
    expect(result.error).not.toBeNull();
    if (result.error) {
      expect(result.error.status).toBe(401);
      const body = await result.error.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe("Unauthorized");
    }
  });

  it("Supabase がエラーを返す場合は 401 を返す", async () => {
    mockCreateClient.mockResolvedValueOnce(
      makeSupabaseMock(null, new Error("Auth error")) as unknown as Awaited<ReturnType<typeof createClient>>
    );

    const request = makeRequest();
    const result = await requireAuth(request);

    expect(result.userId).toBeNull();
    expect(result.error).not.toBeNull();
    if (result.error) {
      expect(result.error.status).toBe(401);
    }
  });

  it("認証済みの場合は userId を返す", async () => {
    mockCreateClient.mockResolvedValueOnce(
      makeSupabaseMock({ id: "user-id-1" }) as unknown as Awaited<ReturnType<typeof createClient>>
    );

    const request = makeRequest();
    const result = await requireAuth(request);

    expect(result.error).toBeNull();
    expect(result.userId).toBe("user-id-1");
  });
});

describe("requireAdmin", () => {
  it("未認証の場合は 401 を返す", async () => {
    mockCreateClient.mockResolvedValueOnce(
      makeSupabaseMock(null) as unknown as Awaited<ReturnType<typeof createClient>>
    );

    const request = makeRequest();
    const result = await requireAdmin(request);

    expect(result.userId).toBeNull();
    expect(result.error).not.toBeNull();
    if (result.error) {
      expect(result.error.status).toBe(401);
    }
  });

  it("認証済みだが非 admin の場合は 403 を返す", async () => {
    mockCreateClient.mockResolvedValueOnce(
      makeSupabaseMock({ id: "user-id-1" }) as unknown as Awaited<ReturnType<typeof createClient>>
    );
    mockIsAdmin.mockResolvedValueOnce(false);

    const request = makeRequest();
    const result = await requireAdmin(request);

    expect(result.userId).toBeNull();
    expect(result.error).not.toBeNull();
    if (result.error) {
      expect(result.error.status).toBe(403);
      const body = await result.error.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe("Forbidden");
    }
  });

  it("認証済みで admin の場合は userId を返す", async () => {
    mockCreateClient.mockResolvedValueOnce(
      makeSupabaseMock({ id: "admin-user-id" }) as unknown as Awaited<ReturnType<typeof createClient>>
    );
    mockIsAdmin.mockResolvedValueOnce(true);

    const request = makeRequest();
    const result = await requireAdmin(request);

    expect(result.error).toBeNull();
    expect(result.userId).toBe("admin-user-id");
  });

  it("isAdmin に正しい userId が渡されることを確認する", async () => {
    mockCreateClient.mockResolvedValueOnce(
      makeSupabaseMock({ id: "verified-user-id" }) as unknown as Awaited<ReturnType<typeof createClient>>
    );
    mockIsAdmin.mockResolvedValueOnce(false);

    const request = makeRequest();
    await requireAdmin(request);

    expect(mockIsAdmin).toHaveBeenCalledWith("verified-user-id");
  });
});
