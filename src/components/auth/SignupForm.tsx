"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signupSchema } from "@/lib/validations/auth-schema";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const result = signupSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      setError(firstIssue?.message ?? "入力内容を確認してください");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/auth/confirm");
    } catch {
      setError("アカウント作成中にエラーが発生しました。しばらくしてからお試しください。");
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
          パスワード（8文字以上、英字と数字を含む）
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
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

      <div>
        <label
          htmlFor="confirmPassword"
          style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#172b4d", marginBottom: "4px" }}
        >
          パスワード（確認）
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {isLoading ? "登録中..." : "アカウントを作成"}
      </button>

      <p style={{ textAlign: "center", fontSize: "14px", color: "#6b778c", margin: 0 }}>
        すでにアカウントをお持ちの方は{" "}
        <Link href="/auth/login" style={{ color: "#0052cc", textDecoration: "none", fontWeight: 500 }}>
          ログイン
        </Link>
      </p>
    </form>
  );
}
