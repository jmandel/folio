import { useEffect, useState } from "react";
import { defaultView, itemKey, type Envelope, type NarrativePart, type Payload } from "@folio/core";
import { loadPatient, type Index, type SignedItemFile, type SourceInfo } from "./data.ts";
import { check, decodeUnverified, type Check } from "./verify.ts";
import { itemTitle, sortKey } from "./describe.ts";

export interface RecordItem {
  /** "<source dir>/<item id>", used in URLs. */
  ref: string;
  /** (issuer, id) key from @folio/core. */
  key: string;
  file: SignedItemFile;
  source: SourceInfo;
  env: Envelope;
  parts: NarrativePart[];
  payload: Payload;
  title: string;
  sort: number;
  hasNarrative: boolean;
  /** Set when the default view hides the item: which items replaced or retracted it. */
  hidden?: { how: "superseded" | "retracted"; by: string[] };
  /** Items this one replaces (for linking from the replacement to the history). */
  replaces: string[];
}

export interface PatientRecord {
  pid: string;
  items: RecordItem[];
  byKey: Map<string, RecordItem>;
  conflicts: { item: string; by: string[] }[];
}

const records = new Map<string, Promise<PatientRecord>>();
const checks = new Map<string, Check>(); // by `${pid}/${ref}`
const listeners = new Set<() => void>();

export function loadRecord(index: Index, pid: string): Promise<PatientRecord> {
  let p = records.get(pid);
  if (!p) {
    p = loadPatient(pid).then(({ items: files }) => {
      const items: RecordItem[] = files.map((file) => {
        const d = decodeUnverified(file.sdJwt);
        const source = index.sources.find((s) => s.dir === file.source)!;
        const hasNarrative = d.parts.some((x) => x.kind !== "prose" || x.text.trim() !== "");
        return {
          ref: `${file.source}/${d.envelope.id}`,
          key: itemKey(d.envelope),
          file,
          source,
          env: d.envelope,
          parts: d.parts,
          payload: d.payload,
          title: itemTitle(file.source, d.envelope, d.parts, d.payload),
          sort: sortKey(d.envelope.effective),
          hasNarrative,
          replaces: [...(d.envelope.supersedes ?? []), ...(d.envelope.retracts ?? [])].map((id) => itemKey({ issuer: d.envelope.issuer, id })),
        };
      });
      items.sort((a, b) => a.sort - b.sort || a.source.dir.localeCompare(b.source.dir) || a.env.recorded.localeCompare(b.env.recorded));
      const view = defaultView(items.map((i) => i.env));
      for (const it of items) {
        const s = view.superseded.get(it.key);
        const r = view.retracted.get(it.key);
        if (s) it.hidden = { how: "superseded", by: s };
        else if (r) it.hidden = { how: "retracted", by: r };
      }
      return { pid, items, byKey: new Map(items.map((i) => [i.key, i])), conflicts: view.conflicts };
    });
    records.set(pid, p);
    p.then((rec) => verifyAll(rec));
  }
  return p;
}

async function verifyAll(rec: PatientRecord) {
  let n = 0;
  for (const it of rec.items) {
    const k = `${rec.pid}/${it.ref}`;
    if (checks.has(k)) continue;
    const c = await check(it.file.sdJwt);
    // Display only what was verified: replace decoded content with the verified content.
    if (c.ok) {
      it.parts = c.v.parts;
      it.payload = c.v.payload;
      it.env = c.v.envelope;
    }
    checks.set(k, c);
    if (++n % 25 === 0) listeners.forEach((l) => l());
  }
  listeners.forEach((l) => l());
}

export function checkOf(pid: string, ref: string): Check | undefined {
  return checks.get(`${pid}/${ref}`);
}

/** Re-renders when verification results arrive. */
export function useChecks(): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    const l = () => setN((x) => x + 1);
    listeners.add(l);
    return () => void listeners.delete(l);
  }, []);
  return n;
}

export function usePatientRecord(index: Index, pid: string): PatientRecord | null {
  const [rec, setRec] = useState<PatientRecord | null>(null);
  useEffect(() => {
    let live = true;
    setRec(null);
    loadRecord(index, pid).then((r) => live && setRec(r));
    return () => {
      live = false;
    };
  }, [index, pid]);
  return rec;
}
