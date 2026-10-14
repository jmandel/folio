import { useCallback, useEffect, useMemo, useState } from "react";
import { listUnits, presentWithholding, verify, type UnitInfo, type VerifiedItem } from "@folio/core";
import {
  DEFAULT_PRESET,
  PRESETS,
  PURPOSE,
  absentText,
  andList,
  categoryById,
  decide,
  describeShare,
  whereText,
  presetOf,
  presetPolicy,
  suggestions,
  systemPrompt,
  topicState,
  type Decision,
  type ItemName,
  type Part,
  type Policy,
  type PresetId,
  type ShareSummary,
  type Suggestion,
} from "@folio/sharing";
import type { Index } from "../lib/data.ts";
import { href, type Route } from "../lib/route.ts";
import { usePatientRecord, type RecordItem } from "../lib/record.ts";
import { fmtDate, itemTitle, summaryLine } from "../lib/describe.ts";
import { newResolver } from "../lib/verify.ts";
import { ItemDoc, Seal } from "../components/ItemDoc.tsx";
import { SharingChat, type Effect } from "./SharingChat.tsx";
import "./sharing.css";

// Items a referral to the kidney clinic would plausibly carry.
const DEFAULT_ITEMS = [
  ["riverside", "2024-11-02-admission-hp.folio.md"],
  ["riverside", "2024-11-05-discharge-summary.folio.md"],
  ["northgate", "2024-11-12-visit-note.folio.md"],
  ["homelog", "2026-05-02-my-medicines.folio.md"],
  ["lakeview", "2026-07-13-new-visit.folio.md"],
];

const defaultRefs = (rec: { items: RecordItem[] }) =>
  DEFAULT_ITEMS.map(([s, f]) => rec.items.find((i) => i.source.dir === s && i.file.file === f)?.ref).filter((x): x is string => !!x);
const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

interface Received {
  ref: string;
  presentation: string;
  result: { ok: true; v: VerifiedItem } | { ok: false; error: string };
}

/** Deep links: ?preset=everything|private|private_meds (off = everything), ?detail=1, ?chat=recorded[&turns=N], ?s=context-loss. */
function initialPolicy(q: URLSearchParams): Policy {
  const p = q.get("preset");
  if (p === "off") return presetPolicy("everything");
  if (PRESETS.some((x) => x.id === p)) return presetPolicy(p as PresetId);
  return presetPolicy(DEFAULT_PRESET);
}

const clean = (t: string) => t.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();

/** Text a person can read for one part: its words in the note, else a one-line summary of its entry. */
const partText = (u: { spanTexts: string[]; entry?: unknown }) =>
  (u.spanTexts.length ? u.spanTexts.join(" … ") : summaryLine(u.entry)).replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** What kind of record this is, in plain words. */
function plainKind(it: RecordItem): { kind: string; list?: boolean } {
  const t = it.title.toLowerCase();
  switch (it.source.dir) {
    case "riverside":
      if (/admission/.test(t)) return { kind: "hospital admission note" };
      if (/discharge/.test(t)) return { kind: "hospital discharge summary" };
      if (/^ed /.test(t)) return { kind: "emergency room note" };
      return { kind: t.startsWith("hospital") ? t : `hospital ${t}` };
    case "lakeview":
      if (/telephone/.test(t)) return { kind: "kidney-clinic phone note" };
      if (/visit/.test(t)) return { kind: "kidney-clinic note" };
      return { kind: `Lakeview ${t.replace(/:.*/, "")}` };
    case "northgate":
      return { kind: /^visit/.test(t) ? "primary-care visit note" : "primary-care record" };
    case "homelog":
      return /medicines list/.test(t) ? { kind: "HomeLog medicine list", list: true } : { kind: "HomeLog day page" };
  }
  return { kind: t };
}

/** "your November 2024 hospital admission note"; the year is left out when it is the year of the newest record sent. */
function plainNames(items: RecordItem[]): Map<string, ItemName> {
  const newest = items.map((i) => i.env.effective.slice(0, 4)).sort().at(-1);
  return new Map(
    items.map((it) => {
      const [y, m] = it.env.effective.slice(0, 7).split("-");
      const when = m ? `${MONTHS[+m - 1]}${y === newest ? "" : ` ${y}`}` : y;
      const k = plainKind(it);
      return [it.ref, { name: `your ${when} ${k.kind}`, medicineList: k.list }];
    }),
  );
}

export function SharingView({ index, route }: { index: Index; route: Route }) {
  const rec = usePatientRecord(index, "hero");
  const [chosen, setChosen] = useState<string[] | null>(null);
  const [units, setUnits] = useState<Map<string, UnitInfo[]>>(new Map());
  const [policy, setPolicy] = useState<Policy>(() => initialPolicy(route.query));
  const section = route.query.get("s");
  const [received, setReceived] = useState<Received[] | null>(null);
  const [busy, setBusy] = useState(false);

  // Initial selection.
  useEffect(() => {
    if (!rec || chosen) return;
    setChosen(defaultRefs(rec));
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

  const ready = !!rec && !!chosen && chosen.every((r) => units.has(r));
  const parts: Part[] = useMemo(() => {
    if (!rec || !chosen || !ready) return [];
    return chosen.flatMap((ref) => {
      const it = rec.items.find((i) => i.ref === ref)!;
      return units.get(ref)!.map((u) => ({ item: ref, source: it.source.dir, id: u.id, hasEntry: u.hasEntry, spanTexts: u.spanTexts, entry: u.entry }));
    });
  }, [rec, chosen, units, ready]);

  const decisions = useMemo(() => decide(parts, policy), [parts, policy]);
  const suggs = useMemo(() => suggestions(decisions), [decisions]);
  const names = useMemo(() => plainNames((chosen ?? []).map((r) => rec!.items.find((i) => i.ref === r)!)), [rec, chosen]);
  const describe = useCallback(
    (ds: Decision[]) =>
      describeShare(ds, {
        names: (ref) => names.get(ref) ?? { name: ref },
        partLabel: (d) => partText(d.part).slice(0, 50),
        records: chosen?.length ?? 0,
      }),
    [names, chosen],
  );
  const summary = useMemo(() => describe(decisions), [describe, decisions]);
  /** Slot number → the unit that fills it, per record. */
  const slotOwner = useMemo(() => {
    const m = new Map<string, Map<number, { key: string; text: string }>>();
    for (const [ref, us] of units) {
      const sm = new Map<number, { key: string; text: string }>();
      for (const u of us) u.slots.forEach((slot, i) => sm.set(slot, { key: `${ref}#${u.id}`, text: u.spanTexts[i] ?? "" }));
      m.set(ref, sm);
    }
    return m;
  }, [units]);
  const withheldKey = useMemo(
    () => JSON.stringify(decisions.filter((d) => !d.share).map((d) => d.key)),
    [decisions],
  );

  // Make presentations and verify them as the receiver would: fresh resolver, nothing shared with the record view.
  useEffect(() => {
    if (!rec || !chosen || !ready) return;
    let live = true;
    setBusy(true);
    const withheld = new Set<string>(JSON.parse(withheldKey));
    (async () => {
      const resolver = newResolver();
      const out: Received[] = [];
      for (const ref of chosen) {
        const it = rec.items.find((i) => i.ref === ref)!;
        const ids = units.get(ref)!.map((u) => u.id).filter((id) => withheld.has(`${ref}#${id}`));
        const pres = await presentWithholding(it.file.sdJwt, ids);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec, chosen, ready, withheldKey]);

  /** Words that tie a withheld part to its topic and appear in no shared part: none of them should be in what is sent. */
  const checkWords = useMemo(() => {
    const shared = decisions.filter((d) => d.share);
    const words = new Map<string, string>();
    for (const d of decisions)
      if (!d.share) for (const h of d.hits) if (h.where !== "source flag" && h.where !== "medicine code") words.set(h.matched.toLowerCase(), h.matched);
    return [...words.values()].filter((w) => !shared.some((d) => (partText(d.part) + JSON.stringify(d.part.entry ?? "")).toLowerCase().includes(w.toLowerCase())));
  }, [decisions]);

  const stats = useMemo(() => {
    if (!received) return null;
    const ok = received.filter((r) => r.result.ok).length;
    const withheldUnits = received.reduce((n, r) => n + (r.result.ok ? r.result.v.withheld.units : 0), 0);
    const totalUnits = received.reduce((n, r) => n + (r.result.ok ? r.result.v.withheld.units + r.result.v.disclosed.length : 0), 0);
    const decoded = received.map((r) => decodeAll(r.presentation)).join("\n").toLowerCase();
    const found = checkWords.filter((w) => decoded.includes(w.toLowerCase()));
    const bytes = received.reduce((n, r) => n + r.presentation.length, 0);
    return { ok, withheldUnits, totalUnits, found, bytes };
  }, [received, checkWords]);

  /**
   * For each context problem, what the clinic will read where the medicine was removed: one quote per
   * run of adjacent withheld slots that includes one of the medicine's parts, taken from the
   * verified presentation, with the words removed there.
   */
  const contexts = useMemo(() => {
    const hidden = new Set(suggs.flatMap((s) => s.hidden.map((d) => d.key)));
    const out: { ref: string; title: string; text: string; removed: string[] }[] = [];
    if (!hidden.size) return out;
    for (const r of received ?? []) {
      if (!r.result.ok) continue;
      const owner = slotOwner.get(r.ref) ?? new Map();
      const vparts = r.result.v.parts;
      const blank = (x: (typeof vparts)[number]) => x.kind === "prose" && !x.text.trim();
      for (let i = 0; i < vparts.length; i++) {
        const p = vparts[i];
        if (p.kind !== "withheld") continue;
        const prev = vparts.slice(0, i).reverse().find((x) => !blank(x));
        if (prev?.kind === "withheld") continue;
        // The run: this slot and any withheld slots after it, with only blank prose between.
        let j = i;
        const run: number[] = [];
        while (j < vparts.length && (vparts[j].kind === "withheld" || blank(vparts[j]))) {
          const x = vparts[j];
          if (x.kind === "withheld") run.push(x.slot);
          j++;
        }
        if (!run.some((slot) => hidden.has(owner.get(slot)?.key ?? ""))) continue;
        const beforeLines = textOf(vparts.slice(0, i)).split("\n");
        let before = beforeLines.pop() ?? "";
        if (before.replace(/^\s*([-*]|\d+\.)\s*/, "").length < 30 && beforeLines.length) before = beforeLines.pop() + "\n" + before;
        before = before.length > 140 ? "…" + before.slice(-140).replace(/^\S*\s/, "") : before;
        const after = textOf(vparts.slice(j)).split("\n")[0].slice(0, 90);
        const marks = run.map(() => "⟦withheld⟧").join(" ");
        out.push({
          ref: r.ref,
          title: rec?.items.find((x) => x.ref === r.ref)?.title ?? r.ref,
          text: `${before}${marks}${after}`,
          removed: run.map((slot) => clean(owner.get(slot)?.text ?? "")).filter(Boolean),
        });
      }
    }
    return out;
  }, [received, rec, suggs, slotOwner]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (section !== "context-loss" || scrolled || contexts.length === 0) return;
    setScrolled(true);
    requestAnimationFrame(() => document.getElementById("context-loss")?.scrollIntoView({ block: "start" }));
  }, [section, scrolled, contexts.length]);

  const nameOf = (ref: string) => names.get(ref)?.name ?? ref;
  const titleOf = useCallback((ref: string) => rec?.items.find((i) => i.ref === ref)?.title ?? ref, [rec]);
  const effect = useCallback(
    (p: Policy, base?: Policy): Effect => {
      const next = decide(parts, p);
      const now = new Map((base ? decide(parts, base) : decisions).map((d) => [d.key, d.share]));
      const label = (d: Decision) => `“${partText(d.part).slice(0, 60).replace(/[.;,]$/, "")}” (${titleOf(d.part.item)})`;
      return {
        withheld: next.filter((d) => !d.share).length,
        total: next.length,
        nowShared: next.filter((d) => d.share && now.get(d.key) === false).map(label),
        nowWithheld: next.filter((d) => !d.share && now.get(d.key) === true).map(label),
      };
    },
    [parts, decisions, titleOf],
  );
  const prompt = useCallback(
    () =>
      systemPrompt({
        items: (chosen ?? []).map((ref) => {
          const it = rec!.items.find((i) => i.ref === ref)!;
          return { key: ref, title: it.title, name: names.get(ref)?.name, source: it.source.name, date: fmtDate(it.env.effective), alwaysShared: alwaysShared(it) };
        }),
        decisions,
        partSummary: (d) => partText(d.part).slice(0, 160),
        policy,
        suggestions: suggs,
      }),
    [chosen, rec, decisions, policy, suggs, names],
  );

  if (!rec || !chosen) return <div className="loading">Loading Linda's record…</div>;
  const candidates = rec.items.filter((i) => !i.hidden && i.hasNarrative && !chosen.includes(i.ref));
  const current = presetOf(policy);
  const nWithheld = decisions.filter((d) => !d.share).length;

  const setOverride = (d: Decision, share: boolean) =>
    setPolicy((p) => {
      const base = decide([d.part], { ...p, overrides: {} })[0].share;
      const overrides = { ...p.overrides };
      if (share === base) delete overrides[d.key];
      else overrides[d.key] = share ? "share" : "withhold";
      return { ...p, overrides };
    });

  return (
    <div className="share-grid">
      <section aria-labelledby="share-1">
        <h1 className="step-h" id="share-1">
          <span className="n">1</span> Linda chooses what to share
        </h1>
        <p className="step-sub">
          Linda's app is sending {chosen.length} records to {PURPOSE.recipient} for her kidney referral. She picks a sharing choice in plain terms. The app
          turns it into a decision for each part of each record, using rules you can read below.
        </p>
        <a className="jump" href="#share-2" onClick={(e) => (e.preventDefault(), document.getElementById("share-2")?.scrollIntoView())}>
          Skip to what the clinic receives
        </a>

        <div className="app-panel" data-testid="policy-panel" data-preset={current} data-withheld={nWithheld}>
          <div className="app-label">In Linda's app</div>
          <h2 className="app-q">What do you want to share with the kidney clinic?</h2>
          <p className="app-purpose">
            Sending to <b>{PURPOSE.recipient}</b> for your referral about your kidney function and the diabetes medicine that made you sick in 2024.
          </p>

          <div className="presets" role="radiogroup" aria-label="Sharing choice">
            {PRESETS.map((p) => {
              const on = current === p.id;
              return (
                <label key={p.id} className={`preset${on ? " on" : ""}`} data-preset={p.id}>
                  <input type="radio" name="preset" checked={on} onChange={() => setPolicy(presetPolicy(p.id))} />
                  <span className="preset-body">
                    <span className="preset-title">{p.label}</span>
                    <span className="preset-line" data-testid="choice-text">
                      {on ? summary.text : describe(decide(parts, p.policy)).text}
                    </span>
                  </span>
                </label>
              );
            })}
            {current === "custom" && (
              <div className="preset on custom" data-preset="custom">
                <span className="preset-body">
                  <span className="preset-title">Custom</span>
                  <span className="preset-line" data-testid="choice-text">
                    {summary.text}
                  </span>
                  <span className="preset-effect">Pick a choice above to start over.</span>
                </span>
              </div>
            )}
          </div>

          {suggs.map((s) => (
            <SuggestionBox key={s.id} s={s} summary={summary} names={names} onApply={() => setPolicy((p) => s.apply(p))} />
          ))}

          <Topics summary={summary} policy={policy} decisions={decisions} setPolicy={setPolicy} />

          <details className="layer" open={route.query.get("detail") === "1"} data-testid="detail-layer">
            <summary>
              What this means in your records{" "}
              <span className="muted">
                ({nWithheld} of {decisions.length} parts held back)
              </span>
            </summary>
            <p className="small muted layer-intro">
              Each record is split into parts by the place that wrote it: one per structured entry, and one per marked phrase in the note. Each part is
              shared or held back whole. The reasons come from the rules in{" "}
              <a href="https://github.com/jmandel/folio/blob/main/packages/sharing/src/rules.ts">packages/sharing/src/rules.ts</a>. You can change any part
              here.
            </p>
            {chosen.map((ref) => (
              <ItemParts
                key={ref}
                it={rec.items.find((i) => i.ref === ref)!}
                decisions={decisions.filter((d) => d.part.item === ref)}
                onToggle={setOverride}
                onRemove={() => setChosen(chosen.filter((r) => r !== ref))}
              />
            ))}
            <select
              className="select"
              value=""
              aria-label="Add another record"
              onChange={(e) => e.target.value && setChosen([...chosen, e.target.value])}
              style={{ width: "100%" }}
            >
              <option value="">Add another record with a note…</option>
              {candidates.map((i) => (
                <option key={i.ref} value={i.ref}>
                  {fmtDate(i.env.effective)}: {i.source.short}, {i.title}
                </option>
              ))}
            </select>
          </details>

          <SharingChat
            open={!!route.query.get("chat")}
            autoplay={route.query.get("chat") === "recorded" ? +(route.query.get("turns") ?? Infinity) : null}
            systemPrompt={prompt}
            knownKeys={new Set(parts.map((p) => `${p.item}#${p.id}`))}
            current={policy}
            recordsMatch={sameSet(chosen, defaultRefs(rec))}
            effect={effect}
            onApply={setPolicy}
            onReset={(p) => {
              setChosen(defaultRefs(rec));
              setPolicy(p);
            }}
          />
        </div>
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
          <div className="recv-summary" data-testid="share-summary" data-ok={stats.ok} data-total={received!.length} data-withheld={stats.withheldUnits}>
            {stats.ok === received!.length ? (
              <Seal state="ok" label={`${stats.ok} of ${received!.length} presentations verified`} />
            ) : (
              <Seal state="bad" label={`${received!.length - stats.ok} presentation(s) failed`} />
            )}
            <span>
              {stats.withheldUnits} of {stats.totalUnits} parts withheld
            </span>
            <span className="muted">{(stats.bytes / 1024).toFixed(1)} KB sent</span>
            {checkWords.length > 0 && (
              <span>
                {stats.found.length === 0
                  ? `${quoteList(checkWords)} ${checkWords.length === 1 ? "appears" : "appear"} nowhere in what is sent`
                  : `${quoteList(stats.found)} still ${stats.found.length === 1 ? "appears" : "appear"} in what is sent`}
              </span>
            )}
            {busy && <span className="muted">Updating…</span>}
          </div>
        )}
        {suggs.length > 0 && (
          <div className="caveat" role="note" id="context-loss" data-testid="context-loss">
            {suggs.map((sg) => {
              const meds = andList(sg.medicines);
              const evidence = andList([...new Set(sg.evidence.map((d) => d.part.item))].map((r) => nameOf(r)));
              const quotes = contexts.filter((c) => sg.hidden.some((d) => d.part.item === c.ref));
              return (
                <div key={sg.id}>
                  <h3>
                    Withholding {meds} changes what the clinic reads about {sg.rule.finding}
                  </h3>
                  <p>
                    {sg.rule.plain} The clinic will see {sg.rule.finding} in {evidence}. It will not see {meds} ({whereText(sg.hidden, (r) => names.get(r) ?? { name: r })}).
                  </p>
                  {quotes.length > 0 && <p>Here is what the clinic will read where {meds} was removed:</p>}
                  {quotes.map((c, i) => (
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
                      <span className="removed">Removed here: {c.removed.map((t) => `“${t}”`).join(" ")}</span>
                    </blockquote>
                  ))}
                </div>
              );
            })}
            <p className="small muted">
              See <a href={href(["about", "signing"], { s: "context-loss" })}>context loss</a> in the signing spec.
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
          return <ReceivedDoc key={r.ref} it={it} v={r.result.v} presentation={r.presentation} />;
        })}
      </section>
    </div>
  );
}

function SuggestionBox({ s, summary, names, onApply }: { s: Suggestion; summary: ShareSummary; names: Map<string, ItemName>; onApply: () => void }) {
  const meds = andList(s.medicines);
  const cats = new Set(s.hidden.flatMap((d) => d.categories));
  // What stays private after the fix: the withheld conditions in the medicine's topics.
  const keep = [...new Set(summary.withheld.filter((m) => m.thing.kind === "condition" && cats.has(m.thing.category!)).map((m) => m.thing.label))];
  const where = andList([...new Set(s.evidence.map((d) => d.part.item))].map((r) => names.get(r)?.name ?? r));
  return (
    <div className="suggest" role="note" data-testid="suggestion" data-id={s.id}>
      <h3>
        Hiding {meds} may mislead the clinic about your {s.rule.finding}
      </h3>
      <p>
        {s.rule.plain} The clinic will see your {s.rule.finding} in {where}. If they don't know you take {meds}, they may look for another cause.
      </p>
      <button className="btn small primary" onClick={onApply}>
        {keep.length ? `Share ${meds}, keep ${andList(keep)} private` : `Share ${meds}`}
      </button>
    </div>
  );
}

/** One row per topic that occurs in these records, showing whether it is private and what the clinic will see. */
function Topics({
  summary,
  policy,
  decisions,
  setPolicy,
}: {
  summary: ShareSummary;
  policy: Policy;
  decisions: Decision[];
  setPolicy: (f: (p: Policy) => Policy) => void;
}) {
  // The medicine switch matters only for medicines in a topic that is private.
  const medCats = summary.present.filter((c) => policy.private.includes(c) && decisions.some((d) => d.medicineOnly && d.categories.includes(c)));
  const all = [...summary.withheld, ...summary.shared];
  const meds = [...new Set(all.filter((m) => m.thing.kind === "medicine" && medCats.includes(m.thing.category!)).map((m) => m.thing.label))];
  const conds = [...new Set(summary.withheld.filter((m) => m.thing.kind === "condition" && medCats.includes(m.thing.category!)).map((m) => m.thing.label))];
  const absent = absentText(summary);
  return (
    <fieldset className="topics" data-testid="topics">
      <legend>Private topics</legend>
      {summary.present.map((c) => {
        const on = policy.private.includes(c);
        const st = topicState(summary, c);
        return (
          <div key={c} className="topic" data-topic={c} data-private={on ? "1" : "0"}>
            <label className="topic-toggle">
              <input
                type="checkbox"
                checked={on}
                onChange={() => setPolicy((p) => ({ ...p, private: on ? p.private.filter((x) => x !== c) : [...p.private, c] }))}
              />
              <span className="topic-name">Keep {categoryById(c).about} private</span>
            </label>
            {st.hidden.length > 0 && <span className="topic-line held">Kept private: {andList(st.hidden)}.</span>}
            {st.seen.length > 0 && <span className="topic-line seen">The clinic will see: {andList(st.seen)}.</span>}
          </div>
        );
      })}
      {meds.length > 0 && (
        <div className="topic meds">
          <label className="topic-toggle">
            <input type="checkbox" checked={policy.shareMedicines} onChange={(e) => setPolicy((p) => ({ ...p, shareMedicines: e.target.checked }))} />
            <span className="topic-name">List {andList(meds)} with my other medicines</span>
          </label>
          <span className="topic-line">
            {meds.length === 1
              ? `Listing ${meds[0]} shows the clinic its name and dose${conds.length ? `, not ${andList(conds)}` : ""}. Doctors know what ${meds[0]} is usually taken for, so they may guess why you take it.`
              : `Listing ${andList(meds)} shows the clinic their names and doses${conds.length ? `, not ${andList(conds)}` : ""}. Doctors know what these medicines are usually taken for, so they may guess why you take them.`}
          </span>
        </div>
      )}
      {absent && <p className="topics-absent">{absent}</p>}
    </fieldset>
  );
}

function ItemParts({ it, decisions, onToggle, onRemove }: { it: RecordItem; decisions: Decision[]; onToggle: (d: Decision, share: boolean) => void; onRemove: () => void }) {
  const held = decisions.filter((d) => !d.share || d.categories.length || d.via === "override");
  const rest = decisions.filter((d) => !held.includes(d));
  return (
    <div className="pick" data-src={it.source.dir}>
      <div className="pick-head">
        <div className="t">
          {it.title}
          <span>
            {it.source.short}, {fmtDate(it.env.effective)}. Sharing {decisions.filter((d) => d.share).length} of {decisions.length} parts.
          </span>
        </div>
        <button className="btn small" onClick={onRemove} aria-label={`Don't send ${it.title}`}>
          Don't send
        </button>
      </div>
      <div className="units">
        {held.map((d) => (
          <PartRow key={d.key} d={d} onToggle={onToggle} />
        ))}
        {rest.length > 0 && (
          <details className="rest">
            <summary>
              {held.length ? `${rest.length} other parts, not tied to a private topic` : `${rest.length} parts, none tied to a private topic`}
            </summary>
            {rest.map((d) => (
              <PartRow key={d.key} d={d} onToggle={onToggle} />
            ))}
          </details>
        )}
      </div>
      <div className="always">
        Always shared with this record: {alwaysShared(it)}.
      </div>
    </div>
  );
}

function PartRow({ d, onToggle }: { d: Decision; onToggle: (d: Decision, share: boolean) => void }) {
  return (
    <label className={`unit${d.share ? "" : " off"}`} data-key={d.key}>
      <input type="checkbox" checked={d.share} onChange={() => onToggle(d, !d.share)} />
      <span>
        <span className="utext">{partText(d.part).slice(0, 140)}</span>
        {(d.categories.length > 0 || d.via === "override") && (
          <span className="why">
            {d.categories.map((c) => (
              <span key={c} className="cat-badge">
                {categoryById(c).label}
              </span>
            ))}
            <span className={d.share ? "ok-word" : "held-word"}>{d.share ? "Shared." : "Held back."}</span> {d.reason}
            {d.hits.length > 0 && (
              <span className="rules">
                {d.hits.map((h, i) => (
                  <span key={i} className="rule">
                    <code>{h.rule}</code> {h.where} “{h.matched}”: {h.because}
                  </span>
                ))}
              </span>
            )}
          </span>
        )}
        <span className="uid">{d.part.id}</span>
      </span>
    </label>
  );
}

function alwaysShared(it: RecordItem): string {
  const a = it.env.author;
  return [
    `who issued it (${it.source.name})`,
    a?.name ? `the author (${a.name}${a.role ? `, ${a.role}` : ""})` : null,
    `the record type (${it.env.schema?.type})`,
    "its dates",
    "any note text outside the parts listed",
  ]
    .filter(Boolean)
    .join(", ");
}

const quoteList = (ws: string[]) => {
  const q = ws.map((w) => `“${w}”`);
  return q.length <= 1 ? q.join("") : `${q.slice(0, -1).join(", ")} and ${q[q.length - 1]}`;
};

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
