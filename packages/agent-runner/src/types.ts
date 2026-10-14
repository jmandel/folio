export type BackendName = "claude" | "codex";

export interface AgentTask {
  /** Runs are recorded under runs/<family>/<runId>/. */
  family: string;
  /** Default: sortable UTC timestamp + short random suffix. */
  runId?: string;
  prompt: string;
  /** Relative path -> content, written under <runDir>/in/ before launch. */
  inputs?: Record<string, string>;
  backend: BackendName;
  /** Passed through as --model (claude) / -m (codex). */
  model?: string;
  /** Kill the process tree after this long. Default 15 minutes. */
  timeoutMs?: number;
  /** Run inside a tmux window so a human can watch. */
  tmux?: boolean | { session?: string; window?: string };
  /** Relative to out/. Any missing file marks the run failed (and retryable). */
  expectFiles?: string[];
  /** claude only. Default ["Read","Write","Edit","Glob","Grep"]. */
  allowedTools?: string[];
  extraArgs?: string[];
  /**
   * Wrap the backend command before it runs, e.g. in a filesystem sandbox (bwrap). Receives the
   * full CLI command and the run dir; returns the command to execute (cwd stays the run dir).
   */
  wrapCommand?: (cmd: string[], runDir: string) => string[];
}

export interface RunMeta {
  runId: string;
  family: string;
  backend: BackendName;
  model?: string;
  attempt: number;
  previousRunId?: string;
  cmd: string[];
  cwd: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  exitCode: number | null;
  timedOut: boolean;
  ok: boolean;
  error?: string;
  costUsd?: number;
  usage?: Record<string, number>;
  numTurns?: number;
  sessionId?: string;
  producedFiles: string[];
  tmux?: { session: string; window: string };
}

export interface RunResult {
  meta: RunMeta;
  runDir: string;
  outputs: Record<string, string>;
  finalText?: string;
}

export interface RunOptions {
  runsRoot?: string;
  /** Extra attempts after a failed run. Default 1. */
  retries?: number;
  retryDelayMs?: number;
  /** Called with each parsed JSON line of the CLI's stdout as it arrives. */
  onEvent?: (e: unknown) => void;
}

/** What a transcript tells us, independent of backend. */
export interface TranscriptSummary {
  finalText?: string;
  costUsd?: number;
  usage?: Record<string, number>;
  numTurns?: number;
  sessionId?: string;
  isError?: boolean;
}
