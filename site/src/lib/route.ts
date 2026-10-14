import { useEffect, useState } from "react";

// Hash routes, so the static site needs no server rewrites: #/record/hero/<item>?history=1
export interface Route {
  path: string[];
  query: URLSearchParams;
}

function parse(): Route {
  const h = location.hash.replace(/^#\/?/, "");
  const [p, q = ""] = h.split("?");
  return { path: p.split("/").filter(Boolean).map(decodeURIComponent), query: new URLSearchParams(q) };
}

export function href(path: (string | undefined)[], query?: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined && v !== "") q.set(k, v);
  const qs = q.toString();
  return "#/" + path.filter((x): x is string => !!x).map(encodeURIComponent).join("/") + (qs ? `?${qs}` : "");
}

export function go(path: (string | undefined)[], query?: Record<string, string | undefined>, replace = false) {
  const h = href(path, query);
  if (replace) history.replaceState(null, "", h);
  else location.hash = h;
  if (replace) window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function useRoute(): Route {
  const [r, setR] = useState(parse);
  useEffect(() => {
    const on = () => setR(parse());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return r;
}
