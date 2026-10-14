// A side panel where Linda talks the choice over with her own agent. With an OpenRouter key (kept in
// this browser's localStorage only) it calls the model directly from the page; without one it
// replays a recorded conversation.
//
// The recorded conversation is tied to a state: it starts from RECORDED_START with the default
// records, playing it sets that state, and the turn where Linda agrees applies the proposed policy.
// If the settings move away from what the conversation describes, the panel says so. A live
// conversation always gets the current settings in its prompt, and its proposals apply to them.

import { useEffect, useRef, useState } from "react";
import { PRESETS, RECORDED, RECORDED_START, parseReply, presetPolicy, type Policy, type RecordedTurn } from "@folio/sharing";

const KEY_STORE = "folio.openrouter.key";
const MODEL_STORE = "folio.openrouter.model";
export const DEFAULT_MODEL = "anthropic/claude-sonnet-5.5";
// Exact ids from https://openrouter.ai/api/v1/models (checked 2026-10-14). Any id can be typed.
const MODELS = ["anthropic/claude-sonnet-5.5", "deepseek/deepseek-v4.1-flash", "deepseek/deepseek-v4-pro", "anthropic/claude-haiku-5.5", "google/gemini-3.8-flash"];

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

interface ChatTurn extends RecordedTurn {
  /** For live replies: the settings when the question was sent. */
  basis?: Policy;
}

const START = presetPolicy(RECORDED_START);
const START_LABEL = PRESETS.find((p) => p.id === RECORDED_START)!.label;

/** The settings the recorded conversation describes once its first n turns are shown. */
function recordedState(n: number): Policy {
  let p = START;
  for (const t of RECORDED.slice(0, n)) if (t.applies) p = parseReply(t.content).policy ?? p;
  return p;
}

export function SharingChat({
  open,
  autoplay,
  systemPrompt,
  knownKeys,
  current,
  recordsMatch,
  effect,
  onApply,
  onReset,
}: {
  open: boolean;
  /** Show this many recorded turns at once (from a deep link), with the settings they describe. */
  autoplay: number | null;
  systemPrompt: () => string;
  knownKeys: Set<string>;
  current: Policy;
  /** True when the records being sent are the ones the recorded conversation was written for. */
  recordsMatch: boolean;
  effect: (p: Policy, base?: Policy) => Effect;
  onApply: (p: Policy) => void;
  /** Go back to the default records and the given settings. */
  onReset: (p: Policy) => void;
}) {
  const [key, setKey] = useState(() => load(KEY_STORE));
  const [keyDraft, setKeyDraft] = useState("");
  const [model, setModel] = useState(() => load(MODEL_STORE) || DEFAULT_MODEL);
  const [live, setLive] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const jumpTo = (n: number) => {
    setPlaying(false);
    setStarted(true);
    setShown(n);
    onReset(recordedState(n));
  };
  const play = () => {
    setStarted(true);
    setShown(0);
    onReset(START);
    setPlaying(true);
  };

  // Deep link: show the first n turns and the settings they describe.
  useEffect(() => {
    if (autoplay !== null && !key) jumpTo(Math.min(autoplay, RECORDED.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const expected = recordedState(shown);
  const offTrack = !key && started && (!recordsMatch || !samePolicy(current, expected));

  // Recorded replay: one turn at a time. The turn where Linda agrees applies its policy.
  useEffect(() => {
    if (!playing) return;
    if (offTrack || shown >= RECORDED.length) return setPlaying(false);
    const t = setTimeout(
      () => {
        const turn = RECORDED[shown];
        setShown(shown + 1);
        if (turn.applies) onApply(recordedState(shown + 1));
      },
      shown === 0 ? 200 : RECORDED[shown].role === "assistant" ? 1400 : 900,
    );
    return () => clearTimeout(t);
  }, [playing, shown, offTrack, onApply]);

  const turns: ChatTurn[] = key ? live : RECORDED.slice(0, shown);
  useEffect(() => {
    if (turns.length) endRef.current?.scrollIntoView({ block: "nearest" });
  }, [turns.length]);

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    const basis = current;
    const next = [...live, { role: "user" as const, content: text }];
    setLive(next);
    setDraft("");
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Title": "FOLIO workbench" },
        body: JSON.stringify({ model, messages: [{ role: "system", content: systemPrompt() }, ...next.map(({ role, content }) => ({ role, content }))] }),
      });
      const body = await r.json().catch(() => null);
      if (!r.ok) throw new Error(body?.error?.message ?? `HTTP ${r.status}`);
      const content = body?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || !content.trim()) throw new Error("the model returned no text");
      setLive([...next, { role: "assistant", content, basis }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <details className="chat" open={open} data-testid="chat" data-shown={key ? undefined : shown} data-off-track={offTrack ? "1" : undefined}>
      <summary>
        Talk it over with your assistant <span className="muted">(optional)</span>
      </summary>
      <p className="chat-intro">
        Say in your own words what you want to keep private. Your assistant explains what the clinic would see and suggests a change to your current
        settings. Nothing changes until you press Apply.
      </p>

      {!key && (
        <div className="chat-mode" data-testid="chat-state">
          {offTrack ? (
            <span className="chat-off">
              Your settings no longer match this conversation. It is written for the five default records and starts from “{START_LABEL}”.
            </span>
          ) : (
            <span>
              This example conversation starts from “{START_LABEL}”.{" "}
              {started ? "The change is applied when Linda agrees to it." : "Playing it switches to that choice, and applies the change when Linda agrees to it."}
            </span>
          )}
          {offTrack || shown >= RECORDED.length ? (
            <button className="btn small" onClick={play}>
              Replay from the start
            </button>
          ) : (
            <>
              <button className="btn small" onClick={() => (started ? setPlaying((p) => !p) : play())}>
                {playing ? "Pause" : shown ? "Continue" : "Play"}
              </button>
              <button className="btn small" onClick={() => jumpTo(RECORDED.length)}>
                Show all
              </button>
            </>
          )}
        </div>
      )}

      <div className="chat-log" aria-live="polite">
        {turns.map((t, i) => (
          <Turn
            key={i}
            turn={t}
            knownKeys={knownKeys}
            current={current}
            effect={effect}
            onApply={onApply}
            recordedBase={key ? undefined : recordedState(i)}
          />
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
  recordedBase,
}: {
  turn: ChatTurn;
  knownKeys: Set<string>;
  current: Policy;
  effect: (p: Policy, base?: Policy) => Effect;
  onApply: (p: Policy) => void;
  /** Recorded turns: the settings the conversation describes just before this turn. */
  recordedBase?: Policy;
}) {
  if (turn.role === "user") return <div className="chat-msg user">{turn.content}</div>;
  const r = parseReply(turn.content, knownKeys);
  const p = r.policy;
  // A recorded proposal is shown against the conversation's own state; a live one against the current settings.
  const fx = p ? effect(p, recordedBase) : null;
  const stale = !recordedBase && turn.basis && !samePolicy(turn.basis, current);
  const inUse = p && samePolicy(p, current);
  return (
    <div className="chat-msg assistant">
      <MiniMarkdown text={r.text} />
      {r.error && <div className="error-box small">The suggested change could not be used: {r.error}</div>}
      {p && fx && (
        <div className="chat-proposal" data-testid="chat-proposal">
          <div>
            <b>{recordedBase && turn.applies ? "Applied:" : "Suggested change:"}</b>{" "}
            {fx.nowShared.length + fx.nowWithheld.length === 0 ? "No part changes. " : null}
            {fx.nowShared.length > 0 && <>Shares {list(fx.nowShared)}. </>}
            {fx.nowWithheld.length > 0 && <>Holds back {list(fx.nowWithheld)}. </>}
            {fx.withheld} of {fx.total} parts held back after this change.
            {stale && <div className="small muted">Your settings changed after this reply. The change shown is from your current settings.</div>}
          </div>
          {!recordedBase && (
            <button className="btn small primary" disabled={!!inUse} onClick={() => onApply(p)}>
              {inUse ? "In use" : "Apply"}
            </button>
          )}
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
