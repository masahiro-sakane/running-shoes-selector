import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFavorites } from "@/hooks/useFavorites";

// AuthContext をモックする
vi.mock("@/contexts/AuthContext", () => ({
  useAuthContext: vi.fn(),
}));

import { useAuthContext } from "@/contexts/AuthContext";

const mockUseAuthContext = vi.mocked(useAuthContext);

// localStorage を各テストで独立させるためにモックを再定義する
let localStore: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string): string | null => localStore[key] ?? null,
  setItem: (key: string, value: string): void => {
    localStore[key] = value;
  },
  removeItem: (key: string): void => {
    delete localStore[key];
  },
  clear: (): void => {
    localStore = {};
  },
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// fetch をモックする
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  localStore = {};
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("useFavorites - 未ログイン時", () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });
  });

  it("LocalStorage からお気に入りを読み込む", async () => {
    localStore["favorites"] = JSON.stringify(["shoe-1", "shoe-2"]);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favoriteIds).toEqual(["shoe-1", "shoe-2"]);
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("addFavorite が LocalStorage に保存する", async () => {
    const setItemSpy = vi.spyOn(localStorageMock, "setItem");

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite("shoe-1");
    });

    expect(result.current.favoriteIds).toContain("shoe-1");
    expect(setItemSpy).toHaveBeenCalledWith(
      "favorites",
      JSON.stringify(["shoe-1"])
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("removeFavorite が LocalStorage から削除する", async () => {
    localStore["favorites"] = JSON.stringify(["shoe-1", "shoe-2"]);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favoriteIds).toHaveLength(2);
    });

    act(() => {
      result.current.removeFavorite("shoe-1");
    });

    expect(result.current.favoriteIds).not.toContain("shoe-1");
    expect(result.current.favoriteIds).toContain("shoe-2");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("toggleFavorite が存在しない場合は追加する", async () => {
    // localStorage は空の状態でテスト開始
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favoriteIds).toEqual([]);
    });

    act(() => {
      result.current.toggleFavorite("shoe-1");
    });

    expect(result.current.favoriteIds).toContain("shoe-1");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("toggleFavorite が存在する場合は削除する", async () => {
    localStore["favorites"] = JSON.stringify(["shoe-1"]);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favoriteIds).toContain("shoe-1");
    });

    act(() => {
      result.current.toggleFavorite("shoe-1");
    });

    expect(result.current.favoriteIds).not.toContain("shoe-1");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("isFavorite が正しく判定する", async () => {
    localStore["favorites"] = JSON.stringify(["shoe-1"]);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favoriteIds).toContain("shoe-1");
    });

    expect(result.current.isFavorite("shoe-1")).toBe(true);
    expect(result.current.isFavorite("shoe-2")).toBe(false);
  });

  it("count が正しい値を返す", async () => {
    localStore["favorites"] = JSON.stringify(["shoe-1", "shoe-2", "shoe-3"]);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.count).toBe(3);
    });
  });
});

describe("useFavorites - ログイン済み時", () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({
      user: { id: "user-123", email: "test@example.com" } as never,
      session: {} as never,
      isLoading: false,
      signOut: vi.fn(),
    });
  });

  it("ログイン直後に LocalStorage の内容をサーバーに同期する", async () => {
    localStore["favorites"] = JSON.stringify(["shoe-1", "shoe-2"]);

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, shoeIds: ["shoe-1", "shoe-2", "shoe-3"] }),
    } as never);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/favorites/sync",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ shoeIds: ["shoe-1", "shoe-2"] }),
        })
      );
    });

    await waitFor(() => {
      expect(result.current.favoriteIds).toEqual(["shoe-1", "shoe-2", "shoe-3"]);
    });
  });

  it("addFavorite が API を呼び出す", async () => {
    // 同期 fetch のモック（空配列を返す）
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, shoeIds: [] }),
    } as never);

    const { result } = renderHook(() => useFavorites());

    // 同期 fetch が完了するのを待つ
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/favorites/sync", expect.anything());
    });

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    } as never);

    act(() => {
      result.current.addFavorite("shoe-new");
    });

    // 楽観的更新でまずローカル状態が更新される
    expect(result.current.favoriteIds).toContain("shoe-new");

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/favorites",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ shoeId: "shoe-new" }),
        })
      );
    });
  });

  it("removeFavorite が API を呼び出す", async () => {
    localStore["favorites"] = JSON.stringify(["shoe-1"]);

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, shoeIds: ["shoe-1"] }),
    } as never);

    const { result } = renderHook(() => useFavorites());

    // 同期が完了するのを待つ
    await waitFor(() => {
      expect(result.current.favoriteIds).toContain("shoe-1");
    });

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    } as never);

    act(() => {
      result.current.removeFavorite("shoe-1");
    });

    // 楽観的更新でまずローカル状態が更新される
    expect(result.current.favoriteIds).not.toContain("shoe-1");

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/favorites/shoe-1",
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  it("addFavorite の API が失敗した場合はロールバックする", async () => {
    // 同期 fetch のモック（空配列を返す）
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, shoeIds: [] }),
    } as never);

    const { result } = renderHook(() => useFavorites());

    // 同期が完了するのを待つ
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/favorites/sync", expect.anything());
    });

    // favoriteIds が空になるのを確認する
    await waitFor(() => {
      expect(result.current.favoriteIds).toEqual([]);
    });

    // API 失敗を返すモックをセット
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false }),
    } as never);

    act(() => {
      result.current.addFavorite("shoe-fail");
    });

    // まず楽観的更新される
    expect(result.current.favoriteIds).toContain("shoe-fail");

    // API 失敗でロールバックされる
    await waitFor(() => {
      expect(result.current.favoriteIds).not.toContain("shoe-fail");
    });
  });
});

describe("useFavorites - 読み込み中", () => {
  it("isLoading が true の間は同期しない", async () => {
    mockUseAuthContext.mockReturnValue({
      user: { id: "user-123", email: "test@example.com" } as never,
      session: {} as never,
      isLoading: true,
      signOut: vi.fn(),
    });

    renderHook(() => useFavorites());

    // isLoading = true の間は fetch が呼ばれない
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
