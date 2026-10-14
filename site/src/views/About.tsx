import { useCallback, useEffect, useState } from "react";
import { loadSpec, type Index } from "../lib/data.ts";
import { href, type Route } from "../lib/route.ts";
import { Markdown } from "../components/Markdown.tsx";

const PAGES = [
  { id: "overview", label: "Overview", group: "About" },
  { id: "record-item", label: "Record items", group: "Specification" },
  { id: "schema-conventions", label: "Schema conventions", group: "Specification" },
  { id: "signing", label: "Signing and disclosure", group: "Specification" },
  { id: "sync", label: "Sync", group: "Specification" },
  { id: "hero", label: "Linda Okafor's story", group: "Test data" },
  { id: "traps", label: "Planted traps", group: "Test data" },
];

export function AboutView({ index, route }: { index: Index; route: Route }) {
  const page = PAGES.some((p) => p.id === route.path[1]) ? route.path[1] : "overview";
  const section = route.query.get("s");
  const [text, setText] = useState<string | null>(null);
  const [headings, setHeadings] = useState<{ level: number; text: string; id: string }[]>([]);
  useEffect(() => {
    setText(null);
    setHeadings([]);
    if (page !== "overview") loadSpec(page).then(setText);
  }, [page]);
  useEffect(() => {
    if (!section) window.scrollTo({ top: 0 });
  }, [page, section]);
  const onHeadings = useCallback((h: { level: number; text: string; id: string }[]) => setHeadings(h), []);

  const from = page === "hero" || page === "traps" ? "truth" : "spec";
  let group = "";
  return (
    <div className="doc-layout">
      <nav className="doc-nav" aria-label="Pages">
        {PAGES.map((p) => {
          const head = p.group !== group ? <h2 key={`g-${p.group}`}>{(group = p.group)}</h2> : null;
          return [
            head,
            <a key={p.id} href={href(["about", p.id])} aria-current={p.id === page ? "page" : undefined}>
              {p.label}
            </a>,
            p.id === page && headings.length > 0 && (
              <div className="toc" key={`toc-${p.id}`} style={{ display: "flex", flexDirection: "column" }}>
                {headings
                  .filter((h) => h.level === 2)
                  .map((h) => (
                    <a key={h.id} href={href(["about", p.id], { s: h.id })}>
                      {h.text}
                    </a>
                  ))}
              </div>
            ),
          ];
        })}
      </nav>
      <div>
        {page === "overview" ? (
          <Overview index={index} />
        ) : text === null ? (
          <div className="loading">Loading…</div>
        ) : (
          <Markdown text={text} from={from} section={section} onHeadings={onHeadings} />
        )}
      </div>
    </div>
  );
}

function Overview({ index }: { index: Index }) {
  const items = index.patients.reduce((n, p) => n + p.items, 0);
  return (
    <div className="prose">
      <h1>Overview</h1>
      <p>
        Today's structured exchange (HL7 v2, C-CDA, FHIR US Core) relies on formats agreed in advance; each sender translates into them and each
        receiver gets what they can express. FOLIO tests a different arrangement. Each system publishes its data in its own model, as signed,
        append-only <strong>record items</strong>. An item binds the readable note a
        clinician wrote to the structured data behind it: words in the note are wrapped in <code>&lt;ref&gt;</code> spans that point at structured
        entries. Each source describes its data with a plain TypeScript schema whose docstrings say what the fields mean.
      </p>
      <p>
        A consumer that needs the data in its own shape (a medication list, a lab chart, FHIR) uses an AI agent once per schema version to write an
        ordinary, deterministic mapper, checks it, and caches it under the schema's hash. In this test bed the check is a score against answer keys
        the agent did not see. Later reads
        run the cached mapper; no model runs at read time. We call this late binding with compiled mappers.
      </p>
      <h2>What this site shows</h2>
      <p>
        Everything here is synthetic. Four made-up systems with deliberately different data models hold records for {index.patients.length} patients
        ({items.toLocaleString()} items on this site). The main example is Linda Okafor: diabetes, kidney disease, a hospital stay for a drug reaction,
        and a referral to a kidney clinic.
      </p>
      <ul>
        <li>
          <a href={href(["record"])}>Record</a>: Linda's items from all four sources by date. Signatures are checked in your browser. Select a highlighted
          phrase to see its structured entry, or the other way round.
        </li>
        <li>
          <a href={href(["sharing"])}>Sharing</a>: Linda shares items with the kidney clinic but withholds her depression and sertraline. The clinic can
          still verify what it receives, and sees where something was withheld.
        </li>
        <li>
          <a href={href(["sources"])}>Sources</a>: each system's README, schema and hand-written examples.
        </li>
        <li>
          <a href={href(["compiler"])}>Compiler</a>: replays of recorded agent runs. So far these are the runs that wrote the notes in the test data.
          Mapper runs are recorded and will be added once their scores have been audited.
        </li>
      </ul>
      <h2>Not built yet</h2>
      <p>
        The record view merges sources by date only. It does not yet read them through the compiled mappers into shared views, and it does not
        de-duplicate a lab result reported by two sources. The planted traps (switch them on in the record view) are the cases the mappers are scored
        on. Population search is not built.
      </p>
      <h2>Specification</h2>
      <p>
        The format is specified in <a href={href(["about", "record-item"])}>record items</a>,{" "}
        <a href={href(["about", "schema-conventions"])}>schema conventions</a>, <a href={href(["about", "signing"])}>signing and disclosure</a>, and{" "}
        <a href={href(["about", "sync"])}>sync</a>. The code is at{" "}
        <a href="https://github.com/jmandel/folio" target="_blank" rel="noopener">
          github.com/jmandel/folio
        </a>
        .
      </p>
    </div>
  );
}
