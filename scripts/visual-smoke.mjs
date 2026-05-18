import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = new URL("../tmp/visual-smoke/", import.meta.url);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  ...devices["iPhone 15"],
});
const page = await context.newPage();

await page.goto("http://localhost:5175/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Continue" }).click();
await page.getByRole("button", { name: "Next" }).click();
await page.getByRole("button", { name: "Generate Packing Plan" }).click();
await page.getByText("3D pack map").waitFor({ timeout: 6000 });
await page.screenshot({ path: new URL("packing-plan-mobile.png", outDir).pathname, fullPage: true });

const canvasStats = await page.evaluate(async () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return { found: false, dataLength: 0, darkPixels: 0 };

  const source = canvas.toDataURL("image/png");
  const image = new Image();
  image.src = source;
  await image.decode();

  const sample = document.createElement("canvas");
  sample.width = 160;
  sample.height = 160;
  const ctx = sample.getContext("2d");
  if (!ctx) return { found: true, dataLength: source.length, darkPixels: 0 };

  ctx.drawImage(image, 0, 0, sample.width, sample.height);
  const pixels = ctx.getImageData(0, 0, sample.width, sample.height).data;
  let darkPixels = 0;
  let coloredPixels = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    const a = pixels[index + 3];
    if (a > 12 && r + g + b < 690) darkPixels += 1;
    if (a > 12 && Math.max(r, g, b) - Math.min(r, g, b) > 8) coloredPixels += 1;
  }
  return { found: true, dataLength: source.length, darkPixels, coloredPixels };
});

await browser.close();

if (!canvasStats.found || canvasStats.dataLength < 3000 || canvasStats.coloredPixels < 180) {
  throw new Error(`3D canvas smoke check failed: ${JSON.stringify(canvasStats)}`);
}

console.log(JSON.stringify(canvasStats));
