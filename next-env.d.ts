import { test, expect } from '@playwright/test';

test('dashboard does not expose bulk operation controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('トップページは状況確認')).toBeVisible();
  await expect(page.getByText('選択国を出品候補に確定')).toHaveCount(0);
});

test('listing drafts page exposes country selection', async ({ page }) => {
  await page.goto('/listing-drafts?marketplace=SHOPEE');
  await expect(page.getByText('国別出品候補')).toBeVisible();
  await expect(page.getByText('A/B判定のみ選択')).toBeVisible();
});
