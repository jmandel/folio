// A side panel where Linda talks the choice over with her own agent. With an OpenRouter key (kept in
// this browser's localStorage only) it calls the model directly from the page; without one it
// replays a recorded conversation. Either way the agent only proposes a policy; she applies it.

import { useEffect, useRef, useState } from "react";
import { RECORDED, parseReply, type Policy, type RecordedTurn } from "@folio/sharing";

const KEY_STORE = "folio.openrouter.key";
const MODEL_STORE = "folio.openrouter.model";
export const DEFAULT_MODEL = "anthropic/claude-sonnet-5.5";
// Exact ids from https://openrouter.ai/api/v1/models (checked 2026-10-14). Any id can be typed.
const MODELS = ["anthropic/claude-sonnet-5.5", "deepseek/deepseek-v4-pro", "anthropic/claude-haiku-5.5", "google/gemini-3.8-flash"];

const load = (k: string) => {
  try {
    return localStorage.getItem(k) ?? "";
  } catch {
    return "";
  }
};
const save = (k: string, v: string) => {
  try {
    if (v) localStorage.setItem(k, v);
    else localStorage.removeItem(k);
  } catch {
    /* storage blocked: the key lasts until the page closes */
  }
};

export interface Effect {
  withheld: number;
  total: number;
  /** Parts that would change, in plain words. */
  nowShared: string[];
  nowWithheld: string[];
}

export function SharingChat({
  open,
  autoplay,
  systemPrompt,
  knownKeys,
  current,
  effect,
  onApply,
}: {
  open: boolean;
  autoplay: boolean;
  systemPrompt: () => string;
  knownKeys: Set<string>;
  current: Policy;
  effect: (p: Policy) => Effect;
  onApply: (p: Policy) => void;
}) {
  const [key, setKey] = useState(() => load(KEY_STORE));
  const [keyDraft, setKeyDraft] = useState("");
  const [model, setModel] = useState(() => load(MODEL_STORE) || DEFAULT_MODEL);
  const [live, setLive] = useState<RecordedTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shown, setShown] = useState(autoplay ? RECORDED.length : 0);
  const [playing, setPlaying] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Recorded replay: one turn at a time.
  useEffect(() => {
    if (!playing) return;
    if (shown >= RECORDED.length) return setPlaying(false);
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 200 : RECORDED[shown].role === "assistant" ? 1400 : 900);
    return () => clearTimeout(t);
  }, [playing, shown]);

  const turns = key ? live : RECORDED.slice(0, shown);
  useEffect(() => {
    if (turns.length) endRef.current?.scrollIntoView({ block: "nearest" });
  }, [turns.length]);

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    const next = [...live, { role: "user" as const, content: text }];
    setLive(next);
    setDraft("");
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Title": "FOLIO workbench" },
        body: JSON.stringify({ model, messages: [{ role: "system", content: systemPrompt() }, ...next] }),
      });
      const body = await r.json().catch(() => null);
      if (!r.ok) throw new Error(body?.error?.message ?? `HTTP ${r.status}`);
      const content = body?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) throw new Error("the model returned no text");
      setLive([...next, { role: "assistant", content }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <details className="chat" open={open} data-testid="chat">
      <summary>
        Talk it over with your assistant <span className="muted">(optional)</span>
      </summary>
      <p className="chat-intro">
        Say in your own words what you want to keep private. Your assistant explains what the clinic would see and suggests a choice. Nothing changes until you
        press Apply.
      </p>

      {!key && (
        <div className="chat-mode">
          <span>Showing a recorded conversation.</span>
          {shown < RECORDED.length ? (
            <>
              <button className="btn small" onClick={() => setPlaying((p) => !p)} disabled={false}>
                {playing ? "Pause" : shown ? "Continue" : "Play"}
              </button>
              <button className="btn small" onClick={() => (setPlaying(false), setShown(RECORDED.length))}>
                Show all
              </button>
            </>
          ) : (
            <button className="btn small" onClick={() => (setShown(0), setPlaying(true))}>
              Replay
            </button>
          )}
        </div>
      )}

      <div className="chat-log" aria-live="polite">
        {turns.map((t, i) => (
          <Turn key={i} turn={t} knownKeys={knownKeys} current={current} effect={effect} onApply={onApply} />
        ))}
        {busy && <div className="chat-msg assistant muted">Thinking…</div>}
        <div ref={endRef} />
      </div>
      {error && <div className="error-box small">The assistant could not answer: {error}</div>}

      {key ? (
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            value={draft}
            rows={2}
            placeholder="For example: I don't want them to know about my depression."
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button className="btn" type="submit" disabled={busy || !draft.trim()}>
            Send
          </button>
        </form>
      ) : null}

      <details className="chat-settings">
        <summary>{key ? `Live: ${model}` : "Use a live assistant"}</summary>
        {!key ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const k = keyDraft.trim();
              if (!k) return;
              save(KEY_STORE, k);
              setKey(k);
              setKeyDraft("");
            }}
          >
            <label>
              OpenRouter API key
              <input type="password" autoComplete="off" value={keyDraft} onChange={(e) => setKeyDraft(e.target.value)} placeholder="sk-or-…" />
            </label>
            <button className="btn small" type="submit" disabled={!keyDraft.trim()}>
              Save key
            </button>
          </form>
        ) : (
          <button
            className="btn small"
            onClick={() => {
              save(KEY_STORE, "");
              setKey("");
              setLive([]);
            }}
          >
            Forget key
          </button>
        )}
        <label>
          Model
          <input
            list="chat-models"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              save(MODEL_STORE, e.target.value.trim());
            }}
          />
          <datalist id="chat-models">
            {MODELS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>
        <p className="muted">
          The key is stored only in this browser and sent only to openrouter.ai. The model receives a summary of the records being sent (titles, one line per
          part, and what the current choice does with each), not the signed records.
        </p>
      </details>
    </details>
  );
}

function Turn({
  turn,
  knownKeys,
  current,
  effect,
  onApply,
}: {
  turn: RecordedTurn;
  knownKeys: Set<string>;
  current: Policy;
  effect: (p: Policy) => Effect;
  onApply: (p: Policy) => void;
}) {
  if (turn.role === "user") return <div className="chat-msg user">{turn.content}</div>;
  const r = parseReply(turn.content, knownKeys);
  const applied = r.policy && samePolicy(r.policy, current);
  const fx = r.policy ? effect(r.policy) : null;
  return (
    <div className="chat-msg assistant">
      <MiniMarkdown text={r.text} />
      {r.error && <div className="error-box small">The suggested choice could not be used: {r.error}</div>}
      {r.policy && fx && (
        <div className="chat-proposal" data-testid="chat-proposal">
          <div>
            <b>Suggested choice:</b> holds back {fx.withheld} of {fx.total} parts.
            {fx.nowShared.length > 0 && <> Shares {list(fx.nowShared)}.</>}
            {fx.nowWithheld.length > 0 && <> Holds back {list(fx.nowWithheld)}.</>}
          </div>
          <button className="btn small primary" disabled={applied} onClick={() => onApply(r.policy!)}>
            {applied ? "In use" : "Apply"}
          </button>
        </div>
      )}
    </div>
  );
}

const list = (xs: string[]) => (xs.length <= 3 ? xs.join("; ") : `${xs.slice(0, 3).join("; ")} and ${xs.length - 3} more`);

export function samePolicy(a: Policy, b: Policy): boolean {
  const sa = [...a.private].sort().join(), sb = [...b.private].sort().join();
  const oa = JSON.stringify(Object.entries(a.overrides).sort()), ob = JSON.stringify(Object.entries(b.overrides).sort());
  return sa === sb && oa === ob && (a.shareMedicines === b.shareMedicines || a.private.length === 0);
}

/** Paragraphs, "- " lists and **bold**; everything else is text (model output is never inserted as HTML). */
function MiniMarkdown({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).filter((b) => b.trim());
  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/).map((x, i) => (x.startsWith("**") && x.endsWith("**") ? <b key={i}>{x.slice(2, -2)}</b> : <span key={i}>{x}</span>));
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l)))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        return <p key={i}>{inline(b)}</p>;
      })}
    </>
  );
}
