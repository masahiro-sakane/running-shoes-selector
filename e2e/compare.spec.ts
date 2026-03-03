import { test, expect } from "@playwright/test";

test.describe("シューズ比較機能", () => {
  test("比較ページが表示される（空状態）", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.getByRole("heading", { name: "シューズ比較" })).toBeVisible();
    await expect(page.getByText("比較するシューズがありません")).toBeVisible();
  });

  test("URLパラメータからシューズが読み込まれる", async ({ page }) => {
    // まずシューズIDを一覧から取得する
    await page.goto("/shoes");
    const firstLink = page.locator("a[href^='/shoes/']").first();
    const href = await firstLink.getAttribute("href");
    const shoeId = href?.split("/shoes/")[1];

    if (shoeId) {
      await page.goto(`/compare?ids=${shoeId}`);
      await expect(page.getByRole("heading", { name: "シューズ比較" })).toBeVisible();
      await expect(page.getByText("比較にはあと")).toBeVisible();
    }
  });

  test("2足以上でレーダーチャートと比較テーブルが表示される", async ({ page }) => {
    // シューズ一覧からIDを2つ取得
    await page.goto("/shoes");
    const links = page.locator("a[href^='/shoes/']");
    const count = await links.count();

    if (count >= 2) {
      const id1 = (await links.nth(0).getAttribute("href"))?.split("/shoes/")[1];
      const id2 = (await links.nth(1).getAttribute("href"))?.split("/shoes/")[1];

      if (id1 && id2) {
        await page.goto(`/compare?ids=${id1},${id2}`);
        await expect(page.getByText("スペック比較チャート")).toBeVisible();
        await expect(page.getByText("スペック詳細比較")).toBeVisible();
      }
    }
  });

  test("URLコピーボタンが表示される（2足以上）", async ({ page }) => {
    await page.goto("/shoes");
    const links = page.locator("a[href^='/shoes/']");
    const id1 = (await links.nth(0).getAttribute("href"))?.split("/shoes/")[1];
    const id2 = (await links.nth(1).getAttribute("href"))?.split("/shoes/")[1];

    if (id1 && id2) {
      await page.goto(`/compare?ids=${id1},${id2}`);
      await expect(page.getByRole("button", { name: /URLをコピー/ })).toBeVisible();
    }
  });
});
