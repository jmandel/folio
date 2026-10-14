import { useEffect, useMemo, useRef, useState } from "react";
import type { Index } from "../lib/data.ts";
import { go, href, type Route } from "../lib/route.ts";
import { checkOf, usePatientRecord, useChecks, type PatientRecord, type RecordItem } from "../lib/record.ts";
import { fmtShortDate, yearOf } from "../lib/describe.ts";
import { ItemDoc, Seal } from "../components/ItemDoc.tsx";
import { Provenance } from "../components/Provenance.tsx";
import { docHtml } from "../lib/markdown.ts";
import { MappedChart } from "../components/MappedChart.tsx";

const SRC_ORDER = ["riverside", "northgate", "lakeview", "homelog"];

export function RecordView({ index, route }: { index: Index; route: Route }) {
  const pid = route.path[1] ?? "hero";
  const ref = route.path[2] && route.path[3] ? `${route.path[2]}/${route.path[3]}` : null;
  const history = route.query.get("history") === "1";
  const trapMode = route.query.get("traps") === "1";
  const trapFilter = route.query.get("trap") ?? "";
  // Linda's chart read through the compiled mappers (computed for the main example only).
  const chartMode = pid === "hero" && route.query.get("chart") === "1";
  // Deep link: #/record/hero/<source>/<item>?ref=<ref id> selects that span or entry.
  const focus = route.query.get("ref") ?? undefined;
  const rec = usePatientRecord(index, pid);
  useChecks();
  const patient = index.patients.find((p) => p.patient === pid) ?? index.patients[0];
  const [srcOff, setSrcOff] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [notesOnly, setNotesOnly] = useState(false);

  const qs = (over: Record<string, string | undefined> = {}) => ({
    history: history ? "1" : undefined,
    traps: trapMode ? "1" : undefined,
    trap: trapMode && trapFilter ? trapFilter : undefined,
    chart: chartMode ? "1" : undefined,
    ...over,
  });
  const itemHref = (it: RecordItem) => href(["record", pid, it.source.dir, it.env.id], qs());

  const visible = useMemo(() => {
    if (!rec) return [];
    const needle = q.trim().toLowerCase();
    return rec.items.filter((it) => {
      if (it.hidden && !history) return false;
      if (srcOff.has(it.source.dir)) return false;
      if (notesOnly && !it.hasNarrative) return false;
      if (trapMode && trapFilter && !it.file.traps.includes(trapFilter)) return false;
      if (needle) {
        const hay = (it.title + " " + it.parts.map((p) => (p.kind === "withheld" ? "" : p.text)).join(" ") + " " + JSON.stringify(it.payload)).toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rec, history, srcOff, notesOnly, q, trapMode, trapFilter]);

  const byYear = useMemo(() => {
    const m = new Map<string, RecordItem[]>();
    for (const it of visible) {
      const y = yearOf(it.env.effective);
      m.set(y, [...(m.get(y) ?? []), it]);
    }
    return [...m].reverse().map(([y, items]) => [y, items.reverse()] as const);
  }, [visible]);

  const selected = rec && ref ? rec.items.find((i) => i.ref === ref) : undefined;
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref) listRef.current?.querySelector(`[data-ref="${CSS.escape(ref)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [ref, rec]);
  useEffect(() => {
    if (ref) window.scrollTo({ top: 0 });
  }, [ref]);

  let ok = 0,
    bad = 0;
  if (rec) for (const it of rec.items) {
    const c = checkOf(pid, it.ref);
    if (c?.ok) ok++;
    else if (c) bad++;
  }
  const total = rec?.items.length ?? 0;
  const hiddenCount = rec?.items.filter((i) => i.hidden).length ?? 0;

  return (
    <div className={`panes${selected || chartMode ? " has-detail" : ""}`}>
      <aside className="pane-list" aria-label="Timeline">
        <div className="list-head">
          <div className="who">
            <select
              className="select"
              aria-label="Patient"
              value={pid}
              onChange={(e) => go(["record", e.target.value], qs({ trap: undefined }))}
            >
              {index.patients.map((p) => (
                <option key={p.patient} value={p.patient}>
                  {p.name}
                  {p.role === "hero" ? " (main example)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="patient-meta">
            Born {patient.birth_date}, {patient.sex === "F" ? "female" : "male"}. {total} items from{" "}
            {Object.keys(patient.sources).length} source{Object.keys(patient.sources).length === 1 ? "" : "s"}.
          </div>
          <div className="verify-summary" data-testid="verify-summary" data-ok={ok} data-bad={bad} data-total={total}>
            {bad ? <Seal state="bad" /> : ok === total && total ? <Seal state="ok" /> : <Seal state="wait" />}
            <span>
              {ok} of {total} signatures verified{bad ? `, ${bad} failed` : ""}
            </span>
            {ok + bad < total && (
              <span className="meter" aria-hidden="true">
                <i style={{ width: `${((ok + bad) / Math.max(total, 1)) * 100}%` }} />
              </span>
            )}
          </div>
          <div className="chips" role="group" aria-label="Sources">
            {SRC_ORDER.filter((s) => patient.sources[s]).map((s) => {
              const src = index.sources.find((x) => x.dir === s)!;
              return (
                <button
                  key={s}
                  className="chip"
                  data-src={s}
                  aria-pressed={!srcOff.has(s)}
                  onClick={() =>
                    setSrcOff((o) => {
                      const n = new Set(o);
                      n.has(s) ? n.delete(s) : n.add(s);
                      return n;
                    })
                  }
                >
                  <span className="srcdot" />
                  {src.short}
                </button>
              );
            })}
          </div>
          <input className="search" type="search" placeholder="Search this record" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search this record" />
          <div className="list-tools">
            <label className="switch">
              <input type="checkbox" checked={notesOnly} onChange={(e) => setNotesOnly(e.target.checked)} />
              Items with a note
            </label>
            <label className="switch" title="Superseded and retracted items stay in the log; the default view hides them">
              <input type="checkbox" checked={history} onChange={(e) => go(["record", pid, ...(ref ? ref.split("/") : [])], qs({ history: e.target.checked ? "1" : undefined }), true)} />
              History ({hiddenCount} replaced)
            </label>
            <label className="switch" title="Annotate items with the problems deliberately planted in this synthetic data (truth/TRAPS.md)">
              <input
                type="checkbox"
                checked={trapMode}
                onChange={(e) => go(["record", pid, ...(ref ? ref.split("/") : [])], qs({ traps: e.target.checked ? "1" : undefined, trap: undefined }), true)}
              />
              Planted traps
            </label>
            {pid === "hero" && (
              <label className="switch" title="Show Linda's chart as the cached mappers and the merge produce it">
                <input type="checkbox" checked={chartMode} onChange={(e) => go(["record", pid], qs({ chart: e.target.checked ? "1" : undefined }), true)} />
                Chart from the mappers
              </label>
            )}
          </div>
          {trapMode && (
            <select
              className="select"
              aria-label="Show only items with this trap"
              value={trapFilter}
              onChange={(e) => go(["record", pid, ...(ref ? ref.split("/") : [])], qs({ trap: e.target.value || undefined }), true)}
            >
              <option value="">All items (traps marked)</option>
              {index.traps
                .filter((t) => rec?.items.some((i) => i.file.traps.includes(t.id)))
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    Only {t.id}: {t.title}
                  </option>
                ))}
            </select>
          )}
        </div>
        <div className="list-scroll" ref={listRef}>
          {!rec && <div className="empty">Loading the record…</div>}
          {rec && !visible.length && <div className="empty">No items match. Clear the search or turn sources back on.</div>}
          {byYear.map(([y, items]) => (
            <section key={y}>
              <h2 className="year">
                {y} <span>{items.length}</span>
              </h2>
              {items.map((it) => (
                <Row key={it.ref} it={it} pid={pid} href={itemHref(it)} current={it.ref === ref} trapMode={trapMode} />
              ))}
            </section>
          ))}
        </div>
      </aside>
      <div className="pane-main">
        {selected && rec ? (
          <>
            <a className="back-link" href={href(["record", pid], qs())}>
              {chartMode ? "Back to the chart" : "Back to the timeline"}
            </a>
            <ItemDetail it={selected} rec={rec} pid={pid} index={index} trapMode={trapMode} trapFilter={trapFilter} focus={focus} qs={qs} />
          </>
        ) : chartMode ? (
          <>
            <a className="back-link" href={href(["record", pid], qs({ chart: undefined }))}>
              Back to the timeline
            </a>
            <MappedChart index={index} pid={pid} qs={qs} />
          </>
        ) : (
          <Overview index={index} rec={rec} pid={pid} trapMode={trapMode} />
        )}
      </div>
    </div>
  );
}

function Row({ it, pid, href, current, trapMode }: { it: RecordItem; pid: string; href: string; current: boolean; trapMode: boolean }) {
  const c = checkOf(pid, it.ref);
  return (
    <a className={`row${it.hidden ? " hist" : ""}`} data-src={it.source.dir} data-ref={it.ref} href={href} aria-current={current ? "true" : undefined}>
      <span className="d">{fmtShortDate(it.env.effective)}</span>
      <span className="t">{it.title}</span>
      <span className="st">{c ? c.ok ? <Seal state="ok" /> : <Seal state="bad" /> : <Seal state="wait" />}</span>
      <span className="s">
        <span>{it.source.short}</span>
        {it.hidden && <span>{it.hidden.how}</span>}
        {!it.hasNarrative && <span>structured only</span>}
        {trapMode &&
          it.file.traps.map((t) => (
            <span key={t} className="trapt">
              {t}
            </span>
          ))}
      </span>
    </a>
  );
}

function ItemDetail({ it, rec, pid, index, trapMode, trapFilter, focus, qs }: { it: RecordItem; rec: PatientRecord; pid: string; index: Index; trapMode: boolean; trapFilter: string; focus?: string; qs: (o?: Record<string, string | undefined>) => Record<string, string | undefined> }) {
  const c = checkOf(pid, it.ref);
  const link = (key: string) => {
    const t = rec.byKey.get(key);
    return t ? (
      <a key={key} href={href(["record", pid, t.source.dir, t.env.id], qs({ history: "1" }))}>
        {t.title} ({fmtShortDate(t.env.effective)} {yearOf(t.env.effective)}, recorded {t.env.recorded.slice(0, 10)})
      </a>
    ) : (
      <code key={key}>{key.split(" ").pop()}</code>
    );
  };
  const replaced = it.replaces.filter((k) => rec.byKey.has(k));
  const banner = (
    <>
      {it.hidden && (
        <div className="doc-banner hist">
          Not in the default view: {it.hidden.how} by {it.hidden.by.map((k, i) => <span key={k}>{i ? ", " : ""}{link(k)}</span>)}.
        </div>
      )}
      {replaced.length > 0 && (
        <div className="doc-banner hist">
          This item {it.env.retracts?.length ? "retracts" : "supersedes"} {replaced.map((k, i) => <span key={k}>{i ? ", " : ""}{link(k)}</span>)}.
        </div>
      )}
      {c && !c.ok && <div className="doc-banner bad">The signature check failed: {c.error}. The content below is decoded but not verified.</div>}
    </>
  );
  return (
    <>
      <ItemDoc
        source={it.source}
        env={it.env}
        parts={it.parts}
        payload={it.payload}
        title={it.title}
        status={c ? c.ok ? <Seal state="ok" label="Signature verified" /> : <Seal state="bad" label="Signature failed" /> : <Seal state="wait" label="Checking signature" />}
        banner={banner}
        focus={focus}
      >
        {trapMode && it.file.traps.length > 0 && <TrapPanel ids={it.file.traps} index={index} open={trapFilter} />}
        <Provenance sdJwt={it.file.sdJwt} result={c} env={it.env} />
      </ItemDoc>
    </>
  );
}

function TrapPanel({ ids, index, open }: { ids: string[]; index: Index; open?: string }) {
  return (
    <div className="traps">
      <h3>Planted traps in this item</h3>
      <p className="small" style={{ margin: "0 0 6px" }}>
        Each trap is a case a mapper could get wrong even when it type-checks. See the{" "}
        <a href={href(["about", "traps"])}>full trap list</a>.
      </p>
      {ids.map((id) => {
        const t = index.traps.find((x) => x.id === id);
        if (!t) return null;
        return (
          <details key={id} className="trap" open={id === open || undefined} data-trap={id}>
            <summary>
              {t.id}. {t.title}
            </summary>
            <div className="body prose" style={{ fontSize: "0.875rem" }} dangerouslySetInnerHTML={{ __html: docHtml(t.body).html }} />
          </details>
        );
      })}
    </div>
  );
}

function Overview({ index, rec, pid, trapMode }: { index: Index; rec: PatientRecord | null; pid: string; trapMode: boolean }) {
  const p = index.patients.find((x) => x.patient === pid)!;
  return (
    <div style={{ maxWidth: 800 }}>
      <div className="intro">
        <h1 style={{ font: "600 1.75rem/1.2 var(--serif)", color: "var(--ink)", marginBottom: 10 }}>{p.name}</h1>
        <p>
          {pid === "hero"
            ? "Linda's record from a hospital, her primary care practice, a lab and kidney clinic, and her own app, each in its own data model. This view lists the items by date."
            : "A synthetic patient with records from the same sources. This view lists the items by date."}{" "}
          Every item is signed by the system that issued it, and the signatures are checked in your browser.
        </p>
        {pid === "hero" && (
          <p>
            <a href={href(["record", pid], { chart: "1" })}>Linda's chart from the compiled mappers</a> shows the same items as medication, problem,
            allergy, lab and vital rows, merged across sources.
          </p>
        )}
        <p>
          Choose an item on the left. In a note, highlighted words are tied to a structured entry: select either one to see the other.
          {trapMode ? " Items carry tags for the traps planted in this synthetic data." : ""}
        </p>
      </div>
      <div className="legend">
        {index.sources
          .filter((s) => p.sources[s.dir])
          .map((s) => (
            <div key={s.dir} data-src={s.dir}>
              <span className="srcdot" />
              <div>
                <b>{s.name}</b>
                <div className="muted">
                  {s.kind}. {s.style}. {rec ? `${rec.items.filter((i) => i.source.dir === s.dir).length} items.` : ""}{" "}
                  <a href={href(["sources", s.dir])}>How it models data</a>
                </div>
              </div>
            </div>
          ))}
      </div>
      {pid === "hero" && rec && (
        <div className="placeholder-doc" style={{ borderStyle: "solid", background: "var(--sheet)" }}>
          <h2>Example items</h2>
          <ul style={{ margin: 0, paddingLeft: "1.2em", lineHeight: 1.8 }}>
            {[
              ["riverside", "2024-11-02-admission-hp.folio.md", "The hospital admission for euglycemic DKA"],
              ["lakeview", "2026-07-13-new-visit.folio.md", "The nephrology visit that mentions sertraline"],
              ["northgate", "2024-11-12-med-empagliflozin-stop.folio.md", "Northgate stops empagliflozin"],
              ["lakeview", "2022-09-12-lab-rq-2209120412-corrected.folio.md", "A hemolyzed potassium, superseded"],
              ["homelog", "2024-10-31-day.folio.md", "Linda's own diary while she was sick"],
            ].map(([src, file, label]) => {
              const it = rec.items.find((i) => i.source.dir === src && i.file.file === file);
              return it ? (
                <li key={file}>
                  <a href={href(["record", pid, it.source.dir, it.env.id])}>{label}</a>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
