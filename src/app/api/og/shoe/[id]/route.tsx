import { ImageResponse } from "@vercel/og";
import { getShoeById } from "@/lib/services/shoe-service";
import { formatPrice, formatBrandModel, formatWeight, formatDrop } from "@/lib/utils/formatters";
import { SHOE_CATEGORIES } from "@/lib/utils/constants";

export const runtime = "nodejs";

const FONT_URL =
  "https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnanlhBbQ.woff2";

async function fetchFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(FONT_URL);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params;

  const fontData = await fetchFont();
  const fontConfig = fontData
    ? [{ name: "Noto Sans JP", data: fontData, weight: 400 as const }]
    : [];

  const shoe = await getShoeById(id);

  if (!shoe) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "1200px",
            height: "630px",
            background: "#172b4d",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "48px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "16px",
            }}
          >
            RunSelect
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              color: "#7a869a",
            }}
          >
            シューズが見つかりません
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontConfig,
      }
    );
  }

  const name = formatBrandModel(shoe.brand, shoe.model, shoe.version);
  const categoryLabel =
    SHOE_CATEGORIES[shoe.category as keyof typeof SHOE_CATEGORIES] ??
    shoe.category;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          background: "#172b4d",
          padding: "48px",
          boxSizing: "border-box",
        }}
      >
        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "48px",
          }}
        >
          {/* 左半分：シューズ情報 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {/* ブランド名 */}
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                color: "#4C9AFF",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              {shoe.brand}
            </div>

            {/* モデル名 */}
            <div
              style={{
                display: "flex",
                fontSize: "48px",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: "1.1",
                marginBottom: "20px",
              }}
            >
              {shoe.model}
              {shoe.version ? ` ${shoe.version}` : ""}
            </div>

            {/* カテゴリバッジ */}
            <div
              style={{
                display: "flex",
                background: "rgba(76,154,255,0.2)",
                color: "#4C9AFF",
                fontSize: "14px",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "4px",
                marginBottom: "24px",
                width: "fit-content",
              }}
            >
              {categoryLabel}
            </div>

            {/* 価格 */}
            <div
              style={{
                display: "flex",
                fontSize: "36px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "20px",
              }}
            >
              {formatPrice(shoe.price)}
            </div>

            {/* 重量・ドロップ */}
            <div
              style={{
                display: "flex",
                gap: "24px",
              }}
            >
              {shoe.weightG && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#7a869a",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    重量
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#c1c7d0",
                      fontWeight: 600,
                    }}
                  >
                    {formatWeight(shoe.weightG)}
                  </span>
                </div>
              )}
              {shoe.dropMm !== null && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#7a869a",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    ドロップ
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#c1c7d0",
                      fontWeight: 600,
                    }}
                  >
                    {formatDrop(shoe.dropMm)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 右半分：シューズ画像またはアイコン */}
          <div
            style={{
              display: "flex",
              width: "400px",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
            }}
          >
            {shoe.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={shoe.imageUrl}
                alt={name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "32px",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4C9AFF",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", fontSize: "80px" }}>
                  [SHOE]
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "14px",
                    color: "#7a869a",
                    textAlign: "center",
                  }}
                >
                  Running Shoe
                </div>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              fontWeight: 700,
              color: "#4C9AFF",
            }}
          >
            RunSelect
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "14px",
              color: "#7a869a",
            }}
          >
            running-shoes-selector.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontConfig,
    }
  );
}
