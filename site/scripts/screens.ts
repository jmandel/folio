// bun site/scripts/screens.ts [--no-screens] [--no-smoke] [--out work/stage4-screens] [--only home,record] [--full]
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
const { values } = parseArgs({ options: { "no-screens": { type: "boolean" }, "no-smoke": { type: "boolean" }, full: { type: "boolean" }, only: { type: "string" }, out: { type: "string", default: "work/stage4-screens" } } });
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
if (!values["no-smoke"]) {
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
  // Sharing: presentations verify as the recipient would, in each preset, and the withheld words are absent.
  const settle = async () => {
    await page.waitForSelector('[data-testid="share-summary"]', { timeout: 30_000 });
    await page.waitForFunction(() => !document.querySelector('[data-testid="share-summary"]')?.textContent?.includes("Updating"));
    await page.waitForTimeout(200);
    await page.waitForFunction(() => !document.querySelector('[data-testid="share-summary"]')?.textContent?.includes("Updating"));
  };
  const summary = async () => {
    const s = page.getByTestId("share-summary");
    return { ok: await s.getAttribute("data-ok"), total: await s.getAttribute("data-total"), withheld: +(await s.getAttribute("data-withheld"))!, text: (await s.innerText()).replace(/\s+/g, " ") };
  };
  // What Linda reads is computed from the records and the current choice. For each state: the
  // selected choice's text names exactly the withheld and shared sensitive things, only topics that
  // occur are listed, and the context-loss note is present exactly when sertraline is withheld.
  const HP = "your November 2024 hospital admission note";
  const LV = "your July kidney-clinic note";
  const TEXT = {
    private: `The clinic will not see your depression diagnosis (in ${HP}) and sertraline (on three medicine lists and in one sentence of ${LV}). It will see everything else in these five records.`,
    everything: "The clinic will see everything in these five records, including your depression diagnosis and sertraline.",
    private_meds: `The clinic will not see your depression diagnosis (in ${HP}). It will see sertraline (on three medicine lists and in one sentence of ${LV}), and everything else in these five records. Doctors know what sertraline is usually taken for, so the clinic may guess why you take it.`,
  };
  const ABSENT = "These records contain nothing about alcohol or drug use, sexual or reproductive health, HIV or other sexually transmitted infections, or genetic tests.";
  const state = async () => ({
    preset: await page.getByTestId("policy-panel").getAttribute("data-preset"),
    text: (await page.locator(".preset.on [data-testid='choice-text']").innerText()).replace(/\s+/g, " ").trim(),
    topics: await page.locator("[data-testid='topics'] [data-topic]").evaluateAll((els) => els.map((e) => `${(e as HTMLElement).dataset.topic}:${(e as HTMLElement).dataset.private}`)),
    topicText: (await page.getByTestId("topics").innerText()).replace(/\s+/g, " "),
    contextLoss: await page.getByTestId("context-loss").count(),
    suggestion: await page.getByTestId("suggestion").count(),
  });
  const expectState = async (name: string, want: { preset: string; text: string; priv: string; held: string[]; seen: string[]; loss: boolean; withheld: number }) => {
    await settle();
    const r = await summary();
    const st = await state();
    const problems: string[] = [];
    if (r.ok !== r.total) problems.push(`verified ${r.ok}/${r.total}`);
    if (r.withheld !== want.withheld) problems.push(`withheld ${r.withheld}`);
    if (st.preset !== want.preset) problems.push(`preset ${st.preset}`);
    if (st.text !== want.text) problems.push(`text "${st.text}"`);
    if (st.topics.join() !== `mental_health:${want.priv}`) problems.push(`topics ${st.topics.join()}`);
    if (!st.topicText.includes(ABSENT)) problems.push("absent-topics line missing");
    if (/Nothing in these records/.test(st.topicText)) problems.push("per-topic 'Nothing in these records' row");
    const held = /Kept private: ([^.]*)\./.exec(st.topicText)?.[1] ?? "";
    const seen = /The clinic will see: ([^.]*)\./.exec(st.topicText)?.[1] ?? "";
    if (held !== want.held.join(" and ") || seen !== want.seen.join(" and ")) problems.push(`topic lines held "${held}" seen "${seen}"`);
    if ((st.contextLoss > 0) !== want.loss || (st.suggestion > 0) !== want.loss) problems.push(`context-loss ${st.contextLoss}, suggestion ${st.suggestion}`);
    if (want.loss && !(await page.getByTestId("context-loss").innerText()).includes("Chlorthalidone likely")) problems.push("context-loss quote missing");
    if (problems.length) fail(`sharing ${name}: ${problems.join("; ")}`);
    else console.log(`sharing ${name}: ${r.text}`);
  };
  const D = "your depression diagnosis", S = "sertraline";
  for (const [preset, w] of [
    ["private", { preset: "private", text: TEXT.private, priv: "1", held: [D, S], seen: [], loss: true, withheld: 5 }],
    ["everything", { preset: "everything", text: TEXT.everything, priv: "0", held: [], seen: [D, S], loss: false, withheld: 0 }],
    ["private_meds", { preset: "private_meds", text: TEXT.private_meds, priv: "1", held: [D], seen: [S], loss: false, withheld: 1 }],
  ] as const) {
    await page.goto("about:blank");
    await page.goto(`${BASE}#/sharing?preset=${preset}`);
    await expectState(preset, w);
    if (preset === "private" && !/appears? nowhere/.test((await summary()).text)) fail("sharing private: withheld words found in what is sent");
  }
  // Custom states from the topic toggle.
  await page.goto("about:blank");
  await page.goto(`${BASE}#/sharing`);
  await settle();
  await page.locator("[data-topic='mental_health'] input").click();
  await expectState("custom (mental health unticked)", { preset: "custom", text: TEXT.everything, priv: "0", held: [], seen: [D, S], loss: false, withheld: 0 });
  await page.goto("about:blank");
  await page.goto(`${BASE}#/sharing?preset=everything`);
  await settle();
  await page.locator("[data-topic='mental_health'] input").click();
  await expectState("custom (only mental health ticked)", { preset: "custom", text: TEXT.private, priv: "1", held: [D, S], seen: [], loss: true, withheld: 5 });
  // The suggested refinement re-shares the medicine and keeps the diagnosis private.
  await page.goto("about:blank");
  await page.goto(`${BASE}#/sharing`);
  await settle();
  await page.getByTestId("suggestion").getByRole("button").click();
  await expectState("after the suggestion", { preset: "private_meds", text: TEXT.private_meds, priv: "1", held: [D], seen: [S], loss: false, withheld: 1 });
  // The recorded conversation: playing it sets its starting choice, the agreed change is applied,
  // and changing settings afterwards is noticed.
  {
    await page.goto("about:blank");
    await page.goto(`${BASE}#/sharing?preset=everything&chat=1`);
    await settle();
    const chat = page.getByTestId("chat");
    const chatState = async () => (await page.getByTestId("chat-state").innerText()).replace(/\s+/g, " ");
    const problems: string[] = [];
    if (!(await chatState()).includes("This example conversation starts from “Keep sensitive topics private”")) problems.push(`intro: ${await chatState()}`);
    await chat.getByRole("button", { name: "Play" }).click();
    await page.waitForSelector("[data-testid='policy-panel'][data-preset='private']", { timeout: 5_000 });
    await page.waitForSelector("[data-testid='chat'][data-shown='2']", { timeout: 10_000 });
    if ((await page.getByTestId("policy-panel").getAttribute("data-preset")) !== "private") problems.push("before agreement, choice is not private");
    await page.waitForSelector("[data-testid='chat'][data-shown='6']", { timeout: 20_000 });
    await page.waitForSelector("[data-testid='policy-panel'][data-preset='private_meds']", { timeout: 5_000 });
    if (await chat.getAttribute("data-off-track")) problems.push("off track after replay");
    await page.locator(".preset[data-preset='everything'] input").click();
    await page.waitForSelector("[data-testid='chat'][data-off-track='1']", { timeout: 5_000 });
    if (!(await chatState()).includes("no longer match")) problems.push(`after change: ${await chatState()}`);
    await chat.getByRole("button", { name: "Replay from the start" }).click();
    await page.waitForSelector("[data-testid='policy-panel'][data-preset='private']", { timeout: 5_000 });
    if (await chat.getAttribute("data-off-track")) problems.push("off track after replaying");
    if (problems.length) fail(`sharing chat: ${problems.join("; ")}`);
    else console.log("sharing chat: replay sets “Keep sensitive topics private”, applies the agreed change, and notices later changes");
  }
  // Front page: every quoted item verifies, every citation resolves, and every link into the workbench lands.
  await page.goto(`${BASE}#/`);
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="excerpt"]').length > 0 && !document.querySelector('[data-testid="cite"][data-state="wait"]'), null, { timeout: 30_000 });
  while (await page.locator("button.cite.more").count()) await page.locator("button.cite.more").first().click();
  await page.waitForFunction(() => !document.querySelector('[data-testid="cite"][data-state="wait"]'), null, { timeout: 30_000 });
  const excerpts = await page.getByTestId("excerpt").count();
  const cites = await page.locator('[data-testid="cite"]').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.state));
  if (excerpts !== 6 || cites.some((c) => c !== "ok")) fail(`front page: ${excerpts} excerpts, citations ${cites.join(",")}`);
  else console.log(`front page: ${excerpts} excerpts verified, ${cites.length} citations verified`);
  if ((await page.getByTestId("merged").getAttribute("data-kind")) !== "compiled-mapper") fail("front page: merged example is not compiled-mapper output");
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
    { name: "sharing-everything", hash: "#/sharing?preset=everything", prep: async (p) => void (await p.waitForSelector('[data-testid="share-summary"]')) },
    { name: "sharing-meds", hash: "#/sharing?preset=private_meds", prep: async (p) => void (await p.waitForSelector('[data-testid="share-summary"]')) },
    {
      name: "sharing-custom",
      hash: "#/sharing?preset=private_meds",
      prep: async (p) => {
        await p.waitForSelector('[data-testid="detail-layer"]');
        await p.locator('[data-testid="detail-layer"] > summary').click();
        await p.locator('.unit[data-key$="#na_sertraline"] input').click();
        await p.waitForSelector('[data-testid="policy-panel"][data-preset="custom"]');
        await p.locator('[data-testid="detail-layer"] > summary').click();
        await p.waitForSelector(".caveat");
        await p.evaluate(() => window.scrollTo(0, 0));
      },
    },
    {
      name: "sharing-detail",
      hash: "#/sharing?detail=1",
      prep: async (p) => {
        await p.waitForSelector(".caveat");
        await p.locator('[data-testid="detail-layer"] .pick').first().evaluate((e) => e.scrollIntoView({ block: "start" }));
      },
    },
    {
      name: "sharing-chat",
      hash: "#/sharing?chat=recorded&turns=2",
      prep: async (p) => {
        await p.waitForSelector('[data-testid="chat-proposal"]');
        await p.getByTestId("chat-state").evaluate((e) => window.scrollBy(0, e.getBoundingClientRect().top - 70));
      },
    },
    {
      name: "sharing-chat-applied",
      hash: "#/sharing?chat=recorded",
      prep: async (p) => {
        await p.waitForSelector('[data-testid="policy-panel"][data-preset="private_meds"]');
        await p.locator('[data-testid="chat-proposal"]').last().evaluate((e) => e.scrollIntoView({ block: "center" }));
      },
    },
    {
      name: "sharing-chat-stale",
      hash: "#/sharing?chat=recorded",
      prep: async (p) => {
        await p.waitForSelector('[data-testid="policy-panel"][data-preset="private_meds"]');
        await p.locator(".preset[data-preset='everything'] input").click();
        await p.waitForSelector("[data-testid='chat'][data-off-track='1']");
        await p.getByTestId("chat-state").evaluate((e) => e.scrollIntoView({ block: "center" }));
      },
    },
    { name: "sources", hash: "#/sources/lakeview?tab=schema" },
    {
      name: "home-merged",
      hash: "#/",
      prep: async (p) => {
        await p.waitForFunction(() => !document.querySelector('[data-testid="cite"][data-state="wait"]'));
        await p.getByTestId("merged").evaluate((e) => e.scrollIntoView({ block: "start" }));
      },
    },
    {
      name: "home-tour",
      hash: "#/",
      prep: async (p) => void (await p.locator("#h-tour").evaluate((e) => e.scrollIntoView({ block: "start" }))),
    },
    { name: "compiler", hash: "#/compiler/20261014T005518Z-hero-homelog-a2" },
    { name: "compiler-results", hash: "#/compiler/results", prep: async (p) => void (await p.waitForSelector('[data-testid="mapper-results"]')) },
    { name: "compiler-mapper", hash: "#/compiler/20261014T153538312Z-nujp", prep: async (p) => void (await p.waitForSelector('[data-testid="transform"]')) },
    {
      name: "compiler-mapper-code",
      hash: "#/compiler/20261014T153538312Z-nujp",
      prep: async (p) => {
        await p.waitForSelector('[data-testid="transform"]');
        await p.getByTestId("transform").evaluate((e) => e.scrollIntoView({ block: "center" }));
      },
    },
    { name: "record-chart", hash: "#/record/hero?chart=1", prep: async (p) => void (await p.waitForSelector('[data-testid="mapped-chart"]')) },
    { name: "about", hash: "#/about/signing?s=context-loss" },
    {
      name: "about-overview",
      hash: "#/about",
      prep: async (p) => void (await p.getByRole("heading", { name: "What this site shows" }).evaluate((e) => e.scrollIntoView({ block: "start" }))),
    },
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
