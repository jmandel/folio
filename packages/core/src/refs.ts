// Ref span extraction (spec/record-item.md#ref-spans).
//
// Syntax is exactly `<ref id="ID">` … `</ref>`. A parser matches the exact opening `<ref id="`
// rather than any `<`; a literal `<ref` in text is written `&lt;ref`, so any other `<ref` is an error.

export const ID_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;
const OPEN = '<ref id="';
const CLOSE = "</ref>";

export interface RefSpan {
  id: string;
  /** Inner text of the span, exactly as written (inline Markdown). */
  text: string;
  /** Code-point offsets into the narrative with ref tags removed (start inclusive, end exclusive). */
  start: number;
  end: number;
  /** UTF-16 offsets of the whole element (`<ref …>` through `</ref>`) in the tagged narrative. */
  tagStart: number;
  tagEnd: number;
}

export interface RefExtraction {
  /** The narrative with ref tags removed. */
  plain: string;
  spans: RefSpan[];
  /** Syntax problems; when non-empty, `spans` holds what could be recovered. */
  errors: string[];
}

const cpLen = (s: string) => {
  let n = 0;
  for (const _ of s) n++;
  return n;
};

export function extractRefs(narrative: string): RefExtraction {
  const spans: RefSpan[] = [];
  const errors: string[] = [];
  let plain = "";
  let plainCp = 0;
  let i = 0;
  while (i < narrative.length) {
    const open = narrative.indexOf("<ref", i);
    const strayClose = narrative.indexOf(CLOSE, i);
    if (strayClose !== -1 && (open === -1 || strayClose < open)) {
      errors.push(`stray </ref> at offset ${strayClose}`);
    }
    if (open === -1) {
      const rest = narrative.slice(i);
      plain += rest;
      plainCp += cpLen(rest);
      break;
    }
    const before = narrative.slice(i, open);
    plain += before;
    plainCp += cpLen(before);
    if (!narrative.startsWith(OPEN, open)) {
      errors.push(`'<ref' at offset ${open} is not an exact '<ref id="…">' tag (write a literal as &lt;ref)`);
      plain += "<ref";
      plainCp += 4;
      i = open + 4;
      continue;
    }
    const idEnd = narrative.indexOf('">', open + OPEN.length);
    const id = idEnd === -1 ? "" : narrative.slice(open + OPEN.length, idEnd);
    if (idEnd === -1 || /["<>\s]/.test(id)) {
      errors.push(`malformed ref open tag at offset ${open}`);
      plain += "<ref";
      plainCp += 4;
      i = open + 4;
      continue;
    }
    if (!ID_PATTERN.test(id)) errors.push(`ref id '${id}' does not match ${ID_PATTERN}`);
    const contentStart = idEnd + 2;
    const close = narrative.indexOf(CLOSE, contentStart);
    if (close === -1) {
      errors.push(`ref '${id}' is not closed`);
      const rest = narrative.slice(contentStart);
      plain += rest;
      plainCp += cpLen(rest);
      break;
    }
    const text = narrative.slice(contentStart, close);
    if (text.includes("<ref")) errors.push(`ref '${id}' contains a nested or overlapping '<ref'`);
    if (/\n[ \t]*\n/.test(text)) errors.push(`ref '${id}' crosses a paragraph boundary`);
    if (/\n[ \t]*([-*+]|\d+[.)]|#{1,6})[ \t]/.test(text)) errors.push(`ref '${id}' crosses a list item or heading`);
    const len = cpLen(text);
    spans.push({ id, text, start: plainCp, end: plainCp + len, tagStart: open, tagEnd: close + CLOSE.length });
    plain += text;
    plainCp += len;
    i = close + CLOSE.length;
  }
  return { plain, spans, errors };
}

/** Rebuilds a ref element. */
export function refElement(id: string, text: string): string {
  return `${OPEN}${id}">${text}${CLOSE}`;
}

/**
 * Splits a tagged narrative into prose segments and span slots: `segments[k]` is the prose before
 * slot k, `segments[slots.length]` the prose after the last slot. Joining segments with ref elements
 * restores the narrative exactly.
 */
export function segmentNarrative(narrative: string): { segments: string[]; slots: RefSpan[] } {
  const { spans, errors } = extractRefs(narrative);
  if (errors.length) throw new Error(`narrative has ref syntax errors: ${errors.join("; ")}`);
  const segments: string[] = [];
  let pos = 0;
  for (const s of spans) {
    segments.push(narrative.slice(pos, s.tagStart));
    pos = s.tagEnd;
  }
  segments.push(narrative.slice(pos));
  return { segments, slots: spans };
}
