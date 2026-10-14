// Linda's chart as the cached mappers and the generic merge produce it (site/scripts/merged-story.ts
// writes the rows; this only displays them). Each row's sources link to the items its evidence cites.

import { useEffect, useState } from "react";
import type { Index } from "../lib/data.ts";
import { href } from "../lib/route.ts";
import { checkOf } from "../lib/record.ts";
import { Seal } from "./ItemDoc.tsx";

type Row = Record<string, any>;
interface Chart {
  patient: string;
  asOf: string;
  basis: string;
  rows: { medications: Row[]; problems: Row[]; allergies: Row[]; labs: Row[]; vitals: Row[] };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function date(d: string | undefined): string {
  if (!d) return "";
  const [y, m, day] = d.slice(0, 10).split("-");
  return [day ? String(+day) : "", m ? MONTHS[+m - 1] : "", y].filter(Boolean).join(" ");
}
const words = (s: unknown) => String(s ?? "").replace(/_/g, " ");
const VITALS_SHOWN = 20;

export function MappedChart({ index, pid, qs }: { index: Index; pid: string; qs: (o?: Record<string, string | undefined>) => Record<string, string | undefined> }) {
  const [chart, setChart] = useState<Chart | null>(null);
  const [allVitals, setAllVitals] = useState(false);
  useEffect(() => {
    import("../story/hero-chart.json").then((m) => setChart(m.default as unknown as Chart));
  }, []);
  if (!chart) return <div className="loading">Loading the chart…</div>;
  const short = (dir: string) => index.sources.find((s) => s.dir === dir)?.short ?? dir;
  const Cites = ({ r }: { r: Row }) => (
    <span className="chart-cites">
      {(r.evidence ?? []).map((e: any) => {
        const c = checkOf(pid, `${e.source}/${e.item_id}`);
        return (
          <a
            key={e.source + e.item_id + e.entry_id}
            className="cite"
            data-src={e.source}
            href={href(["record", pid, e.source, e.item_id], qs({ ref: e.entry_id }))}
            title={`(${short(e.source)}, ${e.item_id}, ${e.entry_id})`}
          >
            <span>{short(e.source)}</span>
            <code>{e.entry_id}</code>
            <Seal state={c ? (c.ok ? "ok" : "bad") : "wait"} />
          </a>
        );
      })}
    </span>
  );
  const { medications, problems, allergies, labs, vitals } = chart.rows;
  const labsByDate = [...labs].sort((a, b) => String(b.collected).localeCompare(String(a.collected)));
  const vitalsByDate = [...vitals].sort((a, b) => String(b.local_time).localeCompare(String(a.local_time)));
  const shownVitals = allVitals ? vitalsByDate : vitalsByDate.slice(0, VITALS_SHOWN);

  return (
    <div className="chart" data-testid="mapped-chart">
      <div className="intro">
        <h1 style={{ font: "600 1.75rem/1.2 var(--serif)", color: "var(--ink)", marginBottom: 10 }}>Linda's chart from the compiled mappers</h1>
        <p>
          Each source's cached mapper turned its items into view rows as of {date(chart.asOf)}, and the generic merge combined them. The rows are shown
          as the code produced them. Each source tag opens the item and entry the row cites.
        </p>
        <details className="merged-basis">
          <summary>Mappers and schema hashes</summary>
          <p>{chart.basis}</p>
        </details>
      </div>

      <section className="chart-sec">
        <h2>Medications <span>{medications.length}</span></h2>
        <div className="table-wrap">
          <table className="results-table chart-table">
            <thead>
              <tr><th>Medicine</th><th>Status</th><th>Dose</th><th>Sources</th></tr>
            </thead>
            <tbody>
              {medications.map((r, i) => (
                <tr key={i}>
                  <td>
                    {r.ingredient ?? r.drug_name}
                    <span className="sub">{r.drug_name}{r.patient_reported ? ", patient's own list" : ""}</span>
                  </td>
                  <td>
                    {r.status}
                    {r.status_since ? ` since ${date(r.status_since)}` : ""}
                    {r.stop_reason && <span className="sub">{words(r.stop_reason)}</span>}
                  </td>
                  <td>{[r.dose && `${r.dose.value} ${r.dose.unit}`, r.frequency].filter(Boolean).join(" ")}</td>
                  <td><Cites r={r} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="chart-sec">
        <h2>Problems <span>{problems.length}</span></h2>
        <div className="table-wrap">
          <table className="results-table chart-table">
            <thead>
              <tr><th>Condition</th><th>Status</th><th>Onset</th><th>Sources</th></tr>
            </thead>
            <tbody>
              {problems.map((r, i) => (
                <tr key={i}>
                  <td>
                    {r.condition}
                    <span className="sub">{[r.icd10cm && `ICD-10-CM ${r.icd10cm}`, r.ckd_stage, r.albuminuria].filter(Boolean).join(", ")}</span>
                  </td>
                  <td>{r.status}</td>
                  <td>{date(r.onset?.value)}</td>
                  <td><Cites r={r} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="chart-sec">
        <h2>Allergies and intolerances <span>{allergies.length}</span></h2>
        <div className="table-wrap">
          <table className="results-table chart-table">
            <thead>
              <tr><th>Substance</th><th>Reaction</th><th>Type</th><th>Criticality</th><th>Sources</th></tr>
            </thead>
            <tbody>
              {allergies.map((r, i) => (
                <tr key={i}>
                  <td>{r.substance}</td>
                  <td>{r.reaction}{r.onset ? <span className="sub">onset {date(r.onset.value)}</span> : null}</td>
                  <td>{words(r.reaction_type)}</td>
                  <td>{r.criticality}</td>
                  <td><Cites r={r} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="chart-sec">
        <h2>Labs <span>{labs.length}</span></h2>
        <div className="table-wrap">
          <table className="results-table chart-table">
            <thead>
              <tr><th>Collected</th><th>Analyte</th><th className="num">Value</th><th>Status</th><th>Sources</th></tr>
            </thead>
            <tbody>
              {labsByDate.map((r, i) => (
                <tr key={i}>
                  <td>{date(r.collected)}</td>
                  <td>{r.analyte}</td>
                  <td className="num">{r.comparator ?? ""}{r.value} {r.unit}</td>
                  <td>{r.status}</td>
                  <td><Cites r={r} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="chart-sec">
        <h2>Vitals <span>{vitals.length}</span></h2>
        <div className="table-wrap">
          <table className="results-table chart-table">
            <thead>
              <tr><th>Time</th><th>Setting</th><th className="num">BP</th><th className="num">Pulse</th><th className="num">Glucose</th><th className="num">Weight</th><th>Sources</th></tr>
            </thead>
            <tbody>
              {shownVitals.map((r, i) => (
                <tr key={i}>
                  <td>{date(r.local_time)} {String(r.local_time ?? "").slice(11, 16)}</td>
                  <td>{r.setting}</td>
                  <td className="num">{r.systolic_mmhg != null ? `${r.systolic_mmhg}/${r.diastolic_mmhg}` : ""}</td>
                  <td className="num">{r.pulse_bpm ?? ""}</td>
                  <td className="num">{r.glucose_mg_dl != null ? `${r.glucose_mg_dl} mg/dL` : ""}</td>
                  <td className="num">{r.weight_kg != null ? `${r.weight_kg} kg` : ""}</td>
                  <td><Cites r={r} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {vitals.length > VITALS_SHOWN && (
          <button className="btn" style={{ marginTop: 8 }} onClick={() => setAllVitals(!allVitals)}>
            {allVitals ? `Show the latest ${VITALS_SHOWN}` : `Show all ${vitals.length}`}
          </button>
        )}
      </section>
    </div>
  );
}
