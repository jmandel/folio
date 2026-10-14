import { useEffect, useMemo, useState } from "react";
import { listUnits, presentWithholding, verify, type UnitInfo, type VerifiedItem } from "@folio/core";
import type { Index } from "../lib/data.ts";
import { href, type Route } from "../lib/route.ts";
import { usePatientRecord, type RecordItem } from "../lib/record.ts";
import { fmtDate, itemTitle, summaryLine } from "../lib/describe.ts";
import { newResolver } from "../lib/verify.ts";
import { ItemDoc, Seal } from "../components/ItemDoc.tsx";

// Items a referral to the kidney clinic would plausibly carry.
const DEFAULT_ITEMS = [
  ["riverside", "2024-11-02-admission-hp.folio.md"],
  ["riverside", "2024-11-05-discharge-summary.folio.md"],
  ["northgate", "2024-11-12-visit-note.folio.md"],
  ["homelog", "2026-05-02-my-medicines.folio.md"],
  ["lakeview", "2026-07-13-new-visit.folio.md"],
];

const SENSITIVE = /sertralin|zoloft|depress|\bmdd\b|\bF3[23](\.\d+)?\b|behavioral health/i;
const isSensitive = (u: UnitInfo) => SENSITIVE.test(u.spanTexts.join(" ") + " " + JSON.stringify(u.entry ?? "")) || (u.entry as any)?.restricted === true;

interface Received {
  ref: string;
  presentation: string;
  result: { ok: true; v: VerifiedItem } | { ok: false; error: string };
}

export function SharingView({ index }: { index: Index; route: Route }) {
  const rec = usePatientRecord(index, "hero");
  const [chosen, setChosen] = useState<string[] | null>(null);
  const [units, setUnits] = useState<Map<string, UnitInfo[]>>(new Map());
  const [withheld, setWithheld] = useState<Map<string, Set<string>>>(new Map());
  const [preset, setPreset] = useState(true);
  const [received, setReceived] = useState<Received[] | null>(null);
  const [busy, setBusy] = useState(false);

  // Initial selection.
  useEffect(() => {
    if (!rec || chosen) return;
    setChosen(DEFAULT_ITEMS.map(([s, f]) => rec.items.find((i) => i.source.dir === s && i.file.file === f)?.ref).filter((x): x is string => !!x));
  }, [rec, chosen]);

  // Units of each chosen item.
  useEffect(() => {
    if (!rec || !chosen) return;
    (async () => {
      const m = new Map(units);
      for (const ref of chosen) if (!m.has(ref)) m.set(ref, await listUnits(rec.items.find((i) => i.ref === ref)!.file.sdJwt));
      setUnits(m);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec, chosen]);

  // Applying the preset marks every sensitive unit as withheld (and clears that when turned off).
  useEffect(() => {
    setWithheld((w) => {
      const n = new Map(w);
      for (const [ref, us] of units) {
        const s = new Set(n.get(ref) ?? []);
        for (const u of us) if (isSensitive(u)) preset ? s.add(u.id) : s.delete(u.id);
        n.set(ref, s);
      }
      return n;
    });
  }, [preset, units]);

  // Make presentations and verify them as the receiver would: fresh resolver, nothing shared with the record view.
  useEffect(() => {
    if (!rec || !chosen || chosen.some((r) => !units.has(r))) return;
    let live = true;
    setBusy(true);
    (async () => {
      const resolver = newResolver();
      const out: Received[] = [];
      for (const ref of chosen) {
        const it = rec.items.find((i) => i.ref === ref)!;
        const pres = await presentWithholding(it.file.sdJwt, withheld.get(ref) ?? []);
        try {
          out.push({ ref, presentation: pres, result: { ok: true, v: await verify(pres, resolver) } });
        } catch (e) {
          out.push({ ref, presentation: pres, result: { ok: false, error: (e as Error).message } });
        }
      }
      if (live) {
        setReceived(out);
        setBusy(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [rec, chosen, units, withheld]);

  const toggle = (ref: string, id: string) =>
    setWithheld((w) => {
      const n = new Map(w);
      const s = new Set(n.get(ref) ?? []);
      s.has(id) ? s.delete(id) : s.add(id);
      n.set(ref, s);
      return n;
    });

  const stats = useMemo(() => {
    if (!received) return null;
    const ok = received.filter((r) => r.result.ok).length;
    const withheldUnits = received.reduce((n, r) => n + (r.result.ok ? r.result.v.withheld.units : 0), 0);
    const totalUnits = received.reduce((n, r) => n + (r.result.ok ? r.result.v.withheld.units + r.result.v.disclosed.length : 0), 0);
    const decoded = received.map((r) => decodeAll(r.presentation)).join("\n");
    const sensitiveHits = (decoded.match(new RegExp(SENSITIVE.source, "gi")) ?? []).length;
    const bytes = received.reduce((n, r) => n + r.presentation.length, 0);
    return { ok, withheldUnits, totalUnits, sensitiveHits, bytes };
  }, [received]);

  const contexts = useMemo(() => {
    const out: { title: string; text: string }[] = [];
    for (const r of received ?? []) {
      if (!r.result.ok) continue;
      const parts = r.result.v.parts;
      parts.forEach((p, i) => {
        if (p.kind !== "withheld") return;
        // One quotation per run of adjacent withheld slots.
        const prev = parts.slice(0, i).reverse().find((x) => !(x.kind === "prose" && !x.text.trim()));
        if (prev?.kind === "withheld") return;
        const beforeLines = textOf(parts.slice(0, i)).split("\n");
        let before = beforeLines.pop() ?? "";
        if (before.replace(/^\s*([-*]|\d+\.)\s*/, "").length < 30 && beforeLines.length) before = beforeLines.pop() + "\n" + before;
        before = before.length > 140 ? "…" + before.slice(-140).replace(/^\S*\s/, "") : before;
        const after = textOf(parts.slice(i + 1)).split("\n")[0].slice(0, 90);
        const it = rec?.items.find((x) => x.ref === r.ref);
        out.push({ title: it?.title ?? r.ref, text: `${before.trim() ? before : ""}⟦withheld⟧${after}` });
      });
    }
    return out;
  }, [received, rec]);

  if (!rec || !chosen) return <div className="loading">Loading Linda's record…</div>;
  const candidates = rec.items.filter((i) => !i.hidden && i.hasNarrative && !chosen.includes(i.ref));

  return (
    <div className="share-grid">
      <section aria-labelledby="share-1">
        <h1 className="step-h" id="share-1">
          <span className="n">1</span> Choose what Linda shares
        </h1>
        <p className="step-sub">
          Linda's app is sending items to the kidney clinic for her referral. Each item is shared as the issuer signed it, minus any parts she withholds.
          The parts she can withhold are the ones the issuer made separable: one per structured entry or narrative-only span.
        </p>
        <a className="jump" href="#share-2" onClick={(e) => (e.preventDefault(), document.getElementById("share-2")?.scrollIntoView())}>
          Skip to what the clinic receives
        </a>
        <label className="switch wrap" style={{ marginBottom: 14, fontSize: "var(--step-0)", color: "var(--ink)", display: "flex" }}>
          <input type="checkbox" checked={preset} onChange={(e) => setPreset(e.target.checked)} />
          Withhold mental-health details (depression, sertraline)
        </label>
        {chosen.map((ref) => {
          const it = rec.items.find((i) => i.ref === ref)!;
          const us = units.get(ref) ?? [];
          const w = withheld.get(ref) ?? new Set();
          return (
            <div className="pick" key={ref} data-src={it.source.dir}>
              <div className="pick-head">
                <div className="t">
                  {it.title}
                  <span>
                    {it.source.short}, {fmtDate(it.env.effective)}. Sharing {us.length - w.size} of {us.length} parts.
                  </span>
                </div>
                <button className="btn small" onClick={() => setChosen(chosen.filter((r) => r !== ref))} aria-label={`Remove ${it.title}`}>
                  Remove
                </button>
              </div>
              <div className="units">
                {us.map((u) => (
                  <label key={u.id} className={`unit${w.has(u.id) ? " off" : ""}`}>
                    <input type="checkbox" checked={!w.has(u.id)} onChange={() => toggle(ref, u.id)} />
                    <span>
                      <span className="uid">{u.id}</span>
                      <span className="utext">{u.spanTexts.length ? u.spanTexts.join(" … ").slice(0, 120) : summaryLine(u.entry)}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="always">
                Always shared with this item: the issuer, {it.env.author?.name ? `the author (${it.env.author.name}${it.env.author.role ? `, ${it.env.author.role}` : ""}), ` : ""}
                the item type <code>{it.env.schema?.type}</code>, its dates, and any note text outside the parts listed above.
              </div>
            </div>
          );
        })}
        <select
          className="select"
          value=""
          aria-label="Add another item"
          onChange={(e) => e.target.value && setChosen([...chosen, e.target.value])}
          style={{ width: "100%" }}
        >
          <option value="">Add another item with a note…</option>
          {candidates.map((i) => (
            <option key={i.ref} value={i.ref}>
              {fmtDate(i.env.effective)}: {i.source.short}, {i.title}
            </option>
          ))}
        </select>
      </section>

      <section aria-labelledby="share-2">
        <h1 className="step-h" id="share-2">
          <span className="n">2</span> What the kidney clinic receives
        </h1>
        <p className="step-sub">
          Each presentation below was made in this browser and then checked the way the clinic would check it: resolve the issuer's key, verify the signature,
          match every shown part to a signed digest. Withheld parts are marked where they were.
        </p>
        {stats && (
          <div className="recv-summary" data-testid="share-summary" data-ok={stats.ok} data-total={received!.length}>
            {stats.ok === received!.length ? (
              <Seal state="ok" label={`${stats.ok} of ${received!.length} presentations verified`} />
            ) : (
              <Seal state="bad" label={`${received!.length - stats.ok} presentation(s) failed`} />
            )}
            <span>
              {stats.withheldUnits} of {stats.totalUnits} parts withheld
            </span>
            <span className="muted">{(stats.bytes / 1024).toFixed(1)} KB sent</span>
            {preset && (
              <span>
                {stats.sensitiveHits === 0
                  ? "“sertraline” and “depression” appear nowhere in what is sent"
                  : `“sertraline” or “depression” still appears ${stats.sensitiveHits} time(s) in what is sent`}
              </span>
            )}
            {busy && <span className="muted">Updating…</span>}
          </div>
        )}
        {contexts.length > 0 && (
          <div className="caveat" role="note">
            <h3>Withholding can change what the rest of a note means</h3>
            <p>
              The clinic sees that something is missing, not what it was. The sentences around a withheld part may now read differently. Here is what it
              will read:
            </p>
            {contexts.map((c, i) => (
              <blockquote key={i}>
                <span className="small muted" style={{ fontFamily: "var(--sans)" }}>
                  {c.title}
                </span>
                <br />
                <span style={{ whiteSpace: "pre-line" }}>
                  {c.text.split("⟦withheld⟧").map((t, j) => (
                    <span key={j}>
                      {j > 0 && <span className="withheld">withheld</span>}
                      {t}
                    </span>
                  ))}
                </span>
              </blockquote>
            ))}
            <p>
              {contexts.some((c) => /chlorthalidone likely/i.test(c.text)) &&
                "In the nephrology note, the shared text now suggests chlorthalidone is the only suspected cause of her low sodium. A clinician could change the diuretic and leave the real contributor in place. "}
              The always-shared parts (author, role, dates, prose outside spans) can also be revealing on
              their own. See <a href={href(["about", "signing"], { s: "context-loss" })}>context loss</a> in the signing spec.
            </p>
          </div>
        )}
        {received?.map((r) => {
          const it = rec.items.find((i) => i.ref === r.ref)!;
          if (!r.result.ok)
            return (
              <div className="error-box" key={r.ref}>
                {it.title}: the presentation did not verify: {r.result.error}
              </div>
            );
          const v = r.result.v;
          return (
            <ReceivedDoc key={r.ref} it={it} v={v} presentation={r.presentation} />
          );
        })}
      </section>
    </div>
  );
}

function ReceivedDoc({ it, v, presentation }: { it: RecordItem; v: VerifiedItem; presentation: string }) {
  const n = v.withheld.units + v.disclosed.length;
  return (
    <ItemDoc
      source={it.source}
      env={v.envelope}
      parts={v.parts}
      payload={v.payload}
      title={itemTitle(it.source.dir, v.envelope, v.parts, v.payload)}
      status={<Seal state="ok" label="Verified by the receiver" />}
      withheldUnits={v.withheld.units}
      banner={
        !v.complete ? (
          <div className="doc-banner partial">
            Partial item: {v.withheld.units} of {n} parts were withheld by the sender. Do not read it as the complete record.
          </div>
        ) : undefined
      }
    >
      <details className="prov">
        <summary>The presentation as sent</summary>
        <pre className="json">{presentation}</pre>
      </details>
    </ItemDoc>
  );
}

function textOf(parts: VerifiedItem["parts"]): string {
  return parts.map((p) => (p.kind === "withheld" ? "⟦withheld⟧" : p.text)).join("").replace(/[*_#`]/g, "");
}

/** Everything a receiver can read in a presentation: the JWT claims and each disclosure, decoded. */
function decodeAll(pres: string): string {
  const dec = (s: string) => {
    try {
      const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
      return new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0)));
    } catch {
      return "";
    }
  };
  const [jwt, ...disc] = pres.split("~");
  return [dec(jwt.split(".")[1]), ...disc.filter(Boolean).map(dec)].join("\n");
}
