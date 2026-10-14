import { useEffect, useState, type ReactNode } from "react";
import type { Index, SignedItemFile } from "../lib/data.ts";
import { loadPatient } from "../lib/data.ts";
import { href, type Route } from "../lib/route.ts";
import { check, decodeUnverified, type Check } from "../lib/verify.ts";
import { fmtDate, itemTitle } from "../lib/describe.ts";
import { Seal } from "../components/ItemDoc.tsx";
import { DKA_COLUMNS, DKA_MERGED, storyItems, type Cite, type Excerpt } from "../story/dka.ts";

const REPO = "https://github.com/jmandel/folio";
const PID = "hero";

// Deep links into the workbench.
const itemLink = (source: string, item: string, ref?: string, extra: Record<string, string> = {}) =>
  href(["record", PID, source, item], { ref, ...extra });

interface Loaded {
  file: SignedItemFile;
  check: Check;
}

/** Loads Linda's signed items once and verifies only the ones the page quotes. */
function useStoryItems(): Map<string, Loaded> | null {
  const [m, setM] = useState<Map<string, Loaded> | null>(null);
  useEffect(() => {
    let live = true;
    loadPatient(PID).then(async ({ items }) => {
      const want = new Set(storyItems().map((x) => x.item));
      const byId = new Map<string, SignedItemFile>();
      for (const f of items) {
        const id = decodeUnverified(f.sdJwt).envelope.id;
        if (want.has(id)) byId.set(id, f);
      }
      const out = new Map<string, Loaded>();
      for (const [id, file] of byId) out.set(id, { file, check: await check(file.sdJwt) });
      if (live) setM(out);
    });
    return () => {
      live = false;
    };
  }, []);
  return m;
}

const content = (l: Loaded | undefined) => (l?.check.ok ? l.check.v : null);
const spanText = (l: Loaded | undefined, ref: string) =>
  content(l)
    ?.parts.filter((p) => p.kind === "span" && p.id === ref)
    .map((p) => (p as { text: string }).text.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim())
    .join(" … ");
const hasRef = (l: Loaded | undefined, ref: string) => {
  const v = content(l);
  return !!v && (ref in v.payload || v.parts.some((p) => p.kind === "span" && p.id === ref));
};
const at = (obj: unknown, path: string): unknown => path.split(".").reduce<any>((o, k) => (o == null ? o : o[k]), obj);
const show = (v: unknown) => (Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v));

export function HomeView({ index }: { index: Index; route: Route }) {
  const items = useStoryItems();
  const hero = index.patients.find((p) => p.patient === PID);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="home">
      <div className="home-top">
      <header className="home-head">
        <h1>FOLIO</h1>
        <p className="home-lede">
          Each health system publishes signed records in its own data model. A reader uses an AI agent to write code that maps that model into the
          views the reader needs. The agent runs once per schema version; later reads run the saved code.
        </p>
      </header>

      <section className="home-sec" aria-labelledby="h-problem">
        <h2 id="h-problem">How records move between systems today</h2>
        <p className="home-text">
          Either the systems agree on a schema in advance, or one system exports everything it holds. An agreed schema drops local detail that does not
          fit it, and usually carries notes separately from the coded data they describe. A full export, such as a Cures Act EHI export, is complete, but
          it comes in the vendor's own layout and each reader has to work that out.
        </p>
      </section>
      </div>

      <section className="home-sec" aria-labelledby="h-idea">
        <h2 id="h-idea">How FOLIO works</h2>
        <Flow />
      </section>

      <section className="home-sec" aria-labelledby="h-trace">
        <h2 id="h-trace">Empagliflozin reaction in each source</h2>
        <p className="home-text">
          In November 2024 {hero?.name ?? "Linda Okafor"}, a synthetic patient, was admitted with euglycemic diabetic ketoacidosis (DKA) caused by
          empagliflozin, a diabetes drug. The excerpts below are quoted from signed items, and your browser checks each signature.
        </p>
        <div className="trace">
          {DKA_COLUMNS.map((col) => {
            const src = index.sources.find((s) => s.dir === col.source)!;
            return (
              <div className="trace-col" data-src={col.source} key={col.source}>
                <h3 className="trace-src">
                  <span className="srcdot" />
                  {src.name}
                </h3>
                <p className="trace-cap">{col.caption}</p>
                {col.excerpts.map((ex) => (
                  <ExcerptCard key={ex.item} ex={ex} l={items?.get(ex.item)} loading={!items} />
                ))}
              </div>
            );
          })}
        </div>

        <Merged items={items} index={index} />
      </section>

      <section className="home-sec" aria-labelledby="h-tour">
        <h2 id="h-tour">Tour of the workbench</h2>
        <ol className="tour">
          <TourStep n={1} title="Note text linked to structured entries" links={[["Open the discharge summary", itemLink("riverside", "01JBZ2V178F5KZNWJ47TAN9ZT2", "med_empa")]]}>
            In the hospital discharge summary, the sentence about empagliflozin is marked as a reference to the <code>med_empa</code> entry. One signature
            covers both, and a citation can point at either.
          </TourStep>
          <TourStep
            n={2}
            title="Source schemas and planted traps"
            links={[
              ["Northgate's schema", href(["sources", "northgate"], { tab: "schema" })],
              ["Trap T1 in Northgate's record", itemLink("northgate", "01JCGH7E98RHEM3E2MSH4DMDZS", "med_1", { traps: "1", trap: "T1" })],
            ]}
          >
            Each source documents its own model in a TypeScript schema. The test data contains planted traps. In trap T1, the hospital marks empagliflozin
            held and the family doctor marks it stopped.
          </TourStep>
          <TourStep n={3} title="Recorded agent runs" links={[["Open the Compiler view", href(["compiler"])]]} note="Mapper runs not recorded yet">
            The Compiler view will replay runs in which an agent reads a schema, writes a mapper, and has it scored against answer keys. For now it replays
            the runs that wrote the notes in the test data.
          </TourStep>
          <TourStep n={4} title="Sharing part of a record" links={[["Open the sharing example", href(["sharing"], { s: "context-loss" })]]}>
            Linda shares items with her kidney clinic and withholds her depression treatment, sertraline. Every shared item still verifies. Without the sertraline, the
            nephrology note suggests chlorthalidone is the only suspected cause of her low sodium.
          </TourStep>
          <TourStep n={5} title="Searching a population" links={[]} note="Not built yet">
            The same mappers will run over 300 synthetic patients to find people who match a clinical question.
          </TourStep>
        </ol>
      </section>

      <footer className="home-foot" aria-labelledby="h-isnt">
        <h2 id="h-isnt">About this site</h2>
        <ul>
          <li>Every patient and record here is synthetic. No real health data is used.</li>
          <li>This is a reference implementation of a draft format, with four synthetic sources and the code that signs, verifies and shares their records.</li>
          <li>
            Read the <a href={href(["about", "record-item"])}>specification</a>, or the code on <a href={REPO}>GitHub (jmandel/folio)</a>.
          </li>
        </ul>
      </footer>
    </div>
  );
}

// ─── the idea, as one diagram ────────────────────────────────────────────────────────────────────

function Arrow() {
  return (
    <div className="flow-arrow" aria-hidden="true">
      <svg viewBox="0 0 40 24">
        <path d="M2 12h32M26 4l9 8-9 8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Flow() {
  return (
    <figure className="flow" aria-label="How FOLIO works">
      <div className="flow-stage">
        <h3>Each system publishes its own records</h3>
        <div className="mini" data-src="northgate">
          <div className="mini-src">
            <span className="srcdot" />
            Northgate Family Medicine
          </div>
          <p className="mini-narr">
            <mark>Euglycemic DKA 11/2024. Was held in hospital; stopping.</mark>
          </p>
          <pre className="mini-json">{`med_1: {
  type: "med_event",
  action: "stop", …
}`}</pre>
          <div className="mini-foot">
            <span>
              Schema <code>northgate-chart-v1.d.ts</code>
            </span>
            <span>
              Hash <code className="hash">6acf8173…</code>
            </span>
            <Seal state="ok" label="Signed by the issuer" />
          </div>
        </div>
        <p className="flow-cap">A note and its structured data, signed by the issuer. A TypeScript schema documents the data.</p>
      </div>
      <Arrow />
      <div className="flow-stage once">
        <h3>Once per schema version</h3>
        <ol className="flow-steps">
          <li>An AI agent reads the schema and writes a mapper.</li>
          <li>The mapper is tested against answer keys the agent did not see.</li>
          <li>
            It is cached under the schema's hash, <code className="hash">6acf8173…</code>
          </li>
        </ol>
      </div>
      <Arrow />
      <div className="flow-stage every">
        <h3>Every read after that</h3>
        <p className="flow-cap">The cached mapper runs as ordinary code, with no model call.</p>
        <ul className="flow-views">
          <li>Medications</li>
          <li>Allergies</li>
          <li>Labs and vitals</li>
          <li className="fhir">FHIR, as one more view</li>
        </ul>
      </div>
    </figure>
  );
}

// ─── the trace ───────────────────────────────────────────────────────────────────────────────────

function ExcerptCard({ ex, l, loading }: { ex: Excerpt; l: Loaded | undefined; loading: boolean }) {
  const v = content(l);
  if (!v)
    return (
      <div className="ex">
        <div className="ex-head muted">{loading ? "Loading the signed item…" : `Item ${ex.item} did not verify${l && !l.check.ok ? `: ${l.check.error}` : ""}.`}</div>
      </div>
    );
  const title = itemTitle(ex.source, v.envelope, v.parts, v.payload);
  return (
    <div className="ex" data-testid="excerpt" data-item={ex.item}>
      <div className="ex-head">
        <span className="ex-title">{title}</span>
        <span className="ex-date">{fmtDate(v.envelope.effective)}</span>
      </div>
      {ex.refs.map((r) => {
        const words = spanText(l, r.ref);
        const entry = v.payload[r.ref];
        return (
          <div className="ex-ref" key={r.ref}>
            {words && (
              <blockquote className="ex-quote">
                <mark>{words}</mark>
              </blockquote>
            )}
            {entry != null && r.fields && (
              <dl className="ex-fields">
                {r.fields.map((f) => (
                  <div key={f}>
                    <dt>{f}</dt>
                    <dd>{show(at(entry, f))}</dd>
                  </div>
                ))}
              </dl>
            )}
            <a className="ex-cite" href={itemLink(ex.source, ex.item, r.ref)} title={`Open item ${ex.item} at ${r.ref}`}>
              <code>{r.ref}</code>
              <span>{!words ? "entry only" : entry == null ? "words only" : "words and entry"}</span>
            </a>
          </div>
        );
      })}
      <div className="ex-foot">
        <Seal state="ok" label="Signature verified" />
        <code title={ex.item}>{ex.item.slice(0, 10)}…</code>
      </div>
    </div>
  );
}

function Merged({ items, index }: { items: Map<string, Loaded> | null; index: Index }) {
  const m = DKA_MERGED;
  const answerKey = m.kind === "answer-key";
  return (
    <div className="merged" data-testid="merged" data-kind={m.kind}>
      <div className="merged-head">
        <h3>Merged into a reader's views</h3>
        <span className={`merged-kind${answerKey ? " key" : ""}`}>{answerKey ? "Answer key" : "Compiled mapper output"}</span>
      </div>
      <p className="merged-note">
        {answerKey
          ? "Mappers are not built yet. These rows were written by hand from the synthetic patient's underlying data, as the expected mapper output. Each part cites the source, item and ref it comes from."
          : m.basis}
      </p>
      <div className="m-rows">
      {m.rows.map((row) => (
        <div className="m-row" key={row.view + row.title}>
          <div className="m-view">{row.view}</div>
          <div className="m-body">
            <div className="m-title">{row.title}</div>
            {row.parts.map((p) => (
              <div className="m-part" key={p.label}>
                <span className="m-label">{p.label}</span>
                <span className="m-text">{p.text}</span>
                <span className="m-cites">
                  {p.cites.map((c) => (
                    <CiteChip key={c.item + c.ref} c={c} l={items?.get(c.item)} loading={!items} short={index.sources.find((s) => s.dir === c.source)?.short ?? c.source} />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

function CiteChip({ c, l, loading, short }: { c: Cite; l: Loaded | undefined; loading: boolean; short: string }) {
  const ok = hasRef(l, c.ref);
  const state = loading ? "wait" : ok ? "ok" : "bad";
  return (
    <a
      className="cite"
      data-src={c.source}
      data-testid="cite"
      data-state={state}
      href={itemLink(c.source, c.item, c.ref)}
      title={`(${short}, ${c.item}, ${c.ref}): ${state === "ok" ? "signature verified, ref present" : state === "wait" ? "checking" : "not verified"}`}
    >
      <span className="srcdot" />
      <span>{short}</span>
      <code>{c.item.slice(0, 8)}…</code>
      <code>{c.ref}</code>
      <Seal state={state} />
    </a>
  );
}

// ─── the tour ────────────────────────────────────────────────────────────────────────────────────

function TourStep({ n, title, links, note, children }: { n: number; title: string; links: [string, string][]; note?: string; children: ReactNode }) {
  return (
    <li className="tour-step">
      <span className="tour-n" aria-hidden="true">
        {n}
      </span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
        <p className="tour-links">
          {links.map(([label, h]) => (
            <a key={h} className="btn" href={h}>
              {label}
            </a>
          ))}
          {note && <span className="tour-note">{note}</span>}
        </p>
      </div>
    </li>
  );
}
