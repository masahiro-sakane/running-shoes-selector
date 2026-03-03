import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema } from "@/lib/validations/auth-schema";

describe("loginSchema", () => {
  it("有効なメールアドレスとパスワードでバリデーションが通る", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("無効なメールアドレスでバリデーションエラーになる", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      const emailIssue = issues.find((e) => e.path.includes("email"));
      expect(emailIssue).toBeDefined();
    }
  });

  it("パスワードが5文字以下でバリデーションエラーになる", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      const passwordIssue = issues.find((e) => e.path.includes("password"));
      expect(passwordIssue).toBeDefined();
    }
  });

  it("メールアドレスが空でバリデーションエラーになる", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("パスワードが空でバリデーションエラーになる", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("有効な値でバリデーションが通る", () => {
    const result = signupSchema.safeParse({
      email: "newuser@example.com",
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("パスワードと確認用パスワードが一致しない場合にバリデーションエラーになる", () => {
    const result = signupSchema.safeParse({
      email: "newuser@example.com",
      password: "Password1",
      confirmPassword: "DifferentPass2",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      const confirmIssue = issues.find(
        (e) => e.path.includes("confirmPassword")
      );
      expect(confirmIssue).toBeDefined();
      expect(confirmIssue?.message).toContain("一致");
    }
  });

  it("パスワードが7文字以下でバリデーションエラーになる", () => {
    const result = signupSchema.safeParse({
      email: "newuser@example.com",
      password: "Pass1",
      confirmPassword: "Pass1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      const passwordIssue = issues.find(
        (e) => e.path.includes("password")
      );
      expect(passwordIssue).toBeDefined();
    }
  });

  it("パスワードに英字が含まれない場合はバリデーションエラーになる", () => {
    const result = signupSchema.safeParse({
      email: "newuser@example.com",
      password: "12345678",
      confirmPassword: "12345678",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      const passwordIssue = issues.find(
        (e) => e.path.includes("password")
      );
      expect(passwordIssue).toBeDefined();
    }
  });

  it("パスワードに数字が含まれない場合はバリデーションエラーになる", () => {
    const result = signupSchema.safeParse({
      email: "newuser@example.com",
      password: "PasswordOnly",
      confirmPassword: "PasswordOnly",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      const passwordIssue = issues.find(
        (e) => e.path.includes("password")
      );
      expect(passwordIssue).toBeDefined();
    }
  });

  it("無効なメールアドレスでバリデーションエラーになる", () => {
    const result = signupSchema.safeParse({
      email: "not-an-email",
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      const emailIssue = issues.find((e) => e.path.includes("email"));
      expect(emailIssue).toBeDefined();
    }
  });

  it("バリデーション成功時に正しい型の値が返る", () => {
    const result = signupSchema.safeParse({
      email: "valid@example.com",
      password: "SecurePass1",
      confirmPassword: "SecurePass1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("valid@example.com");
      expect(result.data.password).toBe("SecurePass1");
    }
  });
});
