import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Envelope, NarrativePart, Payload } from "@folio/core";
import type { SourceInfo } from "../lib/data.ts";
import { narrativeHtml } from "../lib/markdown.ts";
import { fmtDate, rows, summarize } from "../lib/describe.ts";

export function Seal({ state, label }: { state: "ok" | "bad" | "wait"; label?: string }) {
  return (
    <span className={`seal ${state}`}>
      {state === "ok" && (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4.8 8.2l2.1 2.1 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {state === "bad" && (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
      {state === "wait" && (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 2.5" />
        </svg>
      )}
      {label && <span>{label}</span>}
    </span>
  );
}

function FieldValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    if (value.length && value.every((v) => v && typeof v === "object" && !Array.isArray(v))) {
      const cols = [...new Set(value.flatMap((v) => rows(v).map((r) => r.key)))];
      return (
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {value.map((v, i) => {
                const m = new Map(rows(v).map((r) => [r.key, r.value]));
                return (
                  <tr key={i}>
                    {cols.map((c) => (
                      <td key={c}>{m.has(c) ? fmt(m.get(c)) : ""}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
    return <>{value.map(fmt).join(", ")}</>;
  }
  return <>{fmt(value)}</>;
}
const fmt = (v: unknown) => (typeof v === "string" ? v : v === null ? "null" : typeof v === "object" ? JSON.stringify(v) : String(v));

export interface ItemDocProps {
  source: SourceInfo;
  env: Envelope;
  parts: NarrativePart[];
  payload: Payload;
  title: string;
  status?: ReactNode;
  banner?: ReactNode;
  children?: ReactNode;
  /** Number of withheld units (for a partial presentation). */
  withheldUnits?: number;
  id?: string;
  /** A ref id to select on arrival (from a deep link): its words are highlighted and its entry opened. */
  focus?: string;
}

/** One record item as a document: letterhead, narrative with ref spans, structured entries. */
export function ItemDoc(p: ItemDocProps) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [pop, setPop] = useState<{ id: string; top: number; left: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const narrRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const html = useMemo(() => narrativeHtml(p.parts), [p.parts]);
  const hasNarrative = p.parts.some((x) => x.kind !== "prose" || x.text.trim() !== "");
  const spanIds = useMemo(() => new Set(p.parts.flatMap((x) => (x.kind === "span" ? [x.id] : []))), [p.parts]);
  const entryIds = Object.keys(p.payload);
  const narrativeOnly = [...spanIds].filter((id) => !(id in p.payload));
  const allOpen = !hasNarrative;
  const titleInNarrative = p.parts[0]?.kind === "prose" && new RegExp(`^\\s*#{1,6}\\s+[*_]*${p.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(p.parts[0].text);

  useEffect(() => {
    setActive(null);
    setOpen(new Set());
    setPop(null);
  }, [p.env.id, p.env.issuer]);

  // Deep link to a ref: select its span (with the entry popover) or, for an entry with no words, the entry.
  useEffect(() => {
    const id = p.focus;
    if (!id) return;
    const t = setTimeout(() => {
      const m = narrRef.current?.querySelector(`mark.ref[data-ref="${CSS.escape(id)}"]`) as HTMLElement | null;
      if (m) {
        m.scrollIntoView({ block: "center" });
        fromNarrative(m);
      } else if (id in p.payload) {
        setActive(id);
        setOpen((o) => new Set(o).add(id));
        entriesRef.current?.querySelector(`[data-entry="${CSS.escape(id)}"]`)?.scrollIntoView({ block: "center" });
      }
    }, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.focus, p.env.id, p.env.issuer]);

  useEffect(() => {
    narrRef.current?.querySelectorAll("mark.ref").forEach((m) => m.classList.toggle("active", (m as HTMLElement).dataset.ref === active));
  }, [active, html]);

  const fromNarrative = (target: EventTarget) => {
    const m = (target as HTMLElement).closest?.("mark.ref") as HTMLElement | null;
    if (!m) {
      setPop(null);
      setActive(null);
      return;
    }
    const id = m.dataset.ref!;
    if (active === id && pop?.id === id) {
      setActive(null);
      setPop(null);
      return;
    }
    setActive(id);
    setOpen((o) => new Set(o).add(id));
    const box = wrapRef.current!.getBoundingClientRect();
    const r = m.getClientRects()[m.getClientRects().length - 1] ?? m.getBoundingClientRect();
    const width = Math.min(380, box.width - 16);
    setPop({ id, top: r.bottom - box.top + 8, left: Math.max(8, Math.min(r.left - box.left, box.width - width - 8)) });
  };
  const fromEntry = (id: string) => {
    const on = active !== id;
    setActive(on ? id : null);
    setPop(null);
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(id) && !on) n.delete(id);
      else n.add(id);
      return n;
    });
    if (on && spanIds.has(id))
      requestAnimationFrame(() => narrRef.current?.querySelector(`mark.ref[data-ref="${id}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  const e = p.env;
  return (
    <article className="doc" data-src={p.source.dir} id={p.id}>
      <header className="doc-head">
        <div className="doc-src">
          <span className="srcdot" />
          {p.source.name}
        </div>
        <div className="doc-status">{p.status}</div>
        {/* A narrative that opens with this title as its own heading shows it there, as written. */}
        {!titleInNarrative && <h2 className="doc-title">{p.title}</h2>}
        <div className="doc-meta">
          <span>
            <b>Effective</b>
            {fmtDate(e.effective, true)}
            {e.effective_end ? ` to ${fmtDate(e.effective_end, true)}` : ""}
          </span>
          {e.author?.name && (
            <span>
              <b>Author</b>
              {e.author.name}
              {e.author.role ? `, ${e.author.role}` : ""}
            </span>
          )}
          <span>
            <b>Recorded</b>
            {fmtDate(e.recorded, true)}
          </span>
          {e.schema && (
            <span>
              <b>Type</b>
              <code>{e.schema.type}</code>
            </span>
          )}
        </div>
      </header>
      {p.banner}
      {hasNarrative ? (
        <div className="narr-wrap" ref={wrapRef}>
          <div
            className="narrative"
            ref={narrRef}
            onClick={(ev) => fromNarrative(ev.target)}
            onKeyDown={(ev) => {
              if (ev.key === "Escape") return setPop(null);
              if ((ev.key === "Enter" || ev.key === " ") && (ev.target as HTMLElement).matches("mark.ref")) {
                ev.preventDefault();
                fromNarrative(ev.target);
              }
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {pop && (
            <div className="pop" role="dialog" aria-label={`Structured entry ${pop.id}`} style={{ top: pop.top, left: pop.left }} data-testid="ref-pop">
              <div className="pop-head">
                <span className="entry-type">{pop.id in p.payload ? summarize(p.payload[pop.id]).type : "narrative-only span"}</span>
                <span className="entry-id">{pop.id}</span>
                <button className="pop-x" onClick={() => (setPop(null), setActive(null))} aria-label="Close">
                  ×
                </button>
              </div>
              {pop.id in p.payload ? (
                <dl className="entry-fields">
                  {rows(p.payload[pop.id]).slice(0, 14).map((r) => (
                    <FieldRow key={r.key} k={r.key} v={r.value} />
                  ))}
                </dl>
              ) : (
                <div className="nospan">
                  No structured entry behind these words. The issuer marked them so they can be cited as (issuer, item, <code>{pop.id}</code>) and withheld
                  on their own.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="narrative nonarr">No narrative. This item is structured data only, shown below as the source wrote it.</div>
      )}
      {(entryIds.length > 0 || narrativeOnly.length > 0 || !!p.withheldUnits) && (
        <div className="entries" ref={entriesRef}>
          {entryIds.length > 0 && (
            <h3>
              Structured entries <span>{entryIds.length}{hasNarrative ? ", highlighted ones are tied to words in the note" : ""}</span>
            </h3>
          )}
          {entryIds.map((id) => {
            const s = summarize(p.payload[id]);
            const isOpen = allOpen || open.has(id);
            return (
              <div key={id} className={`entry${active === id ? " active" : ""}`} data-entry={id}>
                <button className="entry-line" onClick={() => fromEntry(id)} aria-expanded={isOpen}>
                  <span className="entry-type">{s.type}</span>
                  <span className="entry-sum">
                    {s.name && <span>{s.name} </span>}
                    {s.value && <span className="v">{s.value} </span>}
                    {s.status && <span className="stt">{s.status}</span>}
                  </span>
                  {spanIds.has(id) && <span className="in-note">in note</span>}
                  <span className="entry-id">{id}</span>
                </button>
                {isOpen && (
                  <dl className="entry-fields">
                    {rows(p.payload[id]).map((r) => (
                      <FieldRow key={r.key} k={r.key} v={r.value} />
                    ))}
                  </dl>
                )}
              </div>
            );
          })}
          {narrativeOnly.length > 0 && (
            <>
              <h3>
                Narrative-only spans <span>prose with no structured entry; citable and withholdable on its own</span>
              </h3>
              {narrativeOnly.map((id) => (
                <div key={id} className={`entry${active === id ? " active" : ""}`} data-entry={id}>
                  <button className="entry-line" onClick={() => fromEntry(id)}>
                    <span className="entry-type">span</span>
                    <span className="entry-sum">
                      {p.parts
                        .filter((x) => x.kind === "span" && x.id === id)
                        .map((x) => (x as { text: string }).text)
                        .join(" … ")
                        .slice(0, 140)}
                    </span>
                    <span className="in-note">in note</span>
                    <span className="entry-id">{id}</span>
                  </button>
                </div>
              ))}
            </>
          )}
          {!!p.withheldUnits && (
            <div className="nospan">
              <span className="withheld">withheld</span> {p.withheldUnits} part{p.withheldUnits === 1 ? " was" : "s were"} withheld by the
              person who shared this item. Structured entries may be among them; entries with no words in the note leave no marker above.
            </div>
          )}
        </div>
      )}
      {p.children}
    </article>
  );
}

function FieldRow({ k, v }: { k: string; v: unknown }) {
  return (
    <>
      <dt>{k}</dt>
      <dd>
        <FieldValue value={v} />
      </dd>
    </>
  );
}
