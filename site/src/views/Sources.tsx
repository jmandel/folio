import { useEffect, useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import { parseMarkdown } from "@folio/core";
import { loadSource, type Index, type SourceDoc } from "../lib/data.ts";
import { go, href, type Route } from "../lib/route.ts";
import { docHtml, partsFromTagged } from "../lib/markdown.ts";
import { itemTitle } from "../lib/describe.ts";
import { Markdown } from "../components/Markdown.tsx";
import { ItemDoc } from "../components/ItemDoc.tsx";

hljs.registerLanguage("typescript", typescript);

const ORDER = ["riverside", "northgate", "lakeview", "homelog"];

export function SourcesView({ index, route }: { index: Index; route: Route }) {
  const dir = ORDER.includes(route.path[1]) ? route.path[1] : "riverside";
  const tab = route.query.get("tab") === "examples" ? "examples" : "schema";
  const ex = route.query.get("ex");
  const [doc, setDoc] = useState<SourceDoc | null>(null);
  const src = index.sources.find((s) => s.dir === dir)!;
  useEffect(() => {
    setDoc(null);
    loadSource(dir).then(setDoc);
  }, [dir]);

  return (
    <div>
      <nav className="src-tabs" aria-label="Sources">
        {ORDER.map((d) => {
          const s = index.sources.find((x) => x.dir === d)!;
          return (
            <a key={d} href={href(["sources", d], { tab })} aria-current={d === dir ? "page" : undefined} data-src={d}>
              <span className="srcdot" />
              {s.name}
            </a>
          );
        })}
      </nav>
      {!doc ? (
        <div className="loading">Loading…</div>
      ) : (
        <div className="src-grid" data-src={dir}>
          <section aria-label="README">
            <Markdown text={doc.readme} from={`sources/${dir}`} />
            <p className="small muted" style={{ marginTop: 24 }}>
              Issuer <code>{src.issuer}</code>. The schema is published at{" "}
              <code>https://{src.host}/folio/schemas/{src.schemaFile}</code>; this site serves a copy at{" "}
              <a href={`hosts/${src.host}/folio/schemas/${src.schemaFile}`}>the same path</a> so the record view can check its hash.
            </p>
          </section>
          <section aria-label="Schema and examples">
            <div className="subtabs" role="group">
              <button aria-pressed={tab === "schema"} onClick={() => go(["sources", dir], { tab: "schema" })}>
                Schema
              </button>
              <button aria-pressed={tab === "examples"} onClick={() => go(["sources", dir], { tab: "examples" })}>
                Examples ({doc.examples.length})
              </button>
            </div>
            {tab === "schema" ? <Schema doc={doc} /> : <Examples doc={doc} index={index} dir={dir} ex={ex} />}
          </section>
        </div>
      )}
    </div>
  );
}

// ─── schema: annotated (docstrings as prose beside each declaration) or plain source ───────────

interface Block {
  doc: string;
  code: string;
  indent: number;
}

function splitSchema(text: string): Block[] {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (t.startsWith("/**")) {
      const indent = line.length - line.trimStart().length;
      const docLines: string[] = [];
      let j = i;
      for (; j < lines.length; j++) {
        docLines.push(lines[j]);
        if (lines[j].includes("*/")) break;
      }
      const doc = docLines
        .join("\n")
        .replace(/^\s*\/\*\*\s?/, "")
        .replace(/\s*\*\/\s*$/, "")
        .split("\n")
        .map((l) => l.replace(/^\s*\* ?/, ""))
        .join("\n")
        .trim();
      const code: string[] = [];
      let k = j + 1;
      for (; k < lines.length; k++) {
        const tk = lines[k].trim();
        if (tk.startsWith("/**") || (tk === "" && code.length)) break;
        if (tk === "" && !code.length) continue;
        code.push(lines[k]);
      }
      blocks.push({ doc, code: dedent(code), indent });
      i = k;
    } else if (t === "") {
      i++;
    } else {
      const code: string[] = [];
      let k = i;
      for (; k < lines.length; k++) {
        const tk = lines[k].trim();
        if (tk.startsWith("/**") || tk === "") break;
        code.push(lines[k]);
      }
      const c = dedent(code);
      const prev = blocks[blocks.length - 1];
      if (prev && /^[\s};)\]]*$/.test(c)) prev.code += "\n" + c.trim();
      else blocks.push({ doc: "", code: c, indent: code[0].length - code[0].trimStart().length });
      i = k;
    }
  }
  return blocks;
}
function dedent(lines: string[]): string {
  const n = Math.min(...lines.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length));
  return lines.map((l) => l.slice(Number.isFinite(n) ? n : 0)).join("\n");
}

const hl = (code: string) => hljs.highlight(code, { language: "typescript" }).value;

function Schema({ doc }: { doc: SourceDoc }) {
  const [mode, setMode] = useState<"annotated" | "source">("annotated");
  const blocks = useMemo(() => splitSchema(doc.schemaText), [doc]);
  const lines = doc.schemaText.split("\n").length;
  return (
    <>
      <div className="subtabs" role="group" aria-label="Schema view">
        <button aria-pressed={mode === "annotated"} onClick={() => setMode("annotated")}>
          Docstrings as prose
        </button>
        <button aria-pressed={mode === "source"} onClick={() => setMode("source")}>
          Source file
        </button>
        <span className="small muted">
          <code>{doc.schemaFile}</code>, {lines} lines
        </span>
      </div>
      {mode === "source" ? (
        <pre className="schema-src" dangerouslySetInnerHTML={{ __html: hl(doc.schemaText) }} />
      ) : (
        <div className="schema-ann">
          {blocks.map((b, i) => (
            <div key={i} className={`ann-block${b.indent ? " member" : ""}`}>
              {b.doc && <div className="ann-doc" dangerouslySetInnerHTML={{ __html: docHtml(b.doc).html }} />}
              {b.code.trim() && <pre className="ann-code" dangerouslySetInnerHTML={{ __html: hl(b.code) }} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Examples({ doc, index, dir, ex }: { doc: SourceDoc; index: Index; dir: string; ex: string | null }) {
  const [raw, setRaw] = useState(false);
  const cur = doc.examples.find((e) => e.file === ex) ?? doc.examples[0];
  const src = index.sources.find((s) => s.dir === dir)!;
  const parsed = useMemo(() => {
    try {
      return { item: parseMarkdown(cur.text) };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [cur]);
  return (
    <>
      <div className="ex-list" data-src={dir}>
        {doc.examples.map((e) => (
          <button key={e.file} aria-pressed={e.file === cur.file} onClick={() => go(["sources", dir], { tab: "examples", ex: e.file })}>
            {e.file.replace(/\.folio\.md$/, "")}
          </button>
        ))}
      </div>
      <div className="subtabs" role="group" aria-label="Example view">
        <button aria-pressed={!raw} onClick={() => setRaw(false)}>
          Rendered
        </button>
        <button aria-pressed={raw} onClick={() => setRaw(true)}>
          .folio.md text
        </button>
        <span className="small muted">Hand-written examples. Each one appears unchanged in Linda's record.</span>
      </div>
      {raw ? (
        <pre className="raw nowrap" style={{ maxHeight: "none" }}>
          {cur.text}
        </pre>
      ) : "item" in parsed && parsed.item ? (
        <ItemDoc
          source={src}
          env={parsed.item}
          parts={partsFromTagged(parsed.item.narrative)}
          payload={parsed.item.payload}
          title={itemTitle(dir, parsed.item, partsFromTagged(parsed.item.narrative), parsed.item.payload)}
        />
      ) : (
        <div className="error-box">This example did not parse: {(parsed as { error: string }).error}</div>
      )}
    </>
  );
}
