import { describe, expect, test } from "bun:test";
import {
  listUnits, narrativeWithMarkers, parseMarkdown, present, presentWithholding, renderVerified, sign, toMarkdown, verify,
  WITHHELD_MARKER, type Item,
} from "../src/index.ts";
import { fixtures, keyOf, localResolver } from "./fixtures.ts";

const resolver = localResolver();
const all = fixtures();
const find = (file: string) => all.find((f) => f.file === file)!;

// --- helpers to tamper with compact SD-JWTs ---
const b64uJson = (s: string) => JSON.parse(Buffer.from(s, "base64url").toString("utf8"));
const toB64u = (v: unknown) => Buffer.from(JSON.stringify(v), "utf8").toString("base64url");
/** Rewrites the issuer-signed JWT payload, keeping the original signature. */
function tamperJwt(sdjwt: string, edit: (payload: any) => void): string {
  const [jwt, ...rest] = sdjwt.split("~");
  const [h, p, s] = jwt.split(".");
  const payload = b64uJson(p);
  edit(payload);
  return [[h, toB64u(payload), s].join("."), ...rest].join("~");
}
/** Rewrites the disclosure for unit `id`. */
function tamperDisclosure(sdjwt: string, id: string, edit: (value: any) => void): string {
  const parts = sdjwt.split("~");
  const i = parts.findIndex((d, k) => k > 0 && d && b64uJson(d)[1] === id);
  if (i < 0) throw new Error(`no disclosure ${id}`);
  const arr = b64uJson(parts[i]);
  edit(arr[2]);
  parts[i] = toB64u(arr);
  return parts.join("~");
}
/** Everything a receiver can read from a compact SD-JWT, decoded. */
const decodedText = (sdjwt: string) =>
  sdjwt.split("~").filter(Boolean).map((p, i) =>
    i === 0 ? p.split(".").slice(0, 2).map((x) => Buffer.from(x, "base64url").toString()).join("\n") : Buffer.from(p, "base64url").toString(),
  ).join("\n");
/** Changes one character of a string. */
const flip = (s: string, at = 0) => s.slice(0, at) + (s[at] === "x" ? "y" : "x") + s.slice(at + 1);

describe("sign → full presentation → verify restores every fixture exactly", () => {
  test.each(all.map((f) => [`${f.source}/${f.file}`, f] as const))("%s", async (_n, f) => {
    const item = parseMarkdown(f.text);
    const signed = await sign(item, keyOf(f.source));
    const v = await verify(signed, resolver, { expectedIssuer: item.issuer });
    expect(v.complete).toBe(true);
    expect(v.item).toEqual(item);
    expect(Object.keys(v.item!.payload)).toEqual(Object.keys(item.payload));
    // Same Markdown, modulo the hand formatting of the payload JSON.
    expect(parseMarkdown(toMarkdown(v.item!))).toEqual(item);
  });
});

describe("tamper detection", async () => {
  const f = find("2026-07-13-nephrology-new-visit.folio.md");
  const item = parseMarkdown(f.text);
  const signed = await sign(item, keyOf("lakeview"));
  // A presentation that withholds the sertraline span; tampering is checked on it.
  const pres = await presentWithholding(signed, ["na_sertraline"]);

  test("untampered presentation verifies", async () => {
    expect((await verify(pres, resolver)).complete).toBe(false);
  });
  test("one character changed in a disclosed span", async () => {
    const bad = tamperDisclosure(pres, "dx_na", (v) => (v.spans[0].text = flip(v.spans[0].text, 3)));
    await expect(verify(bad, resolver)).rejects.toThrow(/Unreferenced disclosure|verification failed/);
  });
  test("one character changed in prose outside spans", async () => {
    const bad = tamperJwt(pres, (p) => (p.narrative[0] = flip(p.narrative[0], 5)));
    await expect(verify(bad, resolver)).rejects.toThrow(/verification failed/);
  });
  test("one character changed in the envelope", async () => {
    const bad = tamperJwt(pres, (p) => (p.envelope.patient = flip(p.envelope.patient, 4)));
    await expect(verify(bad, resolver)).rejects.toThrow(/verification failed/);
  });
  test("one character changed in a payload value", async () => {
    const bad = tamperDisclosure(pres, "rx_finerenone", (v) => (v.entry.DRUG_NAME = flip(v.entry.DRUG_NAME, 0)));
    await expect(verify(bad, resolver)).rejects.toThrow(/Unreferenced disclosure|verification failed/);
    const bad2 = tamperDisclosure(pres, "wt", (v) => (v.entry.VALUE_NUM = 86.3));
    await expect(verify(bad2, resolver)).rejects.toThrow();
  });
  test("a forged disclosure for the withheld span", async () => {
    const forged = toB64u(["c2FsdHNhbHRzYWx0", "na_sertraline", { spans: [{ slot: 2, text: "nothing to see" }] }]);
    await expect(verify(pres + forged + "~", resolver)).rejects.toThrow();
  });
  test("a disclosure dropped from the signed JWT's digests cannot be re-added from another item", async () => {
    const other = await sign(parseMarkdown(find("2026-09-14-finerenone-hold.folio.md").text), keyOf("lakeview"));
    const foreign = other.split("~").slice(1, 2)[0];
    await expect(verify(pres + foreign + "~", resolver)).rejects.toThrow();
  });
  test("signature by another issuer's key", async () => {
    const forgedIssuer = { ...item, issuer: "did:web:northgate-fm.example" };
    const s = await sign(forgedIssuer, keyOf("northgate"));
    // Claims to be Lakeview's item but is signed by Northgate: rejected when the caller expects Lakeview.
    await expect(verify(s, resolver, { expectedIssuer: "did:web:lakeview-labs.example" })).rejects.toThrow(/expected/);
    const relabeled = tamperJwt(s, (p) => { p.iss = "did:web:lakeview-labs.example"; p.envelope.issuer = p.iss; });
    await expect(verify(relabeled, resolver)).rejects.toThrow();
  });
  test("a key binding JWT is refused", async () => {
    await expect(verify(pres + "eyJhbGciOiJub25lIn0.e30.", resolver)).rejects.toThrow(/key binding/);
  });
});

describe("sertraline withheld (T19)", async () => {
  test("Lakeview 2026-07-13 nephrology note without the sertraline span", async () => {
    const item = parseMarkdown(find("2026-07-13-nephrology-new-visit.folio.md").text);
    const signed = await sign(item, keyOf("lakeview"));
    const pres = await presentWithholding(signed, ["na_sertraline"]);
    expect(decodedText(pres)).not.toMatch(/sertraline/i);
    expect(decodedText(signed)).toMatch(/sertraline/i);
    const v = await verify(pres, resolver);
    expect(v.complete).toBe(false);
    expect(v.item).toBeUndefined();
    expect(v.withheld.units).toBe(1);
    expect(v.withheld.slots).toEqual([2]);
    const text = narrativeWithMarkers(v);
    expect(text).not.toMatch(/sertraline/i);
    expect(text).toContain(`Chlorthalidone likely; ${WITHHELD_MARKER}. No change today.`);
    expect(text).toContain(`<ref id="dx_na">Na 132</ref>`);
    expect(Object.keys(v.payload)).toEqual(Object.keys(item.payload)); // na_sertraline has no entry
    const rendered = renderVerified(v);
    expect(rendered).toMatch(/^PARTIAL ITEM/);
    expect(rendered).toContain(WITHHELD_MARKER);
    expect(JSON.stringify(v)).not.toMatch(/sertraline/i);
  });

  test("HomeLog 2026-05-02 medicine list without med_5", async () => {
    const item = parseMarkdown(find("2026-05-02-my-medicines.folio.md").text);
    const signed = await sign(item, keyOf("homelog"));
    const pres = await presentWithholding(signed, ["med_5"]);
    expect(decodedText(pres)).not.toMatch(/sertraline/i);
    const v = await verify(pres, resolver);
    expect(v.complete).toBe(false);
    expect(v.withheld).toEqual({ slots: [], units: 1 });
    expect(Object.keys(v.payload)).toEqual(Object.keys(item.payload).filter((k) => k !== "med_5"));
    expect(JSON.stringify(v)).not.toMatch(/sertraline/i);
    const rendered = renderVerified(v);
    expect(rendered).toMatch(/^PARTIAL ITEM/);
    expect(rendered).toContain(`${WITHHELD_MARKER} 1 part(s) withheld`);
  });

  test("Riverside admission H&P: sertraline alone, or depression alone", async () => {
    const item = parseMarkdown(find("2024-11-02-admission-hp.folio.md").text);
    const signed = await sign(item, keyOf("riverside"));
    const units = await listUnits(signed);
    expect(units.map((u) => u.id)).toEqual(expect.arrayContaining(["med_sertraline", "hx_mdd"]));
    const noMdd = await verify(await presentWithholding(signed, ["hx_mdd"]), resolver);
    expect(noMdd.withheld.slots.length).toBe(2); // hx_mdd has two spans
    expect(noMdd.payload.med_sertraline).toBeDefined();
    expect(JSON.stringify(noMdd)).not.toMatch(/depress/i);
    const onlyTwo = await verify(await present(signed, ["med_sertraline", "precipitant"]), resolver);
    expect(onlyTwo.disclosed.sort()).toEqual(["med_sertraline", "precipitant"]);
    expect(onlyTwo.parts.filter((p) => p.kind === "withheld").length).toBeGreaterThan(3);
  });

  test("withholding everything still shows envelope and prose, with markers", async () => {
    const item = parseMarkdown(find("2026-07-13-nephrology-new-visit.folio.md").text);
    const v = await verify(await present(await sign(item, keyOf("lakeview")), []), resolver);
    expect(v.disclosed).toEqual([]);
    expect(v.withheld.units).toBe(Object.keys(item.payload).length + 2); // + na_sertraline, sglt2_decision
    expect(narrativeWithMarkers(v)).toStartWith("New patient. Referred by Northgate FM");
  });

  test("presenting an unknown unit is an error", async () => {
    const item = parseMarkdown(find("2026-07-13-nephrology-new-visit.folio.md").text);
    await expect(present(await sign(item, keyOf("lakeview")), ["nope"])).rejects.toThrow(/nope/);
  });
});

test("sign refuses invalid items and foreign keys", async () => {
  const item = parseMarkdown(find("2026-07-13-nephrology-new-visit.folio.md").text);
  await expect(sign({ ...item, recorded: "yesterday" } as Item, keyOf("lakeview"))).rejects.toThrow(/recorded/);
  await expect(sign(item, keyOf("homelog"))).rejects.toThrow(/does not match/);
});
