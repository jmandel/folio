#!/usr/bin/env bash
tmux set-option -w -t "$TMUX_PANE" remain-on-exit on 2>/dev/null
cd '/home/jmandel/hobby/folio/.worktrees/stage1/runs/smoke/claude-haiku-tmux' || exit 1
unset CLAUDE_CODE_CHILD_SESSION CLAUDE_CODE_SESSION_ID CLAUDE_PID CLAUDE_EFFORT CLAUDE_CODE_MESSAGING_SOCKET CLAUDE_CODE_BRIDGE_SESSION_ID CLAUDECODE CLAUDE_CODE_SESSION_ATTENDED CLAUDE_CODE_ENTRYPOINT CLAUDE_CODE_EXECPATH CLAUDE_CODE_MESSAGING_TOKEN
'claude' '-p' '--output-format' 'stream-json' '--verbose' '--permission-mode' 'acceptEdits' '--tools=Read,Write,Edit,Glob,Grep' '--allowedTools=Read,Write,Edit,Glob,Grep' '--safe-mode' '--setting-sources=' '--strict-mcp-config' '--no-session-persistence' '--model' 'haiku' < prompt.md 2> stderr.log | tee transcript.jsonl
echo "${PIPESTATUS[0]}" > exit_code
