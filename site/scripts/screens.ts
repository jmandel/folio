// bun site/scripts/screens.ts [--no-screens] [--out work/stage4-screens] [--only home,record] [--full]
//
// Serves site/dist under /folio/ (as GitHub Pages will), then drives headless Chromium:
//   1. smoke test: every shown patient's items verify in the browser (0 failures), a one-character
//      tamper fails, and the sharing presentations verify as a recipient would;
//   2. screenshots of each view at 1280×720 and 390×844, light and dark.
// Needs `bun run site:build` first. Chromium: $CHROMIUM, else Playwright's cache, else /usr/bin/chromium.

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { chromium, type Page } from "playwright-core";

const ROOT = resolve(import.meta.dir, "../..");
const DIST = join(ROOT, "site/dist");
const { values } = parseArgs({ options: { "no-screens": { type: "boolean" }, full: { type: "boolean" }, only: { type: "string" }, out: { type: "string", default: "work/stage4-screens" } } });
if (!existsSync(join(DIST, "index.html"))) throw new Error("site/dist is missing: run `bun run site:build` first");

const server = Bun.serve({
  port: 0,
  async fetch(req) {
    const u = new URL(req.url);
    if (!u.pathname.startsWith("/folio/")) return new Response("not found", { status: 404 });
    let p = join(DIST, decodeURIComponent(u.pathname.slice("/folio/".length)));
    if (!p.startsWith(DIST)) return new Response("bad path", { status: 400 });
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
    const f = Bun.file(p);
    return (await f.exists()) ? new Response(f) : new Response("not found", { status: 404 });
  },
});
const BASE = `http://localhost:${server.port}/folio/`;

function chromiumPath(): string | undefined {
  if (process.env.CHROMIUM) return process.env.CHROMIUM;
  const cache = join(homedir(), ".cache/ms-playwright");
  if (existsSync(cache))
    for (const d of readdirSync(cache).filter((d) => d.startsWith("chromium-")).sort().reverse()) {
      const p = join(cache, d, "chrome-linux/chrome");
      if (existsSync(p)) return p;
    }
  return existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined;
}

const browser = await chromium.launch({ executablePath: chromiumPath() });
let failures = 0;
const fail = (m: string) => {
  failures++;
  console.error(`FAIL ${m}`);
};

// ─── smoke test ────────────────────────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => fail(`page error: ${e.message}`));
  const index = await (await fetch(BASE + "data/index.json")).json();
  let verified = 0;
  for (const p of index.patients) {
    await page.goto(`${BASE}#/record/${p.patient}`);
    const sum = page.getByTestId("verify-summary");
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[data-testid="verify-summary"]') as HTMLElement | null;
        return !!el && +el.dataset.total! > 0 && +el.dataset.ok! + +el.dataset.bad! === +el.dataset.total!;
      },
      null,
      { timeout: 60_000 },
    );
    const ok = +(await sum.getAttribute("data-ok"))!;
    const bad = +(await sum.getAttribute("data-bad"))!;
    const total = +(await sum.getAttribute("data-total"))!;
    if (bad || ok !== total || total !== p.items) fail(`${p.patient}: ${ok} ok, ${bad} failed, ${total} shown, ${p.items} expected`);
    verified += ok;
    console.log(`${p.patient}: ${ok}/${total} signatures verified in the browser`);
  }
  // Tamper: one changed character must fail the check.
  await page.goto(`${BASE}#/record/hero`);
  await page.getByRole("link", { name: "The nephrology visit that mentions sertraline" }).click();
  await page.getByText("Signature and provenance").click();
  await page.getByRole("button", { name: "Change one character and check again" }).click();
  const t = await page.getByTestId("tamper-result").innerText();
  if (!/Check fails/.test(t)) fail(`tampered item did not fail: ${t}`);
  else console.log(`tamper: ${t.replace(/\s+/g, " ").slice(0, 160)}`);
  // Sharing: presentations verify as the recipient would, and the withheld words are absent.
  await page.goto(`${BASE}#/sharing`);
  await page.waitForSelector('[data-testid="share-summary"]', { timeout: 30_000 });
  await page.waitForFunction(() => !document.querySelector('[data-testid="share-summary"]')?.textContent?.includes("Updating"));
  const s = page.getByTestId("share-summary");
  const sOk = await s.getAttribute("data-ok"), sTotal = await s.getAttribute("data-total");
  const sText = await s.innerText();
  if (sOk !== sTotal || !/appear nowhere/.test(sText)) fail(`sharing: ${sText}`);
  else console.log(`sharing: ${sText.replace(/\s+/g, " ")}`);
  // Front page: every quoted item verifies, every citation resolves, and every link into the workbench lands.
  await page.goto(`${BASE}#/`);
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="excerpt"]').length > 0 && !document.querySelector('[data-testid="cite"][data-state="wait"]'), null, { timeout: 30_000 });
  const excerpts = await page.getByTestId("excerpt").count();
  const cites = await page.locator('[data-testid="cite"]').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.state));
  if (excerpts !== 6 || cites.some((c) => c !== "ok")) fail(`front page: ${excerpts} excerpts, citations ${cites.join(",")}`);
  else console.log(`front page: ${excerpts} excerpts verified, ${cites.length} citations verified`);
  const links = [...new Set(await page.locator('.home a[href^="#/"]').evaluateAll((els) => els.map((e) => e.getAttribute("href")!)))];
  for (const h of links) {
    await page.goto("about:blank");
    await page.goto(BASE + h);
    const q = new URLSearchParams(h.split("?")[1] ?? "");
    const path = h.replace(/^#\//, "").split("?")[0].split("/");
    try {
      if (path[0] === "record" && q.get("ref")) {
        const r = q.get("ref")!;
        await page.waitForSelector(`mark.ref.active[data-ref="${r}"], .entry.active[data-entry="${r}"]`, { timeout: 15_000 });
        if (q.get("trap")) await page.waitForSelector(`.traps details[data-trap="${q.get("trap")}"][open]`, { timeout: 5_000 });
      } else if (path[0] === "sharing" && q.get("s") === "context-loss") {
        await page.waitForSelector("#context-loss", { timeout: 30_000 });
        await page.waitForTimeout(300);
        const top = await page.locator("#context-loss").evaluate((e) => e.getBoundingClientRect().top);
        if (top < 0 || top > 300) throw new Error(`context-loss note is at y=${Math.round(top)}`);
      } else if (path[0] === "sources") {
        await page.waitForSelector(`.src-tabs a[aria-current="page"][data-src="${path[1]}"]`, { timeout: 10_000 });
      } else if (path[0] === "compiler") {
        await page.waitForSelector(".run-row", { timeout: 10_000 });
      } else if (path[0] === "about") {
        await page.waitForSelector(".prose h1, .prose h2", { timeout: 10_000 });
      } else {
        await page.waitForSelector(".main > *:not(.loading)", { timeout: 10_000 });
      }
      console.log(`deep link ok: ${h}`);
    } catch (e) {
      fail(`deep link ${h}: ${(e as Error).message.split("\n")[0]}`);
    }
  }
  console.log(`smoke: ${verified} items verified, ${failures} failure(s)`);
  await ctx.close();
}

// ─── screenshots ───────────────────────────────────────────────────────────────────────────────
if (!values["no-screens"]) {
  const OUT = resolve(ROOT, values.out!);
  mkdirSync(OUT, { recursive: true });
  const views: { name: string; hash: string; prep?: (p: Page, phone: boolean) => Promise<void> }[] = [
    {
      name: "record",
      hash: "#/record/hero",
      prep: async (p, phone) => {
        if (phone) await p.locator(".row", { hasText: "Nephrology visit" }).first().click();
        else await p.getByRole("link", { name: "The nephrology visit that mentions sertraline" }).click();
        await p.waitForSelector(".doc mark.ref");
        await p.locator('mark.ref[data-ref="dx_na"]').first().click();
        if (!phone) await p.evaluate(() => window.scrollTo(0, 0));
      },
    },
    {
      name: "record-traps",
      hash: "#/record/hero?traps=1&trap=T3&history=1",
      prep: async (p) => {
        await p.locator(".row", { hasText: "Lab report: Potassium" }).last().click();
        await p.locator(".traps details").first().click();
        await p.evaluate(() => window.scrollTo(0, 0));
      },
    },
    {
      name: "home",
      hash: "#/",
      prep: async (p) => void (await p.waitForFunction(() => !document.querySelector('[data-testid="cite"][data-state="wait"]'))),
    },
    {
      name: "deeplink",
      hash: "#/record/hero/northgate/01JCGH7E98RHEM3E2MSH4DMDZS?ref=med_1&traps=1&trap=T1",
      prep: async (p) => void (await p.waitForSelector('[data-testid="ref-pop"]')),
    },
    { name: "sharing", hash: "#/sharing", prep: async (p) => void (await p.waitForSelector(".caveat")) },
    { name: "sources", hash: "#/sources/lakeview?tab=schema" },
    { name: "compiler", hash: "#/compiler/20261014T005518Z-hero-homelog-a2" },
    { name: "about", hash: "#/about/signing?s=context-loss" },
  ];
  for (const [w, h] of [[1280, 720], [390, 844]] as const)
    for (const scheme of ["light", "dark"] as const) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: w < 500 ? 2 : 1 });
      const page = await ctx.newPage();
      for (const v of views.filter((x) => !values.only || values.only.split(",").includes(x.name))) {
        await page.goto("about:blank");
        await page.goto(BASE + v.hash);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(400);
        if (v.prep) await v.prep(page, w < 500);
        await page.waitForTimeout(500);
        const file = join(OUT, `${v.name}-${w}x${h}-${scheme}.png`);
        await page.screenshot({ path: file });
        if (v.name === "home" && values.full) await page.screenshot({ path: file.replace(".png", "-full.png"), fullPage: true });
        console.log(`screenshot ${file.replace(ROOT + "/", "")}`);
      }
      await ctx.close();
    }
}

await browser.close();
server.stop(true);
if (failures) {
  console.error(`${failures} failure(s)`);
  process.exit(1);
}
