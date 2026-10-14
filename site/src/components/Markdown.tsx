import { useEffect, useMemo, useRef } from "react";
import { docHtml } from "../lib/markdown.ts";
import { href } from "../lib/route.ts";

const SPEC = ["record-item", "schema-conventions", "signing", "sync"];
const SOURCES = ["riverside", "northgate", "lakeview", "homelog"];

/**
 * Maps repository-relative links in spec pages and READMEs to routes in this site.
 * `from` is the repo directory the document lives in (e.g. "spec", "sources/riverside").
 */
export function repoLink(from: string, link: string): string | null {
  if (/^[a-z]+:/i.test(link)) return null;
  if (link.startsWith("#")) return null;
  const [path, frag] = link.split("#");
  const parts = from.split("/").filter(Boolean);
  for (const seg of path.split("/")) {
    if (seg === "..") parts.pop();
    else if (seg && seg !== ".") parts.push(seg);
  }
  const full = parts.join("/");
  let m;
  if ((m = /^spec\/([\w-]+)\.md$/.exec(full)) && SPEC.includes(m[1])) return href(["about", m[1]], { s: frag });
  if (full === "truth/TRAPS.md") return href(["about", "traps"], { s: frag });
  if (full === "truth/HERO.md") return href(["about", "hero"], { s: frag });
  if ((m = /^sources\/(\w+)\/schema\/.+\.d\.ts$/.exec(full)) && SOURCES.includes(m[1])) return href(["sources", m[1]], { tab: "schema" });
  if ((m = /^sources\/(\w+)\/examples\/(.+\.folio\.md)$/.exec(full)) && SOURCES.includes(m[1])) return href(["sources", m[1]], { tab: "examples", ex: m[2] });
  if ((m = /^sources\/(\w+)(\/README\.md)?$/.exec(full)) && SOURCES.includes(m[1])) return href(["sources", m[1]]);
  return `https://github.com/jmandel/folio/blob/main/${full}${frag ? `#${frag}` : ""}`;
}

/** A rendered Markdown document. Scrolls to `section` (a heading id) when given. */
export function Markdown({ text, from, section, onHeadings }: { text: string; from: string; section?: string | null; onHeadings?: (h: { level: number; text: string; id: string }[]) => void }) {
  const { html, headings } = useMemo(
    () =>
      docHtml(text, {
        rewrite: (l) => {
          if (l.startsWith("#") && l.length > 1) return null;
          return repoLink(from, l);
        },
      }),
    [text, from],
  );
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => onHeadings?.(headings), [headings, onHeadings]);
  useEffect(() => {
    if (section) {
      const el = ref.current?.querySelector(`#${CSS.escape(section)}`);
      if (el) el.scrollIntoView({ block: "start" });
    }
  }, [section, html]);
  // In-page fragment links (#context-loss) scroll within the page instead of changing the route.
  const onClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    const h = a?.getAttribute("href");
    if (h && h.startsWith("#") && !h.startsWith("#/")) {
      e.preventDefault();
      ref.current?.querySelector(`#${CSS.escape(h.slice(1))}`)?.scrollIntoView({ block: "start" });
    }
  };
  return <div className="prose" ref={ref} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
