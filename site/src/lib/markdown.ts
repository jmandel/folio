import MarkdownIt from "markdown-it";
import type { NarrativePart } from "@folio/core";

// Narratives are CommonMark with <ref> spans. We render them with HTML disabled (any other markup
// stays text) and carry ref spans through the parser as private-use marker characters, which are
// turned into <mark> elements afterwards.
const OPEN = "";
const MID = "";
const CLOSE = "";
const WITHHELD = "";

const narrativeMd = new MarkdownIt({ html: false, linkify: false, breaks: false });
narrativeMd.validateLink = (url) => /^https?:/i.test(url);

const escAttr = (s: string) => s.replace(/[&"<>]/g, (c) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[c]!);

/** Renders verified narrative parts to HTML: spans become <mark data-ref>, withheld slots a marker. */
export function narrativeHtml(parts: NarrativePart[]): string {
  const src = parts
    .map((p) => (p.kind === "prose" ? p.text : p.kind === "span" ? `${OPEN}${p.id}|${p.slot}${MID}${p.text}${CLOSE}` : WITHHELD))
    .join("");
  const html = narrativeMd.render(src);
  return html
    .replace(new RegExp(`${OPEN}([a-z][a-z0-9_]*)\\|(\\d+)${MID}`, "g"), (_, id, slot) => `<mark class="ref" data-ref="${escAttr(id)}" data-slot="${slot}" tabindex="0">`)
    .replaceAll(CLOSE, "</mark>")
    .replaceAll(WITHHELD, `<span class="withheld" title="A part of this note was withheld by the person who shared it">withheld</span>`);
}

/** Splits a tagged narrative (with <ref> elements) into parts, without any signature context. */
export function partsFromTagged(narrative: string): NarrativePart[] {
  const parts: NarrativePart[] = [];
  const re = /<ref id="([a-z][a-z0-9_]*)">([\s\S]*?)<\/ref>/g;
  let last = 0;
  let slot = 0;
  for (const m of narrative.matchAll(re)) {
    if (m.index! > last) parts.push({ kind: "prose", text: narrative.slice(last, m.index) });
    parts.push({ kind: "span", slot: slot++, id: m[1], text: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < narrative.length) parts.push({ kind: "prose", text: narrative.slice(last) });
  return parts;
}

// ─── documents (spec pages, READMEs) ────────────────────────────────────────────────────────────

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

export interface DocOptions {
  /** Rewrites a relative link (e.g. "signing.md#context-loss") to an in-app href, or returns null to keep it. */
  rewrite?: (href: string) => string | null;
}

export function docHtml(text: string, opts: DocOptions = {}): { html: string; headings: { level: number; text: string; id: string }[] } {
  const md = new MarkdownIt({ html: false, linkify: true });
  const headings: { level: number; text: string; id: string }[] = [];
  const used = new Map<string, number>();
  md.core.ruler.push("anchors", (state) => {
    const toks = state.tokens;
    for (let i = 0; i < toks.length; i++) {
      if (toks[i].type !== "heading_open") continue;
      const inline = toks[i + 1];
      const plain = inline.children?.map((c) => c.content).join("") ?? inline.content;
      let id = slugify(plain);
      const n = used.get(id) ?? 0;
      used.set(id, n + 1);
      if (n) id = `${id}-${n}`;
      toks[i].attrSet("id", id);
      headings.push({ level: +toks[i].tag.slice(1), text: plain, id });
    }
  });
  const defaultLinkOpen = md.renderer.rules.link_open ?? ((t, i, o, _e, self) => self.renderToken(t, i, o));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet("href") ?? "";
    const r = opts.rewrite?.(href);
    if (r) tokens[idx].attrSet("href", r);
    else if (/^https?:/.test(href)) {
      tokens[idx].attrSet("target", "_blank");
      tokens[idx].attrSet("rel", "noopener");
    }
    return defaultLinkOpen(tokens, idx, options, env, self);
  };
  return { html: md.render(text), headings };
}
