import ShoeForm from "@/components/admin/ShoeForm";

const ATLASSIAN_COLORS = {
  text: "#172b4d",
};

export default function AdminNewShoePage() {
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
        シューズ新規追加
      </h1>
      <ShoeForm mode="create" />
    </div>
  );
}
