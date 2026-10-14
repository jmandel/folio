// Static data prepared by scripts/prepare-data.ts. Every path is relative to the page, so the site
// works under any base path (e.g. joshuamandel.com/folio/).

export interface SourceInfo {
  key: "A" | "B" | "C" | "P";
  dir: string;
  name: string;
  short: string;
  kind: string;
  style: string;
  issuer: string;
  host: string;
  schemaFile: string;
}
export interface PatientInfo {
  patient: string;
  role: "hero" | "secondary" | "population";
  name: string;
  birth_date: string;
  sex: string;
  sources: Record<string, string>;
  items: number;
}
export interface Trap {
  id: string;
  title: string;
  body: string;
}
export interface RunSummary {
  runId: string;
  family: string;
  patient: string;
  source: string;
  attempt: number;
  requested: number;
  accepted: number;
  backend: string;
  model?: string;
  costUsd?: number;
  durationMs: number;
}
export interface Index {
  generated: string;
  patients: PatientInfo[];
  sources: SourceInfo[];
  traps: Trap[];
  spec: string[];
  runs: RunSummary[];
}
export interface SignedItemFile {
  source: string;
  file: string;
  key: string;
  traps: string[];
  fixture?: string;
  sdJwt: string;
}
export interface SourceDoc {
  readme: string;
  schemaFile: string;
  schemaText: string;
  examples: { file: string; text: string }[];
}
export interface RunNote {
  key: string;
  text: string;
  accepted: boolean;
  item?: { pid: string; dir: string; file: string; id: string; issuer: string };
}
export interface RunRecord {
  runId: string;
  family: string;
  patient: string;
  source: string;
  meta: Record<string, any>;
  prompt: string;
  transcript: any[];
  notes: RunNote[];
}

const cache = new Map<string, Promise<unknown>>();
export function getJson<T>(path: string): Promise<T> {
  let p = cache.get(path);
  if (!p) {
    p = fetch(path).then((r) => {
      if (!r.ok) throw new Error(`could not load ${path} (HTTP ${r.status})`);
      return r.json();
    });
    p.catch(() => cache.delete(path));
    cache.set(path, p);
  }
  return p as Promise<T>;
}
export function getText(path: string): Promise<string> {
  let p = cache.get(path);
  if (!p) {
    p = fetch(path).then((r) => {
      if (!r.ok) throw new Error(`could not load ${path} (HTTP ${r.status})`);
      return r.text();
    });
    p.catch(() => cache.delete(path));
    cache.set(path, p);
  }
  return p as Promise<string>;
}

export const loadIndex = () => getJson<Index>("data/index.json");
export const loadPatient = (pid: string) => getJson<{ patient: string; items: SignedItemFile[] }>(`data/patients/${pid}.json`);
export const loadSource = (dir: string) => getJson<SourceDoc>(`data/sources/${dir}.json`);
export const loadRun = (id: string) => getJson<RunRecord>(`data/runs/${id}.json`);
export const loadSpec = (name: string) => getText(`data/spec/${name}.md`);
