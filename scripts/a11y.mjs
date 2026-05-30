// Real-browser accessibility check for slotted-text contrast.
//
// jsdom can't compute :host backgrounds or run color-contrast, so this loads the
// component in headless Chrome and runs axe-core's color-contrast rule against
// the slotted labels. It fails on either:
//   - violations: the slotted text fails the WCAG contrast ratio, or
//   - incomplete: axe could not determine the background behind the text
//     (the regression that removing a background-painting ancestor would cause).
//
// Uses puppeteer-core against the system Chrome (no bundled Chromium download).
// Override the browser with CHROME_PATH if needed.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.join(root, urlPath === "/" ? "/scripts/a11y-fixture.html" : urlPath);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(filePath)] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

const chromePath = process.env.CHROME_PATH
  || ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/snap/bin/chromium"]
       .find(p => fs.existsSync(p));

if (!chromePath) {
  console.error("No Chrome/Chromium found. Set CHROME_PATH to your browser binary.");
  process.exit(2);
}

const port = 8754;
await new Promise(resolve => server.listen(port, resolve));

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/scripts/a11y-fixture.html`, { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => customElements.get("progress-bar") && document.querySelector("progress-bar").shadowRoot
  );
  await page.addScriptTag({ path: axePath });

  const results = await page.evaluate(async () => {
    const run = await axe.run(document.querySelectorAll("progress-bar"), { runOnly: ["color-contrast"] });
    const fmt = arr => arr.flatMap(rule => rule.nodes.map(node => {
      const data = (node.any[0] && node.any[0].data) || (node.none[0] && node.none[0].data) || {};
      return { target: node.target[0], fg: data.fgColor, bg: data.bgColor, ratio: data.contrastRatio };
    }));
    return { passes: fmt(run.passes), violations: fmt(run.violations), incomplete: fmt(run.incomplete) };
  });

  const checked = results.passes.length + results.violations.length + results.incomplete.length;
  console.log(`axe-core color-contrast on ${checked} slotted label(s):`);
  console.log(`  passes:     ${results.passes.length}`);
  console.log(`  violations: ${results.violations.length}`);
  console.log(`  incomplete: ${results.incomplete.length}`);
  for (const p of results.passes) console.log(`  ✓ ${p.target} — ${p.fg} on ${p.bg} = ${p.ratio}`);
  for (const v of results.violations) console.log(`  ✗ ${v.target} — ${v.fg} on ${v.bg} = ${v.ratio} (below 4.5:1)`);
  for (const v of results.incomplete) console.log(`  ? ${v.target} — background could not be determined`);

  const ok = results.violations.length === 0 && results.incomplete.length === 0;
  if (ok) {
    console.log("✓ slotted text contrast resolves against a host-painted background");
  } else {
    console.error("✗ accessibility regression: slotted-text contrast failed or could not be determined");
  }
  process.exitCode = ok ? 0 : 1;
} finally {
  await browser.close();
  server.close();
}
