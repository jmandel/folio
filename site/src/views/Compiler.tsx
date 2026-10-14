import { useEffect, useMemo, useRef, useState } from "react";
import { loadMapperRun, loadRun, loadViewsText, type Index, type MapperRunRecord, type ResultCell, type RunRecord, type RunSummary } from "../lib/data.ts";
import { href, type Route } from "../lib/route.ts";
import { narrativeHtml, partsFromTagged } from "../lib/markdown.ts";
import { Markdown } from "../components/Markdown.tsx";

const SCORECARD = "https://github.com/jmandel/folio/blob/main/results/stage3/SCORECARD.md";
const REPO_BLOB = "https://github.com/jmandel/folio/blob/main/";
const BACKEND_LABEL: Record<string, string> = { "claude-opus": "Claude Opus", "codex-gpt-6-astra": "Codex", "claude-sonnet": "Claude Sonnet" };
const SRC_ORDER = ["riverside", "northgate", "lakeview", "homelog"];

export function CompilerView({ index, route }: { index: Index; route: Route }) {
  const runId = route.path[1] ?? "results";
  const runs = index.runs;
  const summary = runs.find((r) => r.runId === runId);
  const mapperSummary = index.mapperRuns.find((r) => r.runId === runId);
  const mapperRuns = [...index.mapperRuns].sort((a, b) => SRC_ORDER.indexOf(a.source) - SRC_ORDER.indexOf(b.source));
  const grouped = useMemo(() => {
    const m = new Map<string, RunSummary[]>();
    const order = index.patients.map((p) => p.patient);
    for (const r of [...runs].sort((a, b) => order.indexOf(a.patient) - order.indexOf(b.patient) || a.source.localeCompare(b.source) || a.attempt - b.attempt))
      m.set(r.patient, [...(m.get(r.patient) ?? []), r]);
    return [...m];
  }, [runs, index.patients]);
  const name = (pid: string) => index.patients.find((p) => p.patient === pid)?.name ?? pid;

  return (
    <div className={`panes${route.path[1] ? " has-detail" : ""}`}>
      <aside className="pane-list" aria-label="Recorded runs">
        <div className="list-head">
          <h1 style={{ font: "600 var(--step-2)/1.2 var(--serif)" }}>Recorded agent runs</h1>
          <div className="patient-meta">
            Each run is one call to a CLI agent, recorded with its prompt, transcript and output files, and replayed here offline.
          </div>
        </div>
        <div className="list-scroll">
          <h2 className="year group">Mappers</h2>
          <a className="run-row results-row" href={href(["compiler", "results"])} aria-current={runId === "results" ? "true" : undefined}>
            <div className="l1">
              <span>Scores on held-out patients</span>
            </div>
            <div className="l2">Views v3, three backends, three runs each</div>
          </a>
          {mapperRuns.map((r) => (
            <a key={r.runId} className="run-row" data-src={r.source} href={href(["compiler", r.runId])} aria-current={r.runId === runId ? "true" : undefined}>
              <div className="l1">
                <span>{index.sources.find((s) => s.dir === r.source)?.short} mapper</span>
                <span className="muted">cached</span>
              </div>
              <div className="l2">
                {r.backend} {r.model ?? ""}, {(r.durationMs / 1000).toFixed(0)} s{r.costUsd ? `, $${r.costUsd.toFixed(3)}` : ""}
              </div>
            </a>
          ))}
          <h2 className="year group">Notes in the test data</h2>
          {grouped.map(([pid, rs]) => (
            <section key={pid}>
              <h3 className="year sub">
                {name(pid)} <span>{rs.length}</span>
              </h3>
              {rs.map((r) => (
                <a key={r.runId} className="run-row" data-src={r.source} href={href(["compiler", r.runId])} aria-current={r.runId === runId ? "true" : undefined}>
                  <div className="l1">
                    <span>
                      {index.sources.find((s) => s.dir === r.source)?.short} notes{r.attempt > 1 ? `, attempt ${r.attempt}` : ""}
                    </span>
                    <span className="muted">
                      {r.accepted}/{r.requested}
                    </span>
                  </div>
                  <div className="l2">
                    {r.backend} {r.model ?? ""}, {(r.durationMs / 1000).toFixed(0)} s{r.costUsd ? `, $${r.costUsd.toFixed(3)}` : ""}
                  </div>
                </a>
              ))}
            </section>
          ))}
        </div>
      </aside>
      <div className="pane-main">
        <a className="back-link" href="#/compiler">
          Back to the run list
        </a>
        {runId === "results" ? (
          <MapperResults index={index} />
        ) : mapperSummary ? (
          <MapperRunViewer key={runId} runId={runId} index={index} />
        ) : summary ? (
          <RunViewer key={runId} runId={runId} index={index} />
        ) : (
          <div className="empty">No recorded run named {runId}.</div>
        )}
      </div>
    </div>
  );
}

function RunViewer({ runId, index }: { runId: string; index: Index }) {
  const [run, setRun] = useState<RunRecord | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    loadRun(runId).then(setRun, (e) => setErr(String(e.message)));
  }, [runId]);
  if (err) return <div className="error-box">{err}</div>;
  if (!run) return <div className="loading">Loading run…</div>;
  const m = run.meta;
  const src = index.sources.find((s) => s.dir === run.source)!;
  const patient = index.patients.find((p) => p.patient === run.patient)!;
  const accepted = run.notes.filter((n) => n.accepted).length;

  return (
    <div data-src={run.source}>
      <header className="run-head">
        <div className="doc-src" style={{ marginBottom: 4 }}>
          <span className="srcdot" />
          {src.name}
        </div>
        <h1>
          Notes for {patient.name}
          {m.attempt > 1 ? `, attempt ${m.attempt}` : ""}
        </h1>
        <div className="facts">
          <span>
            <b>{m.backend}</b> {m.model}
          </span>
          <span>
            <b>{(m.durationMs / 1000).toFixed(1)} s</b> wall time
          </span>
          {m.costUsd !== undefined && (
            <span>
              <b>${m.costUsd.toFixed(4)}</b> reported cost
            </span>
          )}
          <span>
            <b>{m.numTurns ?? "?"}</b> turns
          </span>
          <span>
            <b>
              {accepted} of {run.notes.length}
            </b>{" "}
            notes accepted from this run
          </span>
          <span className="muted">
            <code>runs/{run.family}/{run.runId}</code>
          </span>
        </div>
      </header>

      <p className="intro">
        The structured data for each item already existed. This run asked an agent to write the narrative for {run.notes.length} item
        {run.notes.length === 1 ? "" : "s"} in {src.short}'s style, with <code>&lt;ref&gt;</code> spans around the facts the structured data holds. A
        deterministic validator then checked each note against its request; failures go back to the agent with the problems listed.
        {m.attempt > 1 ? " This is a retry: the prompt ends with the validator's complaints about the previous attempt." : ""}
      </p>

      <section className="stage">
        <h2>
          <span className="n">1</span> Prompt
        </h2>
        <div className={`prompt-box${showPrompt ? "" : " clip"}`}>
          <Markdown text={run.prompt} from="runs" />
        </div>
        <button className="btn" style={{ marginTop: 8 }} onClick={() => setShowPrompt(!showPrompt)}>
          {showPrompt ? "Collapse the prompt" : `Show the whole prompt (${run.prompt.length.toLocaleString()} characters)`}
        </button>
      </section>

      <section className="stage">
        <h2>
          <span className="n">2</span> Transcript
        </h2>
        <Transcript events={run.transcript} />
      </section>

      <section className="stage">
        <h2>
          <span className="n">3</span> Notes written, then validated
        </h2>
        {run.notes.map((n) => (
          <div className="note-card" key={n.key}>
            <div className="nh">
              <code>{n.key}</code>
              {n.accepted ? <span className="badge ok">Accepted</span> : <span className="badge no">Not used from this run</span>}
              {n.item && (
                <a href={href(["record", n.item.pid, n.item.dir, n.item.id])}>Open the signed item in the record</a>
              )}
            </div>
            <div className="narrative" dangerouslySetInnerHTML={{ __html: narrativeHtml(partsFromTagged(n.text)) }} />
          </div>
        ))}
      </section>

    </div>
  );
}

function Transcript({ events }: { events: any[] }) {
  const shown = useMemo(() => flatten(events), [events]);
  const [n, setN] = useState(shown.length);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!playing) return;
    if (n >= shown.length) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => setN((x) => x + 1), 900);
    return () => clearTimeout(timer.current);
  }, [playing, n, shown.length]);
  return (
    <>
      <div className="replay-bar">
        <button
          className="btn primary"
          onClick={() => {
            setN(playing ? n : n >= shown.length ? 1 : n);
            setPlaying(!playing);
          }}
        >
          {playing ? "Pause" : n >= shown.length ? "Replay from the start" : "Continue"}
        </button>
        <button className="btn" onClick={() => (setPlaying(false), setN(shown.length))} disabled={n >= shown.length}>
          Show all
        </button>
        <span className="muted">
          Step {Math.min(n, shown.length)} of {shown.length}
        </span>
      </div>
      <div className="tx">
        {shown.slice(0, n).map((e, i) => (
          <div key={i} className={`tx-ev ${e.cls}${playing && i === n - 1 ? " enter" : ""}`}>
            <div className="who">{e.who}</div>
            {e.body}
          </div>
        ))}
      </div>
    </>
  );
}

function flatten(events: any[]): { who: string; cls: string; body: React.ReactNode }[] {
  const out: { who: string; cls: string; body: React.ReactNode }[] = [];
  for (const ev of events) {
    if (ev.type === "system" && ev.subtype === "init")
      out.push({ who: "Session start", cls: "user", body: <span className="small">Model {ev.model}; tools allowed: {(ev.tools ?? []).join(", ")}</span> });
    else if (ev.type === "assistant")
      for (const c of ev.message?.content ?? []) {
        if (c.type === "text" && c.text?.trim()) out.push({ who: "Agent", cls: "", body: <div>{c.text}</div> });
        else if (c.type === "thinking" && c.thinking?.trim())
          out.push({ who: "Agent (reasoning)", cls: "", body: <details><summary className="small">Show reasoning</summary><div className="small" style={{ whiteSpace: "pre-wrap" }}>{c.thinking}</div></details> });
        else if (c.type === "thinking") out.push({ who: "Agent (reasoning, not recorded)", cls: "", body: <span className="small muted">The backend does not return the reasoning text.</span> });
        else if (c.type === "tool_use")
          out.push({
            who: `Tool call: ${c.name}`,
            cls: "tool",
            body: (
              <>
                {c.input?.file_path && (
                  <div className="small">
                    <code>{String(c.input.file_path).replace(/^.*\/runs\/[^/]+\/[^/]+\//, "")}</code>
                  </div>
                )}
                {typeof c.input?.command === "string" && (
                  <pre className="raw small-pre">{c.input.command.length > 1200 ? c.input.command.slice(0, 1200) + "\n…" : c.input.command}</pre>
                )}
                {typeof c.input?.pattern === "string" && (
                  <div className="small">
                    <code>{c.input.pattern}</code>
                  </div>
                )}
                {typeof c.input?.content === "string" && (
                  <details>
                    <summary className="small">File content ({c.input.content.length.toLocaleString()} characters)</summary>
                    <pre className="raw">{c.input.content}</pre>
                  </details>
                )}
              </>
            ),
          });
      }
    else if (ev.type === "user")
      for (const c of ev.message?.content ?? []) {
        if (c.type === "tool_result")
          out.push({
            who: "Tool result",
            cls: "user",
            body: <span className="small">{(typeof c.content === "string" ? c.content : JSON.stringify(c.content)).replace(/\/home\/[^\s]*\/runs\//g, "runs/").slice(0, 300)}</span>,
          });
      }
    else if (ev.type === "result")
      out.push({
        who: "Run finished",
        cls: "result",
        body: (
          <span className="small">
            {ev.subtype}, {ev.num_turns} turns, {(ev.duration_ms / 1000).toFixed(1)} s{ev.total_cost_usd ? `, $${ev.total_cost_usd.toFixed(4)}` : ""}. Final reply: “
            {String(ev.result ?? "").slice(0, 120)}”
          </span>
        ),
      });
  }
  return out;
}

// ─── mapper compiles ─────────────────────────────────────────────────────────────────────────────

const pct = (x: number) => (x * 100).toFixed(1);
function cellText(c: ResultCell | undefined) {
  if (!c) return "–";
  const range = c.min === c.max ? "" : ` (${pct(c.min)}–${pct(c.max)})`;
  return `${pct(c.mean)}${range}${c.extra ? `, +${c.extra}` : ""}`;
}

function MapperResults({ index }: { index: Index }) {
  const r = index.mapperResults;
  const short = (dir: string) => index.sources.find((s) => s.dir === dir)?.short ?? dir;
  return (
    <div className="results">
      <header className="run-head">
        <h1>Mapper scores on held-out patients</h1>
      </header>
      <div className="results-grid">
        <p className="intro">
          For each source, each backend wrote three mappers, each from the source schema, the views and about eight sample items, with no feedback.
          Every mapper then ran on the records of 180 synthetic patients generated after the answer keys were frozen. The table gives the percentage of
          expected rows that were wrong (missing, duplicated or with a wrong field) as of 13 Oct 2026: the mean over the three mappers, the range in
          brackets, and after <b>+</b> the extra rows in the worst one.
        </p>
        <aside className="caveat results-caveats" aria-label="Limits of these numbers">
          <h3>Limits of this test</h3>
          <p>
            The view instructions restate each source's quirks in general terms, for example that a patient-list entry "paused or stopped for the time
            being" is held. So this measures how well the agents apply rules they were given, not how well they read a schema unaided.
          </p>
          <p>
            Northgate's allergy rows are scored with a key corrected after scoring. Northgate's schema defines its allergy entry type as immune-mediated, and
            the original key did not accept that answer for those entries. Those cells also show the value under the original, frozen key.
          </p>
          <p>All patients and records in this test are synthetic.</p>
          <p>
            <a href={SCORECARD} target="_blank" rel="noopener">
              Full scorecard on GitHub
            </a>
            , with per-trap results, a documentation ablation and the merged-chart scores.
          </p>
        </aside>
      </div>
      <div className="table-wrap">
        <table className="results-table" data-testid="mapper-results">
          <thead>
            <tr>
              <th>Source</th>
              <th>View</th>
              <th className="num">Rows</th>
              {r.backends.map((b) => (
                <th key={b} className="num">
                  {BACKEND_LABEL[b] ?? b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {r.rows.map((row, i) => {
              const first = i === 0 || r.rows[i - 1].source !== row.source;
              return (
                <tr key={row.source + row.view} data-src={row.source} className={first && i > 0 ? "first" : undefined}>
                  <td>
                    {first && (
                      <>
                        <span className="srcdot" /> {short(row.source)}
                      </>
                    )}
                  </td>
                  <td>{row.view}</td>
                  <td className="num">{row.rows.toLocaleString()}</td>
                  {r.backends.map((b) => (
                    <td key={b} className={row.cells[b]?.mean ? "num warn" : "num"}>
                      {cellText(row.cells[b])}
                      {row.frozen[b] && <span className="frozen">frozen key: {cellText(row.frozen[b])}</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MapperRunViewer({ runId, index }: { runId: string; index: Index }) {
  const [run, setRun] = useState<MapperRunRecord | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    loadMapperRun(runId).then(setRun, (e) => setErr(String(e.message)));
  }, [runId]);
  if (err) return <div className="error-box">{err}</div>;
  if (!run) return <div className="loading">Loading run…</div>;
  const m = run.meta;
  const src = index.sources.find((s) => s.dir === run.source)!;
  const lines = run.transform.split("\n").length;
  const views = ["medications", "problems", "allergies", "labs", "vitals"].filter((v) => run.scores?.[v]?.rows);

  return (
    <div data-src={run.source} data-testid="mapper-run">
      <header className="run-head">
        <div className="doc-src" style={{ marginBottom: 4 }}>
          <span className="srcdot" />
          {src.name}
        </div>
        <h1>Mapper for {src.short}'s schema</h1>
        <div className="facts">
          <span>
            <b>{m.backend}</b> {m.model}
          </span>
          <span>
            <b>{(m.durationMs / 1000).toFixed(1)} s</b> wall time
          </span>
          {m.costUsd !== undefined && (
            <span>
              <b>${m.costUsd.toFixed(4)}</b> reported cost
            </span>
          )}
          <span>
            <b>{m.numTurns ?? "?"}</b> turns
          </span>
          <span className="muted">
            <code>runs/{run.family}/{run.runId}</code>
          </span>
        </div>
      </header>

      <p className="intro">
        This run asked an agent to write <code>transform(items, asOf)</code>: a function that turns one patient's {src.short} items into rows for the
        consumer's views (medications, problems, allergies, labs and vitals), each row citing the item and entry it rests on. The agent had the schema,
        the views, {run.samples.length} sample items and a script that type-checks the mapper and runs it on the samples. It got no feedback from the
        scorer. Its <code>transform.ts</code> is the cached mapper the front page runs on Linda's items.
      </p>

      <section className="stage">
        <h2>
          <span className="n">1</span> Prompt and inputs
        </h2>
        <div className={`prompt-box${showPrompt ? "" : " clip"}`}>
          <Markdown text={run.prompt} from="runs" />
        </div>
        <button className="btn" style={{ marginTop: 8 }} onClick={() => setShowPrompt(!showPrompt)}>
          {showPrompt ? "Collapse the prompt" : `Show the whole prompt (${run.prompt.length.toLocaleString()} characters)`}
        </button>
        <ul className="inputs">
          <li>
            <code>in/schema/{src.schemaFile}</code>: the schema as {src.short} publishes it.{" "}
            <a href={href(["sources", src.dir], { tab: "schema" })}>Open it in Sources</a>
          </li>
          <li>
            <ViewsFile />
          </li>
          {run.samples.map((f) => (
            <li key={f.file}>
              <FileBlock file={f.file} text={f.text} />
            </li>
          ))}
          {run.harness.map((f) => (
            <li key={f.file}>
              <FileBlock file={f.file} text={f.text} />
            </li>
          ))}
        </ul>
      </section>

      <section className="stage">
        <h2>
          <span className="n">2</span> Transcript
        </h2>
        <Transcript events={run.transcript} />
      </section>

      <section className="stage">
        <h2>
          <span className="n">3</span> The mapper
        </h2>
        <p className="small muted">
          <code>out/transform.ts</code>, {lines.toLocaleString()} lines, cached as{" "}
          <a href={REPO_BLOB + run.cachePath} target="_blank" rel="noopener">
            <code>{run.cachePath.replace(/([0-9a-f]{8})[0-9a-f]{56}/g, "$1…")}</code>
          </a>
          . The path holds the schema hash and the views hash.
        </p>
        <pre className="raw nowrap code-scroll" data-testid="transform">{run.transform}</pre>
      </section>

      <section className="stage">
        <h2>
          <span className="n">4</span> Checks and scores
        </h2>
        <ul className="checks">
          <li>Type-checks under the harness's strict settings: {run.gates.tsc ? "yes" : "no"}</li>
          <li>Same output when run twice: {run.gates.deterministic ? "yes" : "no"}</li>
          <li>Errors thrown on held-out patients: {run.gates.runtime_errors}</li>
          <li>Imports, clock reads, randomness or I/O: {run.gates.contract_issues === 0 ? "none" : run.gates.contract_issues}</li>
          <li>Transcript scan: {run.gates.isolation_scan}</li>
        </ul>
        {run.scores && (
          <>
            <p className="small">This mapper on the held-out cohort as of 13 Oct 2026:</p>
            <div className="table-wrap">
              <table className="results-table small-table">
                <thead>
                  <tr>
                    <th>View</th>
                    <th className="num">Expected rows</th>
                    <th className="num">Wrong</th>
                    <th className="num">Extra</th>
                  </tr>
                </thead>
                <tbody>
                  {views.map((v) => {
                    const s = run.scores![v];
                    const f = run.frozenScores?.[v];
                    const differs = f && (f.wrongRows !== s.wrongRows || f.extraRows !== s.extraRows);
                    return (
                      <tr key={v}>
                        <td>{v}</td>
                        <td className="num">{s.rows.toLocaleString()}</td>
                        <td className="num">
                          {s.wrongRows}
                          {differs && <span className="frozen">frozen key: {f.wrongRows}</span>}
                        </td>
                        <td className="num">{s.extraRows}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="small">
              <a href={href(["compiler", "results"])}>All backends and runs</a>
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function FileBlock({ file, text }: { file: string; text: string }) {
  return (
    <details>
      <summary>
        <code>{file}</code> <span className="muted small">({text.length.toLocaleString()} characters)</span>
      </summary>
      <pre className="raw nowrap code-scroll">{text}</pre>
    </details>
  );
}

function ViewsFile() {
  const [text, setText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open && text === null) loadViewsText().then(setText);
  }, [open, text]);
  return (
    <details onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary>
        <code>in/views/views.d.ts</code>: the consumer's views
      </summary>
      {text === null ? <div className="loading small">Loading…</div> : <pre className="raw nowrap code-scroll">{text}</pre>}
    </details>
  );
}
