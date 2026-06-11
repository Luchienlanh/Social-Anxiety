const fs = require('fs');
const path = require('path');
const { test } = require('playwright/test');

const screenshotsDir = path.join(__dirname, 'docs', 'screenshots');

test('capture real frontend screenshots for README', async ({ page }) => {
  fs.mkdirSync(screenshotsDir, { recursive: true });

  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.goto('http://localhost:5501/html/home.html', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: path.join(screenshotsDir, 'home.png'),
    fullPage: true
  });

  await page.goto('http://localhost:5501/html/test.html', { waitUntil: 'networkidle' });

  await page.fill('#ageInput', '29');
  await page.selectOption('#genderSelect', { label: 'Female' });
  await page.fill('#occupationInput', 'Artist');
  await page.click('[data-sleep-duration][data-value="6-8h"]');
  await page.fill('#physicalActivityInput', '4');
  await page.evaluate(() => {
    const input = document.querySelector('#dietQualityInput');
    input.value = '7';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.selectOption('#caffeinInput', { label: 'Moderate' });
  await page.click('[data-smoking-btn][data-value="no"]');
  await page.fill('#alcoholInput', '1');
  await page.fill('#heartRateInput', '82');
  await page.fill('#breathingRateInput', '16');
  await page.evaluate(() => {
    const input = document.querySelector('#sweatingIntensityInput');
    input.value = '3';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.click('[data-stress-level][data-value="6"]');
  await page.fill('#therapySessionsInput', '1');

  await page.waitForTimeout(1000);
  await page.selectOption('#modelSelect', 'final');
  await page.click('#comparisonToggle');

  await page.screenshot({
    path: path.join(screenshotsDir, 'assessment.png'),
    fullPage: true
  });

  await Promise.all([
    page.waitForURL('**/result.html', { timeout: 60000 }),
    page.click('#assessmentForm button[type="submit"]')
  ]);

  await page.waitForFunction(() => {
    return document.querySelector('#scorePercent')?.textContent !== '--%';
  }, { timeout: 60000 });

  await page.screenshot({
    path: path.join(screenshotsDir, 'result.png'),
    fullPage: true
  });
});
