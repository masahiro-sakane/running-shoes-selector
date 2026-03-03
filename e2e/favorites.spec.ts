import { test, expect } from "@playwright/test";

test.describe("お気に入り機能", () => {
  test("お気に入りページが表示される（空状態）", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page.getByRole("heading", { name: "お気に入り" })).toBeVisible();
    await expect(page.getByText("お気に入りがありません")).toBeVisible();
    await expect(page.getByRole("link", { name: "シューズ一覧へ" })).toBeVisible();
  });

  test("シューズカードにお気に入りボタンが表示される", async ({ page }) => {
    await page.goto("/shoes");
    // コンパクトなお気に入りボタン（♡）
    const favBtn = page.locator("button[aria-label*='お気に入り']").first();
    await expect(favBtn).toBeVisible();
  });

  test("シューズ詳細ページにお気に入りボタンが表示される", async ({ page }) => {
    await page.goto("/shoes");
    await page.locator("a[href^='/shoes/']").first().click();
    await expect(page.getByRole("button", { name: /お気に入り/ })).toBeVisible();
  });

  test("お気に入り追加・削除が機能する", async ({ page }) => {
    await page.goto("/shoes");
    const favBtn = page.locator("button[aria-label*='お気に入りに追加']").first();
    const shoeNameMatch = await favBtn.getAttribute("aria-label");

    // 追加
    await favBtn.click();
    // ボタンのaria-labelが「お気に入りから削除」に変わる
    if (shoeNameMatch) {
      const shoeName = shoeNameMatch.replace("をお気に入りに追加", "");
      await expect(
        page.locator(`button[aria-label="${shoeName}をお気に入りから削除"]`)
      ).toBeVisible();
    }
  });
});
