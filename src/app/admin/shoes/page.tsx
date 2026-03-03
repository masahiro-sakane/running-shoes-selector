import Link from "next/link";
import { getShoes } from "@/lib/services/shoe-service";
import ShoeTableRow from "@/components/admin/ShoeTableRow";

const ATLASSIAN_COLORS = {
  primary: "#0052cc",
  text: "#172b4d",
  bg: "#f4f5f7",
  border: "#dfe1e6",
  white: "#ffffff",
};

export default async function AdminShoesPage() {
  const { shoes } = await getShoes({ sort: "newest", page: 1, limit: 50 });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            color: ATLASSIAN_COLORS.text,
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          シューズ管理
        </h1>
        <Link
          href="/admin/shoes/new"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            background: ATLASSIAN_COLORS.primary,
            color: ATLASSIAN_COLORS.white,
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          新規追加
        </Link>
      </div>

      <div
        style={{
          background: ATLASSIAN_COLORS.white,
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{
                background: ATLASSIAN_COLORS.bg,
                borderBottom: `2px solid ${ATLASSIAN_COLORS.border}`,
              }}
            >
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  color: "#6b778c",
                  fontWeight: 600,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                ブランド
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  color: "#6b778c",
                  fontWeight: 600,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                モデル
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  color: "#6b778c",
                  fontWeight: 600,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                価格
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  color: "#6b778c",
                  fontWeight: 600,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                カテゴリ
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  color: "#6b778c",
                  fontWeight: 600,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                更新日
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  color: "#6b778c",
                  fontWeight: 600,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {shoes.map((shoe) => (
              <ShoeTableRow key={shoe.id} shoe={shoe} />
            ))}
          </tbody>
        </table>
        {shoes.length === 0 && (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "#6b778c",
              fontSize: "14px",
            }}
          >
            シューズが登録されていません。
          </div>
        )}
      </div>
    </div>
  );
}
