import { ImageResponse } from "@vercel/og";
import { getShoeById } from "@/lib/services/shoe-service";
import { formatPrice, formatBrandModel } from "@/lib/utils/formatters";

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

function DefaultImage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1200px",
        height: "630px",
        background: "#0052cc",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "64px",
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
          fontSize: "28px",
          color: "#b3d4ff",
        }}
      >
        ランニングシューズ比較
      </div>
      <div
        style={{
          display: "flex",
          fontSize: "16px",
          color: "#b3d4ff",
          marginTop: "32px",
        }}
      >
        running-shoes-selector.vercel.app
      </div>
    </div>
  );
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam.split(",").filter(Boolean).slice(0, 4);

  const fontData = await fetchFont();

  const fontConfig = fontData
    ? [{ name: "Noto Sans JP", data: fontData, weight: 400 as const }]
    : [];

  if (ids.length === 0) {
    return new ImageResponse(<DefaultImage />, {
      width: 1200,
      height: 630,
      fonts: fontConfig,
    });
  }

  const shoes = (
    await Promise.all(ids.map((id) => getShoeById(id)))
  ).filter(Boolean);

  if (shoes.length === 0) {
    return new ImageResponse(<DefaultImage />, {
      width: 1200,
      height: 630,
      fonts: fontConfig,
    });
  }

  const shoeCardWidth = Math.floor(900 / shoes.length);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          background: "#0052cc",
          padding: "48px",
          boxSizing: "border-box",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            RunSelect
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "#b3d4ff",
            }}
          >
            シューズ比較
          </div>
        </div>

        {/* シューズ一覧 */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "16px",
            alignItems: "stretch",
          }}
        >
          {shoes.map((shoe) => {
            if (!shoe) return null;
            const name = formatBrandModel(shoe.brand, shoe.model, shoe.version);
            return (
              <div
                key={shoe.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: `${shoeCardWidth}px`,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  padding: "24px",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "14px",
                    color: "#b3d4ff",
                    marginBottom: "8px",
                    textTransform: "lowercase",
                  }}
                >
                  {shoe.brand}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: shoes.length <= 2 ? "24px" : "18px",
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: "12px",
                    lineHeight: "1.2",
                  }}
                >
                  {shoe.model}
                  {shoe.version ? ` ${shoe.version}` : ""}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "18px",
                    color: "#ffffff",
                    fontWeight: 600,
                  }}
                >
                  {formatPrice(shoe.price)}
                </div>
              </div>
            );
          })}
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "32px",
            fontSize: "14px",
            color: "#b3d4ff",
          }}
        >
          running-shoes-selector.vercel.app
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
