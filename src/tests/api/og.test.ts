import { describe, it, expect, vi, beforeEach } from "vitest";

// @vercel/og の ImageResponse をコンストラクタ互換でモック
class MockImageResponse extends Response {
  constructor(_element: unknown, _options?: unknown) {
    super("mock-image-data", {
      headers: {
        "content-type": "image/png",
        "cache-control": "public, immutable, no-transform, max-age=31536000",
      },
      status: 200,
    });
  }
}

vi.mock("@vercel/og", () => ({
  ImageResponse: MockImageResponse,
}));

// shoe-service をモック
vi.mock("@/lib/services/shoe-service", () => ({
  getShoeById: vi.fn(),
}));

// fetch をモック（フォント取得）
vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
  ok: false,
  arrayBuffer: async () => new ArrayBuffer(0),
}));

// @/lib/utils/constants をモック
vi.mock("@/lib/utils/constants", () => ({
  SHOE_CATEGORIES: {
    daily: "デイリートレーナー",
    race: "レースシューズ",
    interval: "インターバル向け",
    long_run: "ロング走向け",
    recovery: "リカバリー",
    trail: "トレイル",
  },
}));

import { getShoeById } from "@/lib/services/shoe-service";

const mockGetShoeById = vi.mocked(getShoeById);

const MOCK_SHOE = {
  id: "shoe-1",
  brand: "Nike",
  model: "Vaporfly 3",
  version: null,
  year: 2024,
  price: 35000,
  currency: "JPY",
  weightG: 195,
  dropMm: 8,
  stackHeightHeel: 40,
  stackHeightFore: 32,
  cushionType: "foam",
  cushionMaterial: "ZoomX",
  outsoleMaterial: "rubber",
  upperMaterial: "mesh",
  widthOptions: "standard",
  surfaceType: "road",
  pronationType: "neutral",
  category: "race",
  durabilityKm: 300,
  officialUrl: "https://www.nike.com",
  imageUrl: null,
  description: "テスト用のシューズです。",
  createdAt: new Date(),
  updatedAt: new Date(),
  trainingFit: {
    dailyJog: 2,
    paceRun: 4,
    interval: 5,
    longRun: 3,
    race: 5,
    recovery: 1,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: false,
    arrayBuffer: async () => new ArrayBuffer(0),
  }));
});

describe("GET /api/og/shoe/[id]", () => {
  it("シューズが存在する場合に Content-Type: image/png のレスポンスを返すこと", async () => {
    mockGetShoeById.mockResolvedValueOnce(MOCK_SHOE);

    const { GET } = await import("@/app/api/og/shoe/[id]/route");
    const request = new Request("http://localhost/api/og/shoe/shoe-1");
    const context = { params: Promise.resolve({ id: "shoe-1" }) };
    const response = await GET(request, context);

    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.status).toBe(200);
  });

  it("シューズが存在しない場合もエラーにならずフォールバック画像を返すこと", async () => {
    mockGetShoeById.mockResolvedValueOnce(null);

    const { GET } = await import("@/app/api/og/shoe/[id]/route");
    const request = new Request("http://localhost/api/og/shoe/nonexistent");
    const context = { params: Promise.resolve({ id: "nonexistent" }) };
    const response = await GET(request, context);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  it("imageUrl があるシューズでも正常にレスポンスを返すこと", async () => {
    const shoeWithImage = {
      ...MOCK_SHOE,
      imageUrl: "https://example.com/shoe.png",
    };
    mockGetShoeById.mockResolvedValueOnce(shoeWithImage);

    const { GET } = await import("@/app/api/og/shoe/[id]/route");
    const request = new Request("http://localhost/api/og/shoe/shoe-1");
    const context = { params: Promise.resolve({ id: "shoe-1" }) };
    const response = await GET(request, context);

    expect(response.status).toBe(200);
  });
});

describe("GET /api/og/compare", () => {
  it("idsがない場合にデフォルト画像（200ステータス）を返すこと", async () => {
    const { GET } = await import("@/app/api/og/compare/route");
    const request = new Request("http://localhost/api/og/compare");
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  it("存在しないidsの場合にデフォルト画像を返すこと", async () => {
    mockGetShoeById.mockResolvedValue(null);

    const { GET } = await import("@/app/api/og/compare/route");
    const request = new Request("http://localhost/api/og/compare?ids=nonexistent1,nonexistent2");
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  it("有効なシューズidsの場合に比較画像を返すこと", async () => {
    mockGetShoeById.mockResolvedValue(MOCK_SHOE);

    const { GET } = await import("@/app/api/og/compare/route");
    const request = new Request("http://localhost/api/og/compare?ids=shoe-1,shoe-2");
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  it("4足を超えるidsは最初の4足だけ使用すること", async () => {
    mockGetShoeById.mockResolvedValue(MOCK_SHOE);

    const { GET } = await import("@/app/api/og/compare/route");
    const request = new Request(
      "http://localhost/api/og/compare?ids=s1,s2,s3,s4,s5,s6"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    // getShoeById は最大4回呼ばれること
    expect(mockGetShoeById).toHaveBeenCalledTimes(4);
  });
});
