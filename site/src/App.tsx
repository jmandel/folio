import { useEffect, useState } from "react";
import { loadIndex, type Index } from "./lib/data.ts";
import { useRoute } from "./lib/route.ts";
import { RecordView } from "./views/Record.tsx";
import { SharingView } from "./views/Sharing.tsx";
import { SourcesView } from "./views/Sources.tsx";
import { CompilerView } from "./views/Compiler.tsx";
import { AboutView } from "./views/About.tsx";
import { HomeView } from "./views/Home.tsx";

const TABS = [
  { id: "record", label: "Record" },
  { id: "sharing", label: "Sharing" },
  { id: "sources", label: "Sources" },
  { id: "compiler", label: "Compiler" },
  { id: "about", label: "About" },
];

type Theme = "auto" | "light" | "dark";
function useTheme(): [Theme, () => void] {
  const [t, setT] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) || "auto");
  useEffect(() => {
    if (t === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    try {
      if (t === "auto") localStorage.removeItem("folio-theme");
      else localStorage.setItem("folio-theme", t);
    } catch {
      /* storage unavailable */
    }
  }, [t]);
  return [t, () => setT((x) => (x === "auto" ? "light" : x === "light" ? "dark" : "auto"))];
}

export function App() {
  const route = useRoute();
  const [index, setIndex] = useState<Index | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [theme, cycleTheme] = useTheme();
  useEffect(() => {
    loadIndex().then(setIndex, (e) => setErr(String(e.message ?? e)));
  }, []);
  // The front page is "#/" (or no hash). Unknown paths fall back to it.
  const tab = TABS.some((t) => t.id === route.path[0]) ? route.path[0] : "home";
  const pathKey = route.path.join("/");
  useEffect(() => {
    if (!route.query.get("s")) window.scrollTo({ top: 0 });
  }, [pathKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const label = TABS.find((t) => t.id === tab)?.label;
    document.title = label ? `${label}: FOLIO workbench` : "FOLIO: native clinical records, compiled mappers";
  }, [tab]);

  return (
    <div className="shell">
      <header className="topbar">
        <a className="wordmark" href="#/">
          <b>FOLIO</b>
          <span>workbench</span>
        </a>
        <nav className="tabs" aria-label="Pages">
          <a href="#/" aria-current={tab === "home" ? "page" : undefined}>
            Overview
          </a>
          <span className="tab-group" role="group" aria-labelledby="nav-explore">
            <span className="tab-group-label" id="nav-explore">
              Explore the data
            </span>
            {TABS.map((t) => (
              <a key={t.id} href={`#/${t.id}`} aria-current={t.id === tab ? "page" : undefined}>
                {t.label}
              </a>
            ))}
          </span>
        </nav>
        <button className="theme-btn" onClick={cycleTheme} title="Colour theme: follows the system, light, or dark">
          {theme === "auto" ? "Theme: system" : theme === "light" ? "Theme: light" : "Theme: dark"}
        </button>
      </header>
      <main className="main">
        {err && <div className="error-box">The site data did not load: {err}</div>}
        {!index && !err && <div className="loading">Loading…</div>}
        {index && tab === "home" && <HomeView index={index} route={route} />}
        {index && tab === "record" && <RecordView index={index} route={route} />}
        {index && tab === "sharing" && <SharingView index={index} route={route} />}
        {index && tab === "sources" && <SourcesView index={index} route={route} />}
        {index && tab === "compiler" && <CompilerView index={index} route={route} />}
        {index && tab === "about" && <AboutView index={index} route={route} />}
      </main>
    </div>
  );
}
