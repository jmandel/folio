import { useEffect, useMemo, useRef, useState } from "react";
import { loadRun, type Index, type RunRecord, type RunSummary } from "../lib/data.ts";
import { href, type Route } from "../lib/route.ts";
import { narrativeHtml, partsFromTagged } from "../lib/markdown.ts";
import { Markdown } from "../components/Markdown.tsx";

const DEFAULT_RUN = "20261014T005511Z-hero-riverside-a1";

export function CompilerView({ index, route }: { index: Index; route: Route }) {
  const runId = route.path[1] ?? DEFAULT_RUN;
  const runs = index.runs;
  const summary = runs.find((r) => r.runId === runId);
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
            {runs.length} prose runs for the patients shown on this site. Each run is one call to a CLI agent, recorded with its prompt, transcript and
            output files, and replayed here offline.
          </div>
        </div>
        <div className="list-scroll">
          <div className="year" style={{ position: "static" }}>Mappers</div>
          <div className="empty small">Mapper runs (schema to view) are being recorded in the next stage and will be listed here.</div>
          {grouped.map(([pid, rs]) => (
            <section key={pid}>
              <h2 className="year">
                {name(pid)} <span>{rs.length}</span>
              </h2>
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
        {summary ? <RunViewer key={runId} runId={runId} index={index} /> : <div className="empty">No recorded run named {runId}.</div>}
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

      <section className="stage">
        <h2>
          <span className="n">4</span> Mapper code and scores
        </h2>
        <div className="placeholder-doc">
          Prose runs like this one build the test corpus. The compiler runs come next: for each source schema and target view, an agent writes a
          mapper and its tests, and the harness scores it against answer keys drawn from the clinical truth. Those runs, their code and their scores will
          be replayed here in the same way.
        </div>
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
                <div className="small">
                  <code>{String(c.input?.file_path ?? "").replace(/^.*\/runs\/[^/]+\/[^/]+\//, "")}</code>
                </div>
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
