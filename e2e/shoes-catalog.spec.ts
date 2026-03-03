import { test, expect } from "@playwright/test";

test.describe("シューズカタログ", () => {
  test("トップページが表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("RunSelect")).toBeVisible();
    await expect(page.getByRole("link", { name: "シューズ診断を始める" })).toBeVisible();
    await expect(page.getByRole("link", { name: "シューズ一覧を見る" })).toBeVisible();
  });

  test("シューズ一覧ページが表示される", async ({ page }) => {
    await page.goto("/shoes");
    await expect(page.getByRole("heading", { name: /シューズ一覧/ })).toBeVisible();
    // シューズカードが複数表示される
    const cards = page.locator("a[href^='/shoes/']");
    await expect(cards.first()).toBeVisible();
  });

  test("ブランドフィルタが機能する", async ({ page }) => {
    await page.goto("/shoes");
    // Nikeチェックボックスをクリック
    const nikeCheckbox = page.getByLabel("Nike");
    await nikeCheckbox.check();
    // URLにbrand=Nikeが含まれる
    await expect(page).toHaveURL(/brand=Nike/);
  });

  test("キーワード検索が機能する", async ({ page }) => {
    await page.goto("/shoes");
    const searchInput = page.getByPlaceholder(/検索/);
    await searchInput.fill("Pegasus");
    // デバウンス後にURLが更新される
    await expect(page).toHaveURL(/q=Pegasus/, { timeout: 2000 });
  });

  test("シューズ詳細ページが表示される", async ({ page }) => {
    await page.goto("/shoes");
    const firstCard = page.locator("a[href^='/shoes/']").first();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    await expect(page).toHaveURL(href!);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // スペックテーブルが表示される
    await expect(page.getByText("定価")).toBeVisible();
  });

  test("ページネーションが機能する", async ({ page }) => {
    await page.goto("/shoes");
    // 2ページ目に移動できるか確認（シューズ数が12以上の場合）
    const nextBtn = page.getByRole("link", { name: "次へ" });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await expect(page).toHaveURL(/page=2/);
    }
  });
});
