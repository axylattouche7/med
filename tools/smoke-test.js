// Test de fumée du simulateur neuro-ophtalmo.
// Ouvre chaque tableau (côtés droit et gauche), répond à 40 cas du quiz,
// bascule FR/EN, et échoue si la page lance une erreur JavaScript.
//
// Usage :
//   npm i playwright@1.47.2         (une seule fois)
//   node tools/smoke-test.js examen-neuro-ophtalmo_11.html
// Variable optionnelle : CHROME_PATH=/chemin/vers/chrome (sinon Chromium de Playwright).

const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const file = path.resolve(process.argv[2] || "examen-neuro-ophtalmo_11.html");
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("file://" + file);
  await page.waitForTimeout(400);

  const keys = await page.$$eval(".pbtn", bs => bs.map(b => b.dataset.k));
  console.log(`${keys.length} tableaux`);
  for (const k of keys) {
    await page.click(`.pbtn[data-k="${k}"]`);
    const bilateral = await page.$eval('#exam-learn [data-r="side"] button[data-v="G"]', b => b.disabled);
    if (bilateral) { console.log(`  ${k}: bilatéral`); continue; }
    await page.click('#exam-learn [data-r="side"] button[data-v="G"]');
    const nameLeft = await page.textContent("#info-learn h2");
    await page.click('#exam-learn [data-r="side"] button[data-v="D"]');
    console.log(`  ${k}: ${nameLeft}`);
  }

  await page.click('#tabs button[data-v="quiz"]');
  for (let i = 0; i < 40; i++) { await page.keyboard.press("1"); await page.click("#q-next"); }
  await page.click('#lang button[data-v="en"]');
  await page.waitForTimeout(200);
  await page.click('#lang button[data-v="fr"]');

  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  if (width > 1400) errors.push(`défilement horizontal : ${width}px`);

  await browser.close();
  if (errors.length) { console.error("ÉCHEC\n" + errors.join("\n")); process.exit(1); }
  console.log("OK");
})();
