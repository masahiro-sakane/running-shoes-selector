import { getAdminStats } from "@/lib/services/admin-shoe-service";
import { SHOE_CATEGORIES } from "@/lib/utils/constants";

const ATLASSIAN_COLORS = {
  primary: "#0052cc",
  text: "#172b4d",
  bg: "#f4f5f7",
  border: "#dfe1e6",
  white: "#ffffff",
};

type CategoryKey = keyof typeof SHOE_CATEGORIES;

export default async function AdminDashboardPage() {
  let stats = null;
  let errorMessage = "";

  try {
    stats = await getAdminStats();
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    errorMessage = "統計情報の取得に失敗しました。";
  }

  return (
    <div>
      <h1
        style={{
          color: ATLASSIAN_COLORS.text,
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "24px",
        }}
      >
        ダッシュボード
      </h1>

      {errorMessage && (
        <div
          style={{
            background: "#ffebe6",
            border: "1px solid #ff5630",
            borderRadius: "4px",
            padding: "12px 16px",
            marginBottom: "24px",
            color: "#bf2600",
            fontSize: "14px",
          }}
        >
          {errorMessage}
        </div>
      )}

      {stats && (
        <div>
          {/* 合計シューズ数カード */}
          <div
            style={{
              background: ATLASSIAN_COLORS.white,
              borderRadius: "4px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              display: "inline-block",
              minWidth: "200px",
            }}
          >
            <p
              style={{
                color: "#6b778c",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "8px",
              }}
            >
              登録シューズ数
            </p>
            <p
              style={{
                color: ATLASSIAN_COLORS.text,
                fontSize: "36px",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {stats.totalShoes}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            {/* ブランド別内訳 */}
            <div
              style={{
                background: ATLASSIAN_COLORS.white,
                borderRadius: "4px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              }}
            >
              <h2
                style={{
                  color: ATLASSIAN_COLORS.text,
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                ブランド別
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {stats.brandStats.map(({ brand, count }) => (
                  <li
                    key={brand}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: `1px solid ${ATLASSIAN_COLORS.border}`,
                      fontSize: "14px",
                      color: ATLASSIAN_COLORS.text,
                    }}
                  >
                    <span>{brand}</span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: ATLASSIAN_COLORS.primary,
                      }}
                    >
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* カテゴリ別内訳 */}
            <div
              style={{
                background: ATLASSIAN_COLORS.white,
                borderRadius: "4px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              }}
            >
              <h2
                style={{
                  color: ATLASSIAN_COLORS.text,
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                カテゴリ別
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {stats.categoryStats.map(({ category, count }) => (
                  <li
                    key={category}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: `1px solid ${ATLASSIAN_COLORS.border}`,
                      fontSize: "14px",
                      color: ATLASSIAN_COLORS.text,
                    }}
                  >
                    <span>
                      {SHOE_CATEGORIES[category as CategoryKey] ?? category}
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: ATLASSIAN_COLORS.primary,
                      }}
                    >
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 最近更新されたシューズ */}
          <div
            style={{
              background: ATLASSIAN_COLORS.white,
              borderRadius: "4px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            <h2
              style={{
                color: ATLASSIAN_COLORS.text,
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              最近更新されたシューズ
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {stats.recentShoes.map(({ id, brand, model, updatedAt }) => (
                <li
                  key={id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: `1px solid ${ATLASSIAN_COLORS.border}`,
                    fontSize: "14px",
                    color: ATLASSIAN_COLORS.text,
                  }}
                >
                  <span>
                    {brand} {model}
                  </span>
                  <span style={{ color: "#6b778c", fontSize: "12px" }}>
                    {new Date(updatedAt).toLocaleDateString("ja-JP")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
