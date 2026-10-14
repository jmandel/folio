// Truth -> record items for all four sources.

import type { Patient } from "../../truth/src/model.ts";
import { Ctx, type Hints, NO_HINTS, type RenderedItem, uniqueFiles } from "./context.ts";
import { HERO_HINTS } from "./hero-hints.ts";
import { renderHomeLog } from "./homelog.ts";
import { renderLakeview } from "./lakeview.ts";
import { renderNorthgate } from "./northgate.ts";
import { renderRiverside } from "./riverside.ts";

export * from "./context.ts";
export { toMarkdown, parseItem, formatPayload, type Item } from "./item.ts";

export function hintsFor(p: Patient): Hints {
  return p.role === "hero" ? HERO_HINTS : NO_HINTS;
}

export function renderPatient(p: Patient, seed: string): RenderedItem[] {
  const ctx = new Ctx(p, hintsFor(p), seed);
  const c = p.sources.C ? renderLakeview(ctx) : [];
  const b = p.sources.B ? renderNorthgate(ctx, c) : [];
  const a = p.sources.A ? renderRiverside(ctx) : [];
  const h = p.sources.P ? renderHomeLog(ctx) : [];
  for (const group of [a, b, c, h]) {
    group.sort((x, y) => x.file.localeCompare(y.file));
    uniqueFiles(group);
  }
  return [...a, ...b, ...c, ...h];
}
