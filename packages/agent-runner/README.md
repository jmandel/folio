# @folio/agent-runner

Runs one task through a CLI agent (`claude` or `codex`) non-interactively, records everything
under `runs/`, and lets later code replay the result from disk without calling the agent again.

## API

```ts
import { runAgent, replay, listRuns, pool, findRepoRoot } from "@folio/agent-runner";

const r = await runAgent(
  { family: "compiler/epic", prompt: "Read in/schema.json and write out/transform.ts",
    inputs: { "schema.json": "…" }, backend: "claude", model: "haiku",
    expectFiles: ["transform.ts"], tmux: true },
  { retries: 1, onEvent: (e) => console.log(e) },
);
r.meta.ok; r.outputs["transform.ts"]; r.finalText; r.meta.costUsd;

replay("compiler/epic", r.meta.runId);   // same RunResult, disk only
listRuns("compiler/epic");               // RunMeta[], oldest first
await pool(items, 4, (item, i) => runAgent(/* … */));
```

- `runAgent` never throws for agent failure (non-zero exit, timeout, CLI missing, agent-reported
  error, missing `expectFiles`); it returns `meta.ok === false` with `meta.error`. It throws only for
  programmer errors (bad backend, absolute/`..` paths, an existing run dir).
- A failed run is retried `retries` times (default 1) as a new run dir `<runId>-a2`, `-a3`, … with
  `meta.attempt` and `meta.previousRunId` set. The last attempt is returned.
- Default run id: UTC timestamp to the millisecond + 4 random chars (`20261013T190459993Z-k3f9`),
  so ids sort by time. Default `runsRoot`: `<findRepoRoot()>/runs`.
- Timeout (default 15 min) kills the whole process group (SIGTERM, then SIGKILL after 3 s).
- `tmux: true | { session?, window? }` runs the command in a window of tmux session
  `folio-agents` (created if missing), window name `<family>/<runId>`. stdout goes through `tee`, so
  the raw event stream is visible; the window stays open after exit (`remain-on-exit`). The runner
  polls for an `exit_code` file and on timeout kills the pane's process group and the window.

## Run directory

```
runs/<family>/<runId>/
  prompt.md         prompt as sent (caller's prompt + standard footer about ./out and ./in)
  in/…              task.inputs
  out/…             files the agent wrote (-> outputs, meta.producedFiles)
  transcript.jsonl  raw CLI stdout (claude stream-json / codex exec --json)
  stderr.log
  meta.json         RunMeta: cmd, cwd, timings, exit code, ok/error, cost, usage, turns, session id
  tmux.sh, exit_code   tmux mode only
```

The agent's cwd is the run dir. `finalText` is claude's `result` event text, or codex's last
`agent_message`. Cost/usage/turns/session come from claude's `result` event; codex reports token
usage (summed over `turn.completed` events) and no cost.

## CLI flags

claude (prompt on stdin):

```
claude -p --output-format stream-json --verbose --permission-mode acceptEdits
  --tools=<allowed> --allowedTools=<allowed> --safe-mode --setting-sources=
  --strict-mcp-config --no-session-persistence [--model M] [extraArgs]
```

- `acceptEdits` + `--allowedTools`: file tools run without prompts; anything else is denied in `-p`.
- `--tools` limits the available tools to the same list (default Read, Write, Edit, Glob, Grep).
- `--safe-mode` disables CLAUDE.md, skills, plugins, hooks and custom agents; `--setting-sources=`
  skips user/project/local settings; `--strict-mcp-config` drops MCP servers. Together these keep the
  user's and repo's CLAUDE.md, memory and settings out of the run while OAuth login still works.
  (`--bare` would be stricter but requires `ANTHROPIC_API_KEY`; OAuth is not read.)
- `--no-session-persistence`: runs don't land in `~/.claude` session history.
- The child env drops `CLAUDECODE`, `CLAUDE_PID`, `CLAUDE_EFFORT` and `CLAUDE_CODE_*` (except
  `CLAUDE_CODE_USE_*`, `…OAUTH_TOKEN`, `…API_KEY`) so a run launched from inside Claude Code does not
  attach to the parent session.

codex (prompt on stdin via `-`):

```
codex exec --json -C <runDir> --skip-git-repo-check -s workspace-write
  -c approval_policy="never" --ephemeral --disable memories [-m M] [extraArgs] -
```

- `workspace-write` lets codex write in the run dir only; `approval_policy="never"` never blocks.
- `--ephemeral` keeps the session out of `~/.codex/sessions`; `--disable memories` keeps memory out.
  The user's `config.toml` (default model, auth) is still loaded; add `--ignore-user-config` via
  `extraArgs` for a fully clean config.

## Tests

`bun test test/unit.test.ts` uses `__setBackendCommandForTests` to swap in `test/fake-agent.ts`
(recording, outputs, timeout tree-kill, retries, replay, tmux, pool). `FOLIO_SMOKE=1 bun test
test/smoke.test.ts` makes real calls (claude haiku, codex, claude haiku in tmux) into `runs/smoke/`.
