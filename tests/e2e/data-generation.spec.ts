import { test, expect } from '@playwright/test';

test.describe('Data Mock Tool E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should generate mock data successfully for valid input', async ({ page }) => {
        // Fill the count
        await page.fill('#count', '5');

        // Click generate
        await page.click('#generate-btn');

        // Wait for result to change from placeholder
        const resultDisplay = page.locator('#result-display');
        await expect(resultDisplay).not.toContainText('Les données générées');

        // Verify result
        await expect(resultDisplay).toContainText('[');
        await expect(resultDisplay).toContainText(']');

        const resultText = await resultDisplay.innerText();
        const data = JSON.parse(resultText);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(5);
    });

    test('should display error message when count exceeds limit', async ({ page }) => {
        // Fill count with a value above 1000
        await page.fill('#count', '1001');

        // Click generate
        await page.click('#generate-btn');

        // Wait for result to change
        const resultDisplay = page.locator('#result-display');
        await expect(resultDisplay).not.toContainText('Les données générées');

        // Verify error message (ignoring the final dot)
        await expect(resultDisplay).toContainText('Requested count exceeds the maximum limit of 1000');
    });
});
