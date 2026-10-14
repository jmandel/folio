// Deterministic checks on a written narrative against its note request: ref spans well-formed and
// each required id exactly once, prose-only facts and negations present, nothing forbidden, and
// sensitive words only inside their own spans (spec/record-item.md, "Span boundaries are
// disclosure boundaries").

import type { NoteRequest } from "./context.ts";

const ID = /^[a-z][a-z0-9_]{0,63}$/;

export interface Span { id: string; text: string; start: number; end: number }

/** Parse <ref> spans. Returns spans and syntax problems. */
export function parseSpans(narrative: string): { spans: Span[]; problems: string[]; plain: string } {
  const problems: string[] = [];
  const spans: Span[] = [];
  const re = /<ref\b[^>]*>|<\/ref>/g;
  let open: { id: string; at: number; contentStart: number } | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(narrative))) {
    const tag = m[0];
    if (tag === "</ref>") {
      if (!open) { problems.push(`stray </ref> at ${m.index}`); continue; }
      const text = narrative.slice(open.contentStart, m.index);
      spans.push({ id: open.id, text, start: open.at, end: m.index + tag.length });
      if (/\n\s*\n/.test(text)) problems.push(`span ${open.id} crosses a paragraph break`);
      if (/\n\s*([-*+]|\d+\.|#)\s/.test(text)) problems.push(`span ${open.id} crosses a list item or heading`);
      if (!text.trim()) problems.push(`span ${open.id} is empty`);
      open = null;
      continue;
    }
    const idm = tag.match(/^<ref id="([^"]*)">$/);
    if (!idm) { problems.push(`malformed ref tag ${tag}`); continue; }
    if (open) problems.push(`span ${idm[1]} nested inside ${open.id}`);
    if (!ID.test(idm[1])) problems.push(`bad ref id '${idm[1]}'`);
    open = { id: idm[1], at: m.index, contentStart: m.index + tag.length };
  }
  if (open) problems.push(`span ${open.id} not closed`);
  const plain = narrative.replace(/<ref id="[^"]*">|<\/ref>/g, "");
  return { spans, problems, plain };
}

const rx = (s: string) => new RegExp(s, "i");

export function validateNarrative(text: string, req: NoteRequest): string[] {
  const problems: string[] = [];
  const t = text.trim();
  if (!t) return ["narrative is empty"];
  if (/^---\s*$/m.test(t.split("\n")[0])) problems.push("narrative starts with YAML frontmatter; write only the note text");
  if (/```+\s*json payload/.test(t)) problems.push("narrative contains a json payload fence");
  if (/!\[/.test(t)) problems.push("narrative contains an image");
  const html = t.replace(/<ref id="[^"]*">|<\/ref>/g, "").match(/<\/?[a-zA-Z][^>]*>/g);
  if (html) problems.push(`raw HTML is not allowed: ${html.slice(0, 3).join(" ")}`);
  const { spans, problems: syn, plain } = parseSpans(t);
  problems.push(...syn);

  const required = [...req.refs.map((r) => r.id), ...req.spans.map((s) => s.id)];
  const counts = new Map<string, number>();
  for (const s of spans) counts.set(s.id, (counts.get(s.id) ?? 0) + 1);
  for (const id of required) {
    const n = counts.get(id) ?? 0;
    if (n !== 1) problems.push(`ref id "${id}" must appear exactly once as a span (found ${n})`);
  }
  for (const id of counts.keys()) if (!required.includes(id)) problems.push(`ref id "${id}" is not one of the allowed ids (${required.join(", ") || "none"})`);

  for (const s of req.spans) {
    const span = spans.find((x) => x.id === s.id);
    if (!span) continue;
    for (const group of s.evidence) if (!group.some((g) => rx(g).test(span.text))) problems.push(`span "${s.id}" must state: ${s.statement} (expected words like /${group.join("|")}/)`);
  }
  for (const f of req.mustInclude) {
    for (const group of f.evidence) if (!group.some((g) => rx(g).test(plain))) problems.push(`must state: ${f.statement} (expected words like /${group.join("|")}/)`);
  }
  for (const f of req.forbidden) {
    const m = plain.match(rx(f.pattern));
    if (m) problems.push(`must not mention "${m[0]}" (${f.statement})`);
  }
  for (const s of req.sensitive) {
    const re = new RegExp(s.pattern, "gi");
    let m: RegExpExecArray | null;
    while ((m = re.exec(t))) {
      const inside = spans.find((sp) => m!.index >= sp.start && m!.index < sp.end);
      if (!inside || !s.allowedIn.includes(inside.id)) {
        problems.push(`sensitive word "${m[0]}" may appear only inside span(s) ${s.allowedIn.join(", ")}`);
        break;
      }
    }
  }
  if (req.skeleton) {
    const pattern = "^" + req.skeleton.split(/\[words\]/).map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("([^\\n]+?)") + "$";
    if (!new RegExp(pattern).test(t)) problems.push(`text must follow the skeleton exactly (time labels, one paragraph per note):\n${req.skeleton}`);
  }
  return problems;
}
