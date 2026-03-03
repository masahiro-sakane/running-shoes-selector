import { test, expect } from "@playwright/test";

test.describe("クイック診断", () => {
  test("診断フォームが表示される", async ({ page }) => {
    await page.goto("/recommend");
    await expect(page.getByRole("heading", { name: "クイック診断" })).toBeVisible();
    await expect(page.getByText("フルマラソンの目標タイムは？")).toBeVisible();
    // 「次へ」ボタンは最初は無効
    const nextBtn = page.getByRole("button", { name: "次へ" });
    await expect(nextBtn).toBeDisabled();
  });

  test("ステップ1で選択すると次へ進める", async ({ page }) => {
    await page.goto("/recommend");
    await page.getByText("サブ4").click();
    const nextBtn = page.getByRole("button", { name: "次へ" });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
    await expect(page.getByText("月間の走行距離は？")).toBeVisible();
  });

  test("戻るボタンが機能する", async ({ page }) => {
    await page.goto("/recommend");
    await page.getByText("サブ4").click();
    await page.getByRole("button", { name: "次へ" }).click();
    await expect(page.getByText("月間の走行距離は？")).toBeVisible();
    await page.getByRole("button", { name: "戻る" }).click();
    await expect(page.getByText("フルマラソンの目標タイムは？")).toBeVisible();
  });

  test("全ステップを経て診断結果ページに遷移する", async ({ page }) => {
    await page.goto("/recommend");

    // Step 1: 目標タイム
    await page.getByText("サブ4").click();
    await page.getByRole("button", { name: "次へ" }).click();

    // Step 2: 月間距離
    await page.getByText("100〜200km").click();
    await page.getByRole("button", { name: "次へ" }).click();

    // Step 3: 足の特性（プロネーション + 幅）
    await page.getByText("ニュートラル").click();
    await page.getByText("標準").click();
    await page.getByRole("button", { name: "次へ" }).click();

    // Step 4: 重視ポイント
    await page.getByText("クッション性").click();
    await page.getByRole("button", { name: "次へ" }).click();

    // Step 5: 予算（任意）
    await page.getByRole("button", { name: "診断結果を見る" }).click();

    // 結果ページに遷移
    await expect(page).toHaveURL(/\/recommend\/result/);
    await expect(page.getByRole("heading", { name: "診断結果" })).toBeVisible();
  });

  test("診断結果ページに推奨シューズが表示される", async ({ page }) => {
    await page.goto(
      "/recommend/result?targetTimeCategory=sub4&monthlyDistanceKm=150&pronationType=neutral&footWidth=standard&priorityFactor=cushion"
    );
    await expect(page.getByRole("heading", { name: "診断結果" })).toBeVisible();
    await expect(page.getByText(/おすすめシューズ TOP/)).toBeVisible();
    // 少なくとも1件の推奨シューズが表示される
    await expect(page.getByText("選出理由")).toBeVisible();
  });

  test("診断結果から比較ページへ遷移できる", async ({ page }) => {
    await page.goto(
      "/recommend/result?targetTimeCategory=sub4&monthlyDistanceKm=150&pronationType=neutral&footWidth=standard&priorityFactor=cushion"
    );
    const compareBtn = page.getByRole("link", { name: "上位シューズを比較する" });
    await expect(compareBtn).toBeVisible();
    await compareBtn.click();
    await expect(page).toHaveURL(/\/compare/);
  });
});
