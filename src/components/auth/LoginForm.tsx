"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validations/auth-schema";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      setError(firstIssue?.message ?? "入力内容を確認してください");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (authError) {
        setError("メールアドレスまたはパスワードが正しくありません");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("ログイン処理中にエラーが発生しました。しばらくしてからお試しください。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <label
          htmlFor="email"
          style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#172b4d", marginBottom: "4px" }}
        >
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "2px solid #dfe1e6",
            borderRadius: "4px",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#172b4d", marginBottom: "4px" }}
        >
          パスワード
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "2px solid #dfe1e6",
            borderRadius: "4px",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: "10px 12px",
            background: "#ffebe6",
            border: "1px solid #ff5630",
            borderRadius: "4px",
            fontSize: "14px",
            color: "#bf2600",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "10px",
          background: isLoading ? "#0065ff80" : "#0052cc",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "background 0.15s",
        }}
      >
        {isLoading ? "ログイン中..." : "ログイン"}
      </button>

      <p style={{ textAlign: "center", fontSize: "14px", color: "#6b778c", margin: 0 }}>
        アカウントをお持ちでない方は{" "}
        <Link href="/auth/signup" style={{ color: "#0052cc", textDecoration: "none", fontWeight: 500 }}>
          こちら
        </Link>
      </p>
    </form>
  );
}
